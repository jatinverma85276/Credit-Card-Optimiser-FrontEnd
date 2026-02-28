'use client';

import React, { useEffect, useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { NewChatButton } from './NewChatButton';
import { RecentStrategies } from './RecentStrategies';
import { IncognitoToggle } from './IncognitoToggle';
import { SettingsDropdown } from './SettingsDropdown';
import { ManageCardsModal } from '@/components/ui/ManageCardsModal';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useChat();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dragX, setDragX] = useState(0);
  const [isManageCardsOpen, setIsManageCardsOpen] = useState(false);

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

  // Handle drag end to determine if sidebar should open/close
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100; // pixels to drag before toggling
    const velocity = info.velocity.x;
    
    if (sidebarOpen) {
      // If sidebar is open and dragged left significantly, close it
      if (info.offset.x < -threshold || velocity < -500) {
        toggleSidebar();
      }
    } else {
      // If sidebar is closed and dragged right significantly, open it
      if (info.offset.x > threshold || velocity > 500) {
        toggleSidebar();
      }
    }
    
    setDragX(0);
  };

  return (
    <>
      {/* Mobile hamburger menu */}
      {isMobile && !sidebarOpen && (
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      )}
      
      {/* Swipe area to open sidebar (invisible touch target on left edge) */}
      {isMobile && !sidebarOpen && (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 100 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          onDrag={(e, info) => setDragX(info.offset.x)}
          className="fixed left-0 top-0 bottom-0 w-8 z-40 cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: sidebarOpen ? -320 : 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={isMobile ? handleDragEnd : undefined}
        onDrag={isMobile ? (e, info) => setDragX(info.offset.x) : undefined}
        initial={false}
        animate={{
          x: sidebarOpen || !isMobile ? 0 : -320,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
        className={cn(
          'w-72 sm:w-80 bg-slate-900 border-r border-slate-800 flex flex-col',
          isMobile && 'fixed inset-y-0 left-0 z-40',
          isMobile && 'touch-pan-y'
        )}
        role="navigation"
        aria-label="Sidebar navigation"
        style={isMobile ? { touchAction: 'pan-y' } : undefined}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/50 relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
          
          <div className="relative flex items-center gap-3">
            {/* Logo/Icon with glow */}
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg glow-purple">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-white"
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
            
            {/* Close button for mobile */}
            {isMobile && sidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="ml-auto p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all duration-200"
                aria-label="Close sidebar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
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
          
          {/* User Profile */}
          {user && (
            <div className="pt-3 sm:pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full text-white font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
                
                {/* Settings and Logout */}
                <div className="flex items-center gap-1">
                  <SettingsDropdown onManageCards={() => setIsManageCardsOpen(true)} />
                  
                  {/* Logout Icon Button */}
                  <button 
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-md transition-all duration-200"
                    aria-label="Logout"
                    title="Logout"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
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
      
      {/* Manage Cards Modal */}
      <ManageCardsModal 
        isOpen={isManageCardsOpen} 
        onClose={() => setIsManageCardsOpen(false)} 
      />
    </>
  );
}
