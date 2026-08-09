import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import type { Prisma } from '@prisma/client';
type ConversationWithDetails = Prisma.ConversationGetPayload<{
  include: {
    participants: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            username: true;
            avatarUrl: true;
            status: true;
          };
        };
      };
    };
    messages: {
      orderBy: {
        createdAt: 'desc';
      };
      take: 1;
    };
  };
}>;
export const getConversations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: req.user.userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                status: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const formatted = conversations.map(
  (conv: ConversationWithDetails) => {
      const otherParticipant = conv.participants.find((p) => p.userId !== req.user?.userId)?.user;
      const lastMessage = conv.messages[0] || null;
      return {
        id: conv.id,
        otherUser: otherParticipant,
        lastMessage,
        updatedAt: conv.updatedAt,
      };
    });

    return sendSuccess(res, formatted);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const getOrCreateConversation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { targetUserId } = req.body;

    if (!targetUserId) return sendError(res, 'targetUserId is required', 400);

    // Find existing conversation between these 2 users
    const existingConv = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: req.user.userId } } },
          { participants: { some: { userId: targetUserId } } },
        ],
      },
    });

    if (existingConv) {
      return sendSuccess(res, { conversationId: existingConv.id });
    }

    const newConv = await prisma.conversation.create({
      data: {
        participants: {
          create: [{ userId: req.user.userId }, { userId: targetUserId }],
        },
      },
    });

    return sendSuccess(res, { conversationId: newConv.id }, 'Conversation created', 201);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { conversationId } = req.params;

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return sendSuccess(res, messages);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { conversationId, content, attachments } = req.body;

    if (!content) return sendError(res, 'Message content is required', 400);

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: req.user.userId,
        content,
        attachments: attachments ? JSON.stringify(attachments) : null,
      },
      include: {
        sender: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return sendSuccess(res, message, 'Message sent', 201);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};
