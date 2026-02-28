'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { UserCard, UserCardsResponse } from '@/types/userCard';
import { AddCardModal } from './AddCardModal';
import { CardDetailsModal } from './CardDetailsModal';
import axios from 'axios';

// Card gradient colors based on issuer
const CARD_GRADIENTS: Record<string, string> = {
  'HDFC Bank': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'ICICI Bank': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'SBI': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'Axis Bank': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'Citi Bank': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'American Express': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'default': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
};

interface ManageCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageCardsModal({ isOpen, onClose }: ManageCardsModalProps) {
  const { user } = useAuth();
  const [cards, setCards] = useState<UserCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [selectedCardDetails, setSelectedCardDetails] = useState<UserCard | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchUserCards();
    }
  }, [isOpen, user]);

  const fetchUserCards = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<UserCardsResponse>(
        `/api/user/${user.id}/cards`
      );
      
      setCards(response.data.cards || []);
    } catch (err) {
      console.error('Failed to fetch user cards:', err);
      setError('Failed to load your cards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardAdded = () => {
    // Refresh the cards list after adding a new card
    console.log('handleCardAdded called - refreshing cards list');
    fetchUserCards();
  };

  const getCardGradient = (issuer: string): string => {
    return CARD_GRADIENTS[issuer] || CARD_GRADIENTS.default;
  };

  const formatFee = (fee: number): string => {
    return fee === 0 ? 'Free' : `₹${fee.toLocaleString('en-IN')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-2xl max-h-[85vh] glass rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
              {/* Header */}
              <div className="relative px-6 py-5 border-b border-slate-700/50 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg glow-purple">
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
                    <div>
                      <h2 className="text-xl font-bold text-white">Manage Your Cards</h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {cards.length > 0 ? `${cards.length} card${cards.length > 1 ? 's' : ''} in your wallet` : 'View and manage your credit cards'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                    aria-label="Close"
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
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
                {/* Add New Card Button - Moved to top */}
                {!isLoading && (
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setIsAddCardOpen(true)}
                    className="mb-6 w-full py-4 glass rounded-xl border-2 border-dashed border-slate-600 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    <span className="font-medium">Add New Card</span>
                  </motion.button>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative inline-block mb-4">
                      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-400 text-sm">Loading your cards...</p>
                  </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-red-200 font-medium">{error}</p>
                      <button
                        onClick={fetchUserCards}
                        className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && cards.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8 text-slate-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">No cards found</p>
                    <p className="text-slate-500 text-xs">Add your first card to get started</p>
                  </div>
                )}

                {/* Cards Grid */}
                {!isLoading && !error && cards.length > 0 && (
                  <div className="space-y-4">
                    {cards.map((card, index) => (
                      <motion.div
                        key={`${card.card_name}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="group relative"
                      >
                        <div
                          className="relative rounded-xl p-5 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                          style={{ background: getCardGradient(card.issuer) }}
                        >
                          {/* Glossy overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50"></div>
                          
                          {/* Card Content */}
                          <div className="relative">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <p className="text-white/80 text-xs font-medium mb-1">{card.issuer}</p>
                                <h3 className="text-white text-base sm:text-lg font-bold leading-tight">{card.card_name}</h3>
                                <p className="text-white/70 text-xs mt-1">{card.card_type}</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setSelectedCardDetails(card)}
                                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
                                  aria-label="View details"
                                  title="View details"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 text-white"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-white/70 text-xs mb-0.5">Annual Fee</p>
                                  <p className="text-white text-sm font-semibold">{formatFee(card.annual_fee)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-white/70 text-xs mb-0.5">Rewards</p>
                                  <p className="text-white text-sm font-semibold">{card.reward_program_name}</p>
                                </div>
                              </div>

                              {/* Key Benefits Preview */}
                              {card.key_benefits && card.key_benefits.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-white/20">
                                  <p className="text-white/70 text-xs mb-1.5">Key Benefits</p>
                                  <div className="space-y-1">
                                    {card.key_benefits.slice(0, 2).map((benefit: string, idx: number) => (
                                      <p key={idx} className="text-white/90 text-xs flex items-start gap-1.5">
                                        <span className="text-emerald-300 mt-0.5">✓</span>
                                        <span className="line-clamp-1">{benefit}</span>
                                      </p>
                                    ))}
                                    {card.key_benefits.length > 2 && (
                                      <p className="text-white/60 text-xs">+{card.key_benefits.length - 2} more benefits</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Add Card Modal */}
          <AddCardModal 
            isOpen={isAddCardOpen} 
            onClose={() => setIsAddCardOpen(false)}
            onCardAdded={handleCardAdded}
          />
          
          {/* Card Details Modal */}
          {selectedCardDetails && (
            <CardDetailsModal
              card={selectedCardDetails}
              isOpen={!!selectedCardDetails}
              onClose={() => setSelectedCardDetails(null)}
              gradient={getCardGradient(selectedCardDetails.issuer)}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
