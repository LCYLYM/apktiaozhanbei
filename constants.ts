import { AppLanguage, DictionaryItem } from './types';

export const SUBSCRIPTION_STORAGE_KEY = 'zhiyutong_subscription_v1';

export const SUBSCRIPTION_PLANS = [
  {
    id: 'personal',
    name: '个人订阅',
    priceText: '¥19/月',
    description: '适合个人出行与日常应急。',
    features: ['AI 对话翻译', '图片/药品识别与提示', '更快的响应优先级']
  },
  {
    id: 'enterprise',
    name: '企业订阅',
    priceText: '¥199/月',
    description: '适合公司/团队批量使用与合规管理。',
    features: ['包含个人版全部功能', '多账号管理（本地存储）', '优先支持通道']
  },
  {
    id: 'government',
    name: '政府定制',
    priceText: '联系定制',
    description: '适合政府/机构定制化应急话术与流程。',
    features: ['包含企业版全部功能', '定制流程与话术', '专属对接']
  }
] as const;

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

export const OFFLINE_POLICE_DICTIONARY: Record<string, DictionaryItem[]> = {
  emergency: [
    {
      id: 'police_help_now',
      category: 'police',
      term: {
        zh: '请帮我报警！我需要警察。',
        en: 'Please call the police! I need help.',
        ja: '警察を呼んでください！助けが必要です。',
        ko: '경찰을 불러 주세요! 도움이 필요해요.',
        es: '¡Por favor llame a la policía! Necesito ayuda.',
        fr: 'Appelez la police, s’il vous plaît ! J’ai besoin d’aide.',
        de: 'Bitte rufen Sie die Polizei! Ich brauche Hilfe.',
        th: 'ช่วยเรียกตำรวจให้หน่อย! ฉันต้องการความช่วยเหลือ',
        ru: 'Пожалуйста, вызовите полицию! Мне нужна помощь.',
        it: 'Per favore chiami la polizia! Ho bisogno di aiuto.',
        pt: 'Por favor, chame a polícia! Preciso de ajuda.',
        ar: 'من فضلك اتصل بالشرطة! أحتاج إلى مساعدة.'
      }
    },
    {
      id: 'police_in_danger',
      category: 'police',
      term: {
        zh: '我有危险。有人在跟踪/威胁我。',
        en: 'I am in danger. Someone is following/threatening me.',
        ja: '危険です。誰かに追われています／脅されています。',
        ko: '위험해요. 누군가 저를 따라오거나 위협하고 있어요.',
        es: 'Estoy en peligro. Alguien me está siguiendo/amenazando.',
        fr: 'Je suis en danger. Quelqu’un me suit/me menace.',
        de: 'Ich bin in Gefahr. Jemand verfolgt/bedroht mich.',
        th: 'ฉันตกอยู่ในอันตราย มีคนตาม/ข่มขู่ฉัน',
        ru: 'Мне угрожает опасность. Кто-то преследует/угрожает мне.',
        it: 'Sono in pericolo. Qualcuno mi sta seguendo/minacciando.',
        pt: 'Estou em perigo. Alguém está me seguindo/ameaçando.',
        ar: 'أنا في خطر. شخص ما يتبعني/يهددني.'
      }
    }
  ],
  lost: [
    {
      id: 'police_lost',
      category: 'police',
      term: {
        zh: '我迷路了。请帮我找到去这里的路。',
        en: 'I am lost. Please help me find my way to this place.',
        ja: '道に迷いました。ここへの行き方を教えてください。',
        ko: '길을 잃었어요. 여기로 가는 길을 알려 주세요.',
        es: 'Estoy perdido/a. Por favor ayúdeme a llegar aquí.',
        fr: 'Je suis perdu(e). Pouvez-vous m’aider à aller ici ?',
        de: 'Ich habe mich verlaufen. Bitte helfen Sie mir, hierhin zu kommen.',
        th: 'ฉันหลงทาง ช่วยบอกทางไปที่นี่หน่อย',
        ru: 'Я потерялся. Помогите мне добраться сюда.',
        it: 'Mi sono perso/a. Mi aiuta ad arrivare qui?',
        pt: 'Estou perdido(a). Pode me ajudar a chegar aqui?',
        ar: 'أنا تائه. من فضلك ساعدني للوصول إلى هذا المكان.'
      }
    },
    {
      id: 'police_passport_lost',
      category: 'police',
      term: {
        zh: '我的护照丢了/被偷了。我需要报案。',
        en: 'My passport is lost/stolen. I need to report it.',
        ja: 'パスポートをなくしました／盗まれました。届け出が必要です。',
        ko: '여권을 잃어버렸어요/도난당했어요. 신고해야 해요.',
        es: 'Perdí/me robaron el pasaporte. Necesito denunciarlo.',
        fr: 'Mon passeport est perdu/volé. Je dois le signaler.',
        de: 'Mein Pass ist verloren/gestohlen. Ich muss es melden.',
        th: 'พาสปอร์ตหาย/ถูกขโมย ฉันต้องการแจ้งความ',
        ru: 'Мой паспорт потерян/украден. Мне нужно подать заявление.',
        it: 'Ho perso/mi hanno rubato il passaporto. Devo fare denuncia.',
        pt: 'Perdi/roubaram meu passaporte. Preciso registrar ocorrência.',
        ar: 'جواز سفري ضاع/سُرق. أحتاج إلى تقديم بلاغ.'
      }
    }
  ],
  theft: [
    {
      id: 'police_stolen_phone',
      category: 'police',
      term: {
        zh: '我的手机被偷了。请帮我报案。',
        en: 'My phone was stolen. Please help me report it.',
        ja: '携帯電話を盗まれました。届け出を手伝ってください。',
        ko: '휴대폰을 도난당했어요. 신고를 도와 주세요.',
        es: 'Me robaron el teléfono. Por favor ayúdeme a denunciarlo.',
        fr: 'On m’a volé mon téléphone. Aidez-moi à le déclarer.',
        de: 'Mein Handy wurde gestohlen. Bitte helfen Sie mir, es zu melden.',
        th: 'โทรศัพท์ฉันถูกขโมย ช่วยฉันแจ้งความหน่อย',
        ru: 'У меня украли телефон. Помогите оформить заявление.',
        it: 'Mi hanno rubato il telefono. Mi aiuta a fare denuncia?',
        pt: 'Roubaram meu celular. Pode me ajudar a registrar?',
        ar: 'هاتفِي سُرق. من فضلك ساعدني في تقديم بلاغ.'
      }
    },
    {
      id: 'police_stolen_wallet',
      category: 'police',
      term: {
        zh: '我的钱包/银行卡被偷了。',
        en: 'My wallet/bank card was stolen.',
        ja: '財布／カードを盗まれました。',
        ko: '지갑/카드를 도난당했어요.',
        es: 'Me robaron la cartera/tarjeta bancaria.',
        fr: 'On m’a volé mon portefeuille/ma carte bancaire.',
        de: 'Mein Portemonnaie/meine Bankkarte wurde gestohlen.',
        th: 'กระเป๋าเงิน/บัตรธนาคารฉันถูกขโมย',
        ru: 'У меня украли кошелёк/банковскую карту.',
        it: 'Mi hanno rubato il portafoglio/la carta bancaria.',
        pt: 'Roubaram minha carteira/meu cartão bancário.',
        ar: 'محفظتي/بطاقتي البنكية سُرقت.'
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
