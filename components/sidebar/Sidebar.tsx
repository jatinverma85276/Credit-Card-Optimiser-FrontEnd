'use client';

import React, { useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { NewChatButton } from './NewChatButton';
import { RecentStrategies } from './RecentStrategies';
import { IncognitoToggle } from './IncognitoToggle';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useChat();
  const [isMobile, setIsMobile] = React.useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle Escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen, toggleSidebar]);

  return (
    <>
      {/* Mobile hamburger menu */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 hover:scale-110 transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      )}
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen || !isMobile ? 0 : -320,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
        className={cn(
          'w-72 sm:w-80 bg-slate-900 border-r border-slate-800 flex flex-col',
          isMobile && 'fixed inset-y-0 left-0 z-40'
        )}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            {/* Logo/Icon */}
            <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                />
              </svg>
            </div>
            
            {/* Brand Name */}
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">SwipeSmart</h1>
              <p className="text-xs text-slate-400 mt-0.5">AI Credit Card Advisor</p>
            </div>
          </div>
        </div>
        
        {/* New Chat Button Section */}
        <div className="p-3 sm:p-4 border-b border-slate-800">
          <NewChatButton />
        </div>
        
        {/* Recent Strategies - scrollable */}
        <div className="flex-1 overflow-y-auto">
          <RecentStrategies />
        </div>
        
        {/* Settings section at bottom */}
        <div className="p-3 sm:p-4 border-t border-slate-800 space-y-3 sm:space-y-4">
          <IncognitoToggle />
          
          {/* User settings placeholder */}
          <div className="pt-3 sm:pt-4 border-t border-slate-800">
            <button 
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-slate-300 hover:bg-slate-800 hover:scale-[1.02] rounded-lg transition-all duration-200"
              aria-label="Open settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              Settings
            </button>
          </div>
        </div>
      </motion.aside>
      
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </>
  );
}
