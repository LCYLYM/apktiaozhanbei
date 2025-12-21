export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  OFFLINE_MEDICAL = 'OFFLINE_MEDICAL',
  AI_CENTER = 'AI_CENTER',
  SOS_TOOLS = 'SOS_TOOLS',
  PROFILE = 'PROFILE'
}

export enum AppLanguage {
  ZH = 'zh', // Chinese
  EN = 'en', // English
  ES = 'es', // Spanish
  FR = 'fr', // French
  DE = 'de', // German
  JP = 'ja', // Japanese
  KR = 'ko', // Korean
  RU = 'ru', // Russian
  IT = 'it', // Italian
  PT = 'pt', // Portuguese
  TH = 'th', // Thai
  AR = 'ar'  // Arabic
}

export interface UserProfile {
  name: string;
  bloodType: string;
  allergies: string;
  insuranceId: string;
  emergencyContact: string;
  medicalConditions: string;
}

export interface DictionaryItem {
  id: string;
  term: Record<string, string>; // language code -> text
  category: 'medical' | 'police' | 'general';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  translation?: string;
  medicalNote?: string;
  image?: string; // base64
}
