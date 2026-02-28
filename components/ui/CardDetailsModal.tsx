'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCard } from '@/types/userCard';

interface CardDetailsModalProps {
  card: UserCard;
  isOpen: boolean;
  onClose: () => void;
  gradient: string;
}

export function CardDetailsModal({ card, isOpen, onClose, gradient }: CardDetailsModalProps) {
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-3xl max-h-[90vh] glass rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
              {/* Header with Card Preview */}
              <div
                className="relative px-6 py-8 overflow-hidden"
                style={{ background: gradient }}
              >
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50"></div>
                
                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white/80 text-sm font-medium mb-2">{card.issuer}</p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{card.card_name}</h2>
                    <p className="text-white/90 text-sm">{card.card_type}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
                    aria-label="Close"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="relative mt-6 flex items-center gap-6">
                  <div>
                    <p className="text-white/70 text-xs mb-1">Annual Fee</p>
                    <p className="text-white text-xl font-bold">{formatFee(card.annual_fee)}</p>
                  </div>
                  <div className="h-12 w-px bg-white/20"></div>
                  <div>
                    <p className="text-white/70 text-xs mb-1">Rewards Program</p>
                    <p className="text-white text-lg font-semibold">{card.reward_program_name}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)] space-y-6">
                {/* Key Benefits */}
                {card.key_benefits && card.key_benefits.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-emerald-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      Key Benefits
                    </h3>
                    <div className="space-y-2">
                      {card.key_benefits.map((benefit: string, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg"
                        >
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <p className="text-slate-200 text-sm flex-1">{benefit}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reward Rules */}
                {card.reward_rules && card.reward_rules.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-purple-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                        />
                      </svg>
                      Reward Rules
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {card.reward_rules.map((rule, idx) => (
                        <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                          <p className="text-purple-400 text-xs font-medium mb-1">{rule.category}</p>
                          <p className="text-white text-lg font-bold">{rule.reward_rate}x</p>
                          {rule.conditions && (
                            <p className="text-slate-400 text-xs mt-1">{rule.conditions}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Milestone Benefits */}
                {card.milestone_benefits && card.milestone_benefits.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-amber-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
                        />
                      </svg>
                      Milestone Benefits
                    </h3>
                    <div className="space-y-2">
                      {card.milestone_benefits.map((milestone, idx) => (
                        <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                          <p className="text-amber-400 text-sm font-medium mb-1">{milestone.milestone}</p>
                          <p className="text-slate-200 text-sm">{milestone.benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eligibility Criteria */}
                {card.eligibility_criteria && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-blue-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                        />
                      </svg>
                      Eligibility Criteria
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {card.eligibility_criteria.min_income && (
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <p className="text-blue-400 text-xs font-medium mb-1">Minimum Income</p>
                          <p className="text-white text-sm">₹{card.eligibility_criteria.min_income.toLocaleString('en-IN')}</p>
                        </div>
                      )}
                      {card.eligibility_criteria.min_credit_score && (
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <p className="text-blue-400 text-xs font-medium mb-1">Credit Score</p>
                          <p className="text-white text-sm">{card.eligibility_criteria.min_credit_score}+</p>
                        </div>
                      )}
                      {card.eligibility_criteria.age_requirement && (
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <p className="text-blue-400 text-xs font-medium mb-1">Age Requirement</p>
                          <p className="text-white text-sm">{card.eligibility_criteria.age_requirement}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Excluded Categories */}
                {card.excluded_categories && card.excluded_categories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-red-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                        />
                      </svg>
                      Excluded Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {card.excluded_categories.map((category, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-xs"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
