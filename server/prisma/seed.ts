import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding DevisHub Database...');

  // Reset existing data safely
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postMedia.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.projectStar.deleteMany();
  await prisma.projectSave.deleteMany();
  await prisma.projectDocument.deleteMany();
  await prisma.projectTechnology.deleteMany();
  await prisma.project.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Developers
  const dev1 = await prisma.user.create({
    data: {
      name: 'Alex Vance',
      username: 'alex_dev',
      email: 'alex@devishub.io',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      status: 'ONLINE',
      isVerified: true,
      isOnboarded: true,
      profile: {
        create: {
          headline: 'Senior Systems Architect & Open Source Creator',
          bio: 'Building next-gen distributed systems and developer tooling. Rust & TypeScript enthusiast.',
          location: 'San Francisco, CA',
          timezone: 'UTC-7',
          availability: 'Full-time / Advisory',
          currentRole: 'Principal Engineer @ CyberTech',
          openToCollaboration: true,
          completionPercentage: 100,
          readmeMarkdown: `# Hi there 👋, I'm Alex Vance!

### 💻 About Me
- 🔭 Working on **HyperDB** - high-performance distributed key-value storage.
- 🌱 Currently learning **Wasm Micro-runtimes & eBPF**.
- 💬 Ask me about **Rust, Node.js internals, and React architecture**.
- 📫 Reach me out on Twitter [@alex_vance](https://twitter.com)

\`\`\`rust
fn main() {
    let dev = Developer::new("Alex Vance")
        .with_role("Architect")
        .with_passion("High performance code");
    
    dev.build_future();
}
\`\`\`
`,
        },
      },
    },
  });

  const dev2 = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      username: 'elena_codes',
      email: 'elena@devishub.io',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
      coverImageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
      status: 'BUSY',
      isVerified: true,
      isOnboarded: true,
      profile: {
        create: {
          headline: 'Full-Stack Engineer & AI Interface Designer',
          bio: 'Crafting ultra-responsive neo-futuristic interfaces and LLM orchestration frameworks.',
          location: 'Berlin, Germany',
          timezone: 'UTC+2',
          availability: 'Open for projects',
          currentRole: 'Lead UI/UX Engineer',
          openToCollaboration: true,
          completionPercentage: 90,
          readmeMarkdown: `# Elena Rostova ✨

Full Stack Developer passionate about **Framer Motion**, **Tailwind CSS**, and **Generative AI workflows**.
`,
        },
      },
    },
  });

  const dev3 = await prisma.user.create({
    data: {
      name: 'Marcus Chen',
      username: 'marcus_quantum',
      email: 'marcus@devishub.io',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      status: 'ONLINE',
      isOnboarded: true,
      profile: {
        create: {
          headline: 'Backend Lead & Cloud Security Specialist',
          bio: 'PostgreSQL optimization, Zero-Trust backend architectures, and Go microservices.',
          location: 'Tokyo, Japan',
          timezone: 'UTC+9',
          availability: 'Mentoring',
          currentRole: 'Security Lead @ NexusCloud',
          completionPercentage: 85,
        },
      },
    },
  });

  // 2. Seed Projects & Documentation
  const project1 = await prisma.project.create({
    data: {
      ownerId: dev1.id,
      name: 'HyperDB Engine',
      slug: 'hyperdb-engine',
      shortDescription: 'Ultra fast, distributed, in-memory key-value engine with instant persistence.',
      fullDescription: 'HyperDB is built in Rust with zero-copy deserialization and a lock-free concurency model achieving 1M+ ops/sec per core.',
      repoUrl: 'https://github.com/alexvance/hyperdb',
      demoUrl: 'https://hyperdb-demo.devishub.io',
      status: 'COMPLETED',
      visibility: 'PUBLIC',
      license: 'Apache-2.0',
      viewCount: 1420,
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=hyperdb',
      coverImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
      technologies: {
        create: [{ name: 'Rust' }, { name: 'WebAssembly' }, { name: 'gRPC' }],
      },
      documents: {
        create: [
          {
            title: 'README',
            slug: 'readme',
            content: `# HyperDB Engine 🚀

HyperDB is an open-source, ultra-low-latency distributed storage system designed for high-concurrency cloud native architectures.

## Features
- ⚡ **1M+ ops/sec per core** using lock-free data structures.
- 🔒 **Zero-Trust Encryption** at rest and in transit.
- 🌐 **Multi-region consensus** built on Raft protocol.

## Installation

\`\`\`bash
# Install via Cargo
cargo install hyperdb-cli

# Start cluster node
hyperdb node start --config ./cluster.yaml
\`\`\`

## Architecture Diagram
\`\`\`text
 [Client App] ---> [gRPC Proxy] ---> [Raft Consensus Node] ---> [Memory Engine]
\`\`\`
`,
            isPrimary: true,
          },
          {
            title: 'API Documentation',
            slug: 'api-docs',
            content: `# HyperDB gRPC API Specification

### \`SetKey(key: string, value: bytes, ttl: uint64) -> Response\`
Stores a value in the memory engine with an optional time-to-live.
`,
            isPrimary: false,
          },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      ownerId: dev2.id,
      name: 'CyberGrid UI Toolkit',
      slug: 'cybergrid-ui',
      shortDescription: 'Neo-futuristic React component library with glassmorphic cards and dynamic neon lighting.',
      fullDescription: 'CyberGrid gives modern applications a sleek cyberpunk aesthetic with dark violet themes and responsive grid layouts.',
      repoUrl: 'https://github.com/elenarostova/cybergrid-ui',
      demoUrl: 'https://cybergrid.devishub.io',
      status: 'MAINTAINED',
      visibility: 'PUBLIC',
      license: 'MIT',
      viewCount: 2890,
      logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=cybergrid',
      coverImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
      technologies: {
        create: [{ name: 'React' }, { name: 'Tailwind CSS' }, { name: 'Framer Motion' }],
      },
      documents: {
        create: [
          {
            title: 'README',
            slug: 'readme',
            content: `# CyberGrid UI Toolkit 🎨

A production-grade React UI component library featuring **Neo-Futurism aesthetics**.

\`\`\`tsx
import { CyberCard, NeonButton } from 'cybergrid-ui';

export default function App() {
  return (
    <CyberCard glow="cyan">
      <h2>Neo-Futuristic Dashboard</h2>
      <NeonButton variant="electric">Initialize System</NeonButton>
    </CyberCard>
  );
}
\`\`\`
`,
            isPrimary: true,
          },
        ],
      },
    },
  });

  // 3. Seed Posts & Code Snippets
  const post1 = await prisma.post.create({
    data: {
      authorId: dev1.id,
      projectId: project1.id,
      type: 'CODE_SNIPPET',
      content: 'Just published a lock-free ring buffer implementation in Rust. Benchmark comparison against std::sync::mpsc shows a 3.4x throughput boost!',
      codeLang: 'rust',
      codeSnippet: `pub struct LockFreeRingBuffer<T, const N: usize> {
    head: AtomicUsize,
    tail: AtomicUsize,
    buffer: [UnsafeCell<MaybeUninit<T>>; N],
}

impl<T, const N: usize> LockFreeRingBuffer<T, N> {
    pub fn push(&self, item: T) -> Result<(), T> {
        let tail = self.tail.load(Ordering::Relaxed);
        let next_tail = (tail + 1) % N;
        if next_tail == self.head.load(Ordering::Acquire) {
            return Err(item); // Buffer full
        }
        unsafe { (*self.buffer[tail].get()).write(item); }
        self.tail.store(next_tail, Ordering::Release);
        Ok(())
    }
}`,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      authorId: dev2.id,
      projectId: project2.id,
      type: 'PROJECT_UPDATE',
      content: 'Released v2.4.0 of CyberGrid UI! Includes custom glowing skeleton loaders, terminal prompt dialogs, and instant Tailwind v3 theme tokens. Check out the demo page!',
    },
  });

  const post3 = await prisma.post.create({
    data: {
      authorId: dev3.id,
      type: 'QUESTION',
      content: 'What is your preferred approach for managing distributed database migrations across microservices in zero-downtime deployments?',
    },
  });

  // 4. Reactions & Comments
  await prisma.reaction.createMany({
    data: [
      { postId: post1.id, userId: dev2.id, type: 'SHIP_IT' },
      { postId: post1.id, userId: dev3.id, type: 'BRILLIANT' },
      { postId: post2.id, userId: dev1.id, type: 'USEFUL' },
    ],
  });

  await prisma.comment.create({
    data: {
      postId: post1.id,
      authorId: dev2.id,
      content: 'Impressive throughput boost! Are you planning to add Wasm bindings for this buffer in the next release?',
    },
  });

  await prisma.comment.create({
    data: {
      postId: post3.id,
      authorId: dev1.id,
      content: 'We use expand-and-contract pattern: first add nullable column, deploy code that writes to both, backfill historical rows, and finally add NOT NULL constraint.',
    },
  });

  // 5. Direct Message & Conversation
  const conv = await prisma.conversation.create({
    data: {
      participants: {
        create: [{ userId: dev1.id }, { userId: dev2.id }],
      },
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv.id,
        senderId: dev2.id,
        content: 'Hey Alex! Loved your HyperDB repository. Would you be open to collaborating on a CyberGrid monitoring dashboard for it?',
      },
      {
        conversationId: conv.id,
        senderId: dev1.id,
        content: 'Hey Elena! That sounds awesome. A neo-futuristic telemetry dashboard for node metrics would be great.',
      },
    ],
  });

  console.log('✅ Seed completed successfully! Test users created:');
  console.log('   - alex_dev / password123');
  console.log('   - elena_codes / password123');
  console.log('   - marcus_quantum / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
