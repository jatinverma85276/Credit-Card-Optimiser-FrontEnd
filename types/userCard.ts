export interface RewardRule {
  category: string;
  reward_rate: number;
  conditions?: string;
}

export interface MilestoneBenefit {
  milestone: string;
  benefit: string;
}

export interface EligibilityCriteria {
  min_income?: number;
  min_credit_score?: number;
  employment_type?: string[];
  age_requirement?: string;
}

export interface UserCard {
  card_name: string;
  issuer: string;
  card_type: string;
  annual_fee: number;
  reward_program_name: string;
  reward_rules: RewardRule[];
  milestone_benefits: MilestoneBenefit[];
  eligibility_criteria: EligibilityCriteria;
  excluded_categories: string[];
  key_benefits: string[];
  liability_policy: string;
}

export interface UserCardsResponse {
  user_id: string;
  cards: UserCard[];
  count: number;
}
