'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

interface Bank {
  id: string;
  name: string;
}

interface BankCard {
  id: string;
  name: string;
  type: string;
  annual_fee: number;
}

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardAdded: () => void;
}

// Comprehensive banks data
const BANKS: Bank[] = [
  { id: 'hdfc', name: 'HDFC Bank' },
  { id: 'icici', name: 'ICICI Bank' },
  { id: 'sbi', name: 'State Bank of India' },
  { id: 'axis', name: 'Axis Bank' },
  { id: 'kotak', name: 'Kotak Mahindra Bank' },
  { id: 'citi', name: 'Citi Bank' },
  { id: 'amex', name: 'American Express' },
  { id: 'hsbc', name: 'HSBC' },
  { id: 'standard', name: 'Standard Chartered' },
  { id: 'indusind', name: 'IndusInd Bank' },
  { id: 'yes', name: 'YES Bank' },
  { id: 'rbl', name: 'RBL Bank' },
  { id: 'idfc', name: 'IDFC FIRST Bank' },
  { id: 'au', name: 'AU Small Finance Bank' },
  { id: 'bob', name: 'Bank of Baroda' },
];

// Comprehensive cards by bank
const CARDS_BY_BANK: Record<string, BankCard[]> = {
  hdfc: [
    { id: 'hdfc_infinia', name: 'Infinia', type: 'Credit Card', annual_fee: 12500 },
    { id: 'hdfc_diners_black', name: 'Diners Club Black', type: 'Credit Card', annual_fee: 10000 },
    { id: 'hdfc_regalia_gold', name: 'Regalia Gold', type: 'Credit Card', annual_fee: 2500 },
    { id: 'hdfc_regalia', name: 'Regalia', type: 'Credit Card', annual_fee: 2500 },
    { id: 'hdfc_millennia', name: 'Millennia', type: 'Credit Card', annual_fee: 1000 },
    { id: 'hdfc_freedom', name: 'Freedom', type: 'Credit Card', annual_fee: 500 },
    { id: 'hdfc_moneyback', name: 'MoneyBack', type: 'Credit Card', annual_fee: 500 },
    { id: 'hdfc_shoppers_stop', name: 'Shoppers Stop', type: 'Credit Card', annual_fee: 500 },
    { id: 'hdfc_tata_neu_infinity', name: 'Tata Neu Infinity', type: 'Credit Card', annual_fee: 0 },
    { id: 'hdfc_swiggy', name: 'Swiggy', type: 'Credit Card', annual_fee: 500 },
  ],
  icici: [
    { id: 'icici_emeralde', name: 'Emeralde Private Metal', type: 'Credit Card', annual_fee: 12000 },
    { id: 'icici_sapphiro', name: 'Sapphiro', type: 'Credit Card', annual_fee: 3500 },
    { id: 'icici_coral', name: 'Coral', type: 'Credit Card', annual_fee: 500 },
    { id: 'icici_rubyx', name: 'Rubyx', type: 'Credit Card', annual_fee: 3000 },
    { id: 'icici_amazon_pay', name: 'Amazon Pay', type: 'Credit Card', annual_fee: 0 },
    { id: 'icici_makemytrip', name: 'MakeMyTrip', type: 'Credit Card', annual_fee: 500 },
    { id: 'icici_platinum', name: 'Platinum Chip', type: 'Credit Card', annual_fee: 199 },
    { id: 'icici_manchester_united', name: 'Manchester United', type: 'Credit Card', annual_fee: 500 },
  ],
  sbi: [
    { id: 'sbi_elite', name: 'Card ELITE', type: 'Credit Card', annual_fee: 4999 },
    { id: 'sbi_prime', name: 'Card PRIME', type: 'Credit Card', annual_fee: 2999 },
    { id: 'sbi_simply_save', name: 'SimplySAVE', type: 'Credit Card', annual_fee: 499 },
    { id: 'sbi_simply_click', name: 'SimplyCLICK', type: 'Credit Card', annual_fee: 499 },
    { id: 'sbi_pulse', name: 'PULSE', type: 'Credit Card', annual_fee: 0 },
    { id: 'sbi_irctc', name: 'IRCTC', type: 'Credit Card', annual_fee: 500 },
    { id: 'sbi_cashback', name: 'Cashback', type: 'Credit Card', annual_fee: 999 },
  ],
  axis: [
    { id: 'axis_magnus', name: 'Magnus', type: 'Credit Card', annual_fee: 10000 },
    { id: 'axis_reserve', name: 'Reserve', type: 'Credit Card', annual_fee: 50000 },
    { id: 'axis_vistara_infinite', name: 'Vistara Infinite', type: 'Credit Card', annual_fee: 10000 },
    { id: 'axis_privilege', name: 'Privilege', type: 'Credit Card', annual_fee: 1500 },
    { id: 'axis_ace', name: 'Ace', type: 'Credit Card', annual_fee: 499 },
    { id: 'axis_flipkart', name: 'Flipkart', type: 'Credit Card', annual_fee: 500 },
    { id: 'axis_myzone', name: 'MY ZONE', type: 'Credit Card', annual_fee: 500 },
    { id: 'axis_neo', name: 'Neo', type: 'Credit Card', annual_fee: 0 },
    { id: 'axis_airtel', name: 'Airtel', type: 'Credit Card', annual_fee: 500 },
  ],
  kotak: [
    { id: 'kotak_811', name: '811 #DreamDifferent', type: 'Credit Card', annual_fee: 0 },
    { id: 'kotak_white', name: 'White Reserve', type: 'Credit Card', annual_fee: 5000 },
    { id: 'kotak_league_platinum', name: 'League Platinum', type: 'Credit Card', annual_fee: 999 },
    { id: 'kotak_myntra', name: 'Myntra', type: 'Credit Card', annual_fee: 500 },
    { id: 'kotak_zen', name: 'Zen Signature', type: 'Credit Card', annual_fee: 999 },
  ],
  citi: [
    { id: 'citi_prestige', name: 'Prestige', type: 'Credit Card', annual_fee: 20000 },
    { id: 'citi_premiermiles', name: 'PremierMiles', type: 'Credit Card', annual_fee: 3000 },
    { id: 'citi_rewards', name: 'Rewards', type: 'Credit Card', annual_fee: 1000 },
    { id: 'citi_cashback', name: 'Cashback', type: 'Credit Card', annual_fee: 500 },
  ],
  amex: [
    { id: 'amex_platinum', name: 'Platinum Card', type: 'Credit Card', annual_fee: 60000 },
    { id: 'amex_gold', name: 'Gold Card', type: 'Credit Card', annual_fee: 4500 },
    { id: 'amex_mrcc', name: 'Membership Rewards', type: 'Credit Card', annual_fee: 1500 },
    { id: 'amex_smartearn', name: 'SmartEarn', type: 'Credit Card', annual_fee: 495 },
    { id: 'amex_platinum_travel', name: 'Platinum Travel', type: 'Credit Card', annual_fee: 5000 },
  ],
  hsbc: [
    { id: 'hsbc_premier', name: 'Premier', type: 'Credit Card', annual_fee: 2999 },
    { id: 'hsbc_visa_platinum', name: 'Visa Platinum', type: 'Credit Card', annual_fee: 1499 },
    { id: 'hsbc_cashback', name: 'Cashback', type: 'Credit Card', annual_fee: 999 },
    { id: 'hsbc_live_plus', name: 'Live+', type: 'Credit Card', annual_fee: 999 },
  ],
  standard: [
    { id: 'sc_ultimate', name: 'Ultimate', type: 'Credit Card', annual_fee: 5000 },
    { id: 'sc_super_value_titanium', name: 'Super Value Titanium', type: 'Credit Card', annual_fee: 1499 },
    { id: 'sc_digismart', name: 'DigiSmart', type: 'Credit Card', annual_fee: 499 },
    { id: 'sc_platinum_rewards', name: 'Platinum Rewards', type: 'Credit Card', annual_fee: 999 },
  ],
  indusind: [
    { id: 'indusind_legend', name: 'Legend', type: 'Credit Card', annual_fee: 10000 },
    { id: 'indusind_pinnacle', name: 'Pinnacle', type: 'Credit Card', annual_fee: 5000 },
    { id: 'indusind_iconia', name: 'Iconia', type: 'Credit Card', annual_fee: 2500 },
    { id: 'indusind_eazydiner', name: 'EazyDiner', type: 'Credit Card', annual_fee: 2500 },
    { id: 'indusind_nexxt', name: 'Nexxt', type: 'Credit Card', annual_fee: 500 },
  ],
  yes: [
    { id: 'yes_first_exclusive', name: 'FIRST Exclusive', type: 'Credit Card', annual_fee: 10000 },
    { id: 'yes_first_preferred', name: 'FIRST Preferred', type: 'Credit Card', annual_fee: 2499 },
    { id: 'yes_prosperity_edge', name: 'Prosperity Edge', type: 'Credit Card', annual_fee: 499 },
    { id: 'yes_ace', name: 'Ace', type: 'Credit Card', annual_fee: 499 },
  ],
  rbl: [
    { id: 'rbl_world_safari', name: 'World Safari', type: 'Credit Card', annual_fee: 3000 },
    { id: 'rbl_shoprite', name: 'ShopRite', type: 'Credit Card', annual_fee: 2000 },
    { id: 'rbl_platinum_maxima', name: 'Platinum Maxima', type: 'Credit Card', annual_fee: 1000 },
    { id: 'rbl_popcorn', name: 'Popcorn', type: 'Credit Card', annual_fee: 500 },
  ],
  idfc: [
    { id: 'idfc_wealth', name: 'WEALTH', type: 'Credit Card', annual_fee: 10000 },
    { id: 'idfc_select', name: 'SELECT', type: 'Credit Card', annual_fee: 500 },
    { id: 'idfc_club_vistara', name: 'Club Vistara', type: 'Credit Card', annual_fee: 3000 },
    { id: 'idfc_first_wow', name: 'FIRST WOW', type: 'Credit Card', annual_fee: 500 },
  ],
  au: [
    { id: 'au_zenith', name: 'Zenith', type: 'Credit Card', annual_fee: 5000 },
    { id: 'au_altura', name: 'Altura', type: 'Credit Card', annual_fee: 2000 },
    { id: 'au_altura_plus', name: 'Altura Plus', type: 'Credit Card', annual_fee: 1000 },
    { id: 'au_lit', name: 'LIT', type: 'Credit Card', annual_fee: 500 },
  ],
  bob: [
    { id: 'bob_premier', name: 'Premier', type: 'Credit Card', annual_fee: 3999 },
    { id: 'bob_eterna', name: 'Eterna', type: 'Credit Card', annual_fee: 2999 },
    { id: 'bob_easy', name: 'Easy', type: 'Credit Card', annual_fee: 500 },
    { id: 'bob_energy', name: 'Energy', type: 'Credit Card', annual_fee: 500 },
  ],
};

