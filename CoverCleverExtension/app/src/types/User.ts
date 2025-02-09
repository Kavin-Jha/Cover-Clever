// src/types/User.ts
export interface User {
    firstName: string;
    lastName: string;
    email: string;
    medicalConditions: object;
    insurancePreferenceExplanation: string;
    incomeLevel: number;
    desiredBenefits: string[];
  }