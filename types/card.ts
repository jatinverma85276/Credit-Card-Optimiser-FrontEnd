// Financial component type definitions

export interface CreditCardData {
  name: string;
  logo: string;
  gradient: string;
  rewardRate: number;
  annualFee: number;
  features: string[];
  applyUrl?: string;
}

export interface ComparisonData {
  cards: CreditCardData[];
  winner?: string; // card name
  criteria: 'rewards' | 'fees' | 'overall';
}
