'use client';

import { ChatInterface } from '@/components/chat/ChatInterface';
import { AuthPage } from '@/components/auth/AuthPage';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin glow"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-slate-400 text-lg font-medium">Loading your experience...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <ChatInterface />;
}
