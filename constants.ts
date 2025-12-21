import { AppLanguage, DictionaryItem } from './types';

export const LANGUAGES = [
  { code: AppLanguage.ZH, label: '中文 (Chinese)', flag: '🇨🇳' },
  { code: AppLanguage.EN, label: 'English', flag: '🇺🇸' },
  { code: AppLanguage.JP, label: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: AppLanguage.KR, label: '한국어 (Korean)', flag: '🇰🇷' },
  { code: AppLanguage.ES, label: 'Español', flag: '🇪🇸' },
  { code: AppLanguage.FR, label: 'Français', flag: '🇫🇷' },
  { code: AppLanguage.DE, label: 'Deutsch', flag: '🇩🇪' },
  { code: AppLanguage.TH, label: 'ไทย (Thai)', flag: '🇹🇭' },
  { code: AppLanguage.RU, label: 'Русский', flag: '🇷🇺' },
  { code: AppLanguage.IT, label: 'Italiano', flag: '🇮🇹' },
  { code: AppLanguage.PT, label: 'Português', flag: '🇵🇹' },
  { code: AppLanguage.AR, label: 'العربية', flag: '🇸🇦' },
];

export const OFFLINE_DICTIONARY: Record<string, DictionaryItem[]> = {
  chest: [
    {
      id: 'chest_pain',
      category: 'medical',
      term: {
        zh: '我胸痛',
        en: 'I have chest pain',
        ja: '胸が痛い',
        ko: '가슴이 아파요',
        es: 'Tengo dolor en el pecho',
        fr: 'J\'ai mal à la poitrine',
        de: 'Ich habe Brustschmerzen',
        th: 'ฉันเจ็บหน้าอก',
        ru: 'У меня боль в груди',
        it: 'Ho dolore al petto',
        pt: 'Tenho dor no peito',
        ar: 'عندي ألم في الصدر'
      }
    },
    {
      id: 'cant_breathe',
      category: 'medical',
      term: {
        zh: '我呼吸困难',
        en: 'I cannot breathe',
        ja: '息ができません',
        ko: '숨을 쉴 수 없어요',
        es: 'No puedo respirar',
        fr: 'Je ne peux pas respirer',
        de: 'Ich kann nicht atmen',
        th: 'ฉันหายใจไม่ออก',
        ru: 'Я не могу дышать',
        it: 'Non riesco a respirare',
        pt: 'Não consigo respirar',
        ar: 'لا أستطيع التنفس'
      }
    }
  ],
  stomach: [
    {
      id: 'stomach_pain',
      category: 'medical',
      term: {
        zh: '我肚子痛',
        en: 'I have stomach pain',
        ja: 'お腹が痛い',
        ko: '배가 아파요',
        es: 'Me duele el estómago',
        fr: 'J\'ai mal au ventre',
        de: 'Ich habe Bauchschmerzen',
        th: 'ฉันปวดท้อง',
        ru: 'У меня болит живот',
        it: 'Ho mal di pancia',
        pt: 'Estou com dor de estômago',
        ar: 'عندي ألم في المعدة'
      }
    },
    {
      id: 'food_poison',
      category: 'medical',
      term: {
        zh: '我可能食物中毒了',
        en: 'I might have food poisoning',
        ja: '食中毒かもしれません',
        ko: '식중독인 것 같아요',
        es: 'Podría tener intoxicación alimentaria',
        fr: 'J\'ai peut-être une intoxication alimentaire',
        de: 'Ich habe vielleicht eine Lebensmittelvergiftung',
        th: 'ฉันอาจอาหารเป็นพิษ',
        ru: 'У меня может быть пищевое отравление',
        it: 'Potrei avere un\'intossicazione alimentare',
        pt: 'Posso ter intoxicação alimentar',
        ar: 'ربما تسممت من الطعام'
      }
    }
  ],
  injury: [
    {
      id: 'bleeding',
      category: 'medical',
      term: {
        zh: '我在流血',
        en: 'I am bleeding',
        ja: '出血しています',
        ko: '피가 나요',
        es: 'Estoy sangrando',
        fr: 'Je saigne',
        de: 'Ich blute',
        th: 'ฉันเลือดออก',
        ru: 'Я истекаю кровью',
        it: 'Sto sanguinando',
        pt: 'Estou sangrando',
        ar: 'أنا أنزف'
      }
    },
    {
      id: 'broken_bone',
      category: 'medical',
      term: {
        zh: '我好像骨折了',
        en: 'I think I broke a bone',
        ja: '骨が折れたようです',
        ko: '뼈가 부러진 것 같아요',
        es: 'Creo que me rompí un hueso',
        fr: 'Je crois que je me suis cassé un os',
        de: 'Ich glaube, ich habe mir einen Knochen gebrochen',
        th: 'ฉันคิดว่ากระดูกหัก',
        ru: 'Кажется, я сломал кость',
        it: 'Credo di essermi rotto un osso',
        pt: 'Acho que quebrei um osso',
        ar: 'أعتقد أنني كسرت عظمًا'
      }
    }
  ]
};

export const INITIAL_PROFILE: any = {
  name: '',
  bloodType: '',
  allergies: '',
  insuranceId: '',
  emergencyContact: '',
  medicalConditions: ''
};