export function AddCardModal({ isOpen, onClose, onCardAdded }: AddCardModalProps) {
  const { user } = useAuth();
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [availableCards, setAvailableCards] = useState<BankCard[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedBank('');
      setSelectedCard('');
      setAvailableCards([]);
      setError(null);
    }
  }, [isOpen]);

  // Update available cards when bank is selected
  useEffect(() => {
    if (selectedBank) {
      setAvailableCards(CARDS_BY_BANK[selectedBank] || []);
      setSelectedCard(''); // Reset card selection
    } else {
      setAvailableCards([]);
    }
  }, [selectedBank]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBank || !selectedCard || !user) {
      setError('Please select both bank and card');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Find the selected card details
      const cardDetails = availableCards.find(card => card.id === selectedCard);
      const bankDetails = BANKS.find(bank => bank.id === selectedBank);
      
      if (!cardDetails || !bankDetails) {
        throw new Error('Card or bank not found');
      }

      // Call the API to add card
      console.log('Sending request to add card:', {
        bank_name: bankDetails.name,
        card_name: cardDetails.name,
        user_id: user.id
      });

      const response = await axios.post('/api/add_card', {
        bank_name: bankDetails.name,
        card_name: cardDetails.name,
        user_id: user.id
      });

      console.log('Card added successfully:', response.data);

      // Show success message
      setShowSuccess(true);
      
      // Wait a moment to show success, then close and refresh
      setTimeout(() => {
        setShowSuccess(false);
        onCardAdded();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to add card:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to add card. Please try again.');
      } else {
        setError('Failed to add card. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
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
              className="w-full max-w-md glass rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden"
            >
              {/* Header */}
              <div className="relative px-6 py-5 border-b border-slate-700/50 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg glow">
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
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Add New Card</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Select your bank and card</p>
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
              <form onSubmit={handleSubmit} className="p-6">
                {/* Success Message */}
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-emerald-500 rounded-full">
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
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-emerald-200 font-medium">Card added successfully!</p>
                      <p className="text-xs text-emerald-300/70 mt-0.5">Refreshing your card list...</p>
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="space-y-5">
                  {/* Bank Selection */}
                  <div>
                    <label htmlFor="bank" className="block text-sm font-medium text-slate-300 mb-2">
                      Select Bank
                    </label>
                    <div className="relative">
                      <select
                        id="bank"
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all backdrop-blur-sm"
                        required
                      >
                        <option value="" className="bg-slate-800">Choose a bank...</option>
                        {BANKS.map((bank) => (
                          <option key={bank.id} value={bank.id} className="bg-slate-800">
                            {bank.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-slate-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Card Selection */}
                  <div>
                    <label htmlFor="card" className="block text-sm font-medium text-slate-300 mb-2">
                      Select Card
                    </label>
                    <div className="relative">
                      <select
                        id="card"
                        value={selectedCard}
                        onChange={(e) => setSelectedCard(e.target.value)}
                        disabled={!selectedBank || availableCards.length === 0}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      >
                        <option value="" className="bg-slate-800">
                          {!selectedBank ? 'Select a bank first...' : 'Choose a card...'}
                        </option>
                        {availableCards.map((card) => (
                          <option key={card.id} value={card.id} className="bg-slate-800">
                            {card.name} - ₹{card.annual_fee.toLocaleString('en-IN')}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-slate-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </div>
                    </div>
                    {selectedBank && availableCards.length === 0 && (
                      <p className="mt-2 text-xs text-slate-500">No cards available for this bank</p>
                    )}
                  </div>

                  {/* Selected Card Preview */}
                  {selectedCard && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl"
                    >
                      <p className="text-xs text-emerald-400 font-medium mb-1">Selected Card</p>
                      <p className="text-sm text-white font-semibold">
                        {availableCards.find(c => c.id === selectedCard)?.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Annual Fee: ₹{availableCards.find(c => c.id === selectedCard)?.annual_fee.toLocaleString('en-IN')}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedBank || !selectedCard || isSubmitting}
                    className="relative flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"></div>
                    
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        'Add Card'
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
