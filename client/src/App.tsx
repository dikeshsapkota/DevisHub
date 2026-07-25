import { useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ChatPage } from './pages/ChatPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { ExploreDevsPage } from './pages/ExploreDevsPage';
import { ExploreProjectsPage } from './pages/ExploreProjectsPage';
import { FeedPage } from './pages/FeedPage';
import { LandingPage } from './pages/LandingPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProjectPage } from './pages/ProjectPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { useAuthStore } from './store/authStore';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) {
    return <div className="min-h-[70vh] grid place-items-center text-violet-300">Loading DevisHub…</div>;
  }
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
}

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/developers" element={<ExploreDevsPage />} />
          <Route path="/projects" element={<ExploreProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/profiles/:username" element={<ProfilePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route
            path="/projects/new"
            element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>}
          />
          <Route
            path="/chat"
            element={<ProtectedRoute><ChatPage /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isLanding && <Footer />}
    </div>
  );
}
