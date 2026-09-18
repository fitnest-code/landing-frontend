import type { Locale } from "@/lib/i18n/config";

type LocalizedSeoContent = {
  title: string;
  description: string;
  keywords: string[];
};

type SeoPageKey =
  | "home"
  | "offers"
  | "bmi"
  | "contact"
  | "corporate"
  | "partner"
  | "about"
  | "faq"
  | "news"
  | "feedback"
  | "fitMarket"
  | "fitnessCenters"
  | "privacy"
  | "terms"
  | "paymentSuccess"
  | "paymentError"
  | "paymentOptions"
  | "paymentOptionsAbb"
  | "paymentOptionsCoin"
  | "paymentOptionsBob";

const seoContent: Record<SeoPageKey, Record<Locale, LocalizedSeoContent>> = {
  home: {
    az: {
      title: "FitNest — Bakı idman zalları, bir abunə ilə fitness mərkəzləri",
      description:
        "Bakı və Azərbaycanda idman zalları, hovuzlar, yoqa və pilates. Bir FitNest abunəliyi ilə QR giriş — paketi seç və yaxın zalı tap.",
      keywords: [
        "FitNest",
        "idman zalı",
        "Bakı gym",
        "fitness mərkəzi",
        "abunəlik",
        "idman zalları",
      ],
    },
    en: {
      title: "FitNest — Baku gyms and fitness centers, one subscription",
      description:
        "Gyms, pools, yoga and pilates in Baku and Azerbaijan. One FitNest plan, QR access — choose a package and find a gym nearby.",
      keywords: ["FitNest", "Baku gym", "fitness center", "gym subscription", "wellness"],
    },
    ru: {
      title: "FitNest — спортзалы Баку и фитнес-центры по одной подписке",
      description:
        "Залы, бассейны, йога и пилатес в Баку и Азербайджане. Одна подписка FitNest, вход по QR — выберите тариф и найдите зал рядом.",
      keywords: ["FitNest", "спортзал Баку", "фитнес-центр", "фитнес подписка"],
    },
  },
  offers: {
    az: {
      title: "FitNest abunəlik planları — idman zalı üzvlüyü",
      description:
        "Bronze, Silver, Gold və Platinum paketlərini müqayisə et. Bir abunə ilə Bakı idman zallarına QR giriş — 1, 3, 6 və 12 aylıq.",
      keywords: ["abunəlik", "idman zalı üzvlüyü", "fitness plan", "FitNest paket"],
    },
    en: {
      title: "FitNest subscription plans — gym membership",
      description:
        "Compare Bronze, Silver, Gold and Platinum. One subscription, QR access to Baku gyms — 1, 3, 6 or 12 months.",
      keywords: ["gym membership", "fitness subscription", "FitNest plans"],
    },
    ru: {
      title: "Тарифы FitNest — абонемент в спортзал",
      description:
        "Сравните Bronze, Silver, Gold и Platinum. Одна подписка, QR-вход в залы Баку — 1, 3, 6 или 12 месяцев.",
      keywords: ["абонемент", "фитнес подписка", "тариф FitNest"],
    },
  },
  bmi: {
    az: {
      title: "BMI Kalkulyatoru",
      description:
        "Boy və çəkinə əsasən bədən kütlə indeksini hesabla və sağlamlıq göstəricini dəyərləndir.",
      keywords: ["BMI", "bədən kütlə indeksi", "kalkulyator", "sağlamlıq"],
    },
    en: {
      title: "BMI Calculator",
      description:
        "Calculate your body mass index based on height and weight and evaluate your health indicator.",
      keywords: ["BMI", "body mass index", "calculator", "health"],
    },
    ru: {
      title: "Калькулятор ИМТ",
      description:
        "Рассчитайте индекс массы тела по росту и весу и оцените свой показатель здоровья.",
      keywords: ["ИМТ", "индекс массы тела", "калькулятор", "здоровье"],
    },
  },
  contact: {
    az: {
      title: "Əlaqə",
      description: "FitNest komandası ilə əlaqə saxla, suallarını göndər və dəstək al.",
      keywords: ["əlaqə", "FitNest dəstək", "yardım"],
    },
    en: {
      title: "Contact",
      description: "Contact the FitNest team, send your questions, and get support.",
      keywords: ["contact", "FitNest support", "help"],
    },
    ru: {
      title: "Контакты",
      description: "Свяжитесь с командой FitNest, отправьте вопрос и получите поддержку.",
      keywords: ["контакты", "поддержка FitNest", "помощь"],
    },
  },
  corporate: {
    az: {
      title: "Korporativ",
      description:
        "Əməkdaşlarınıza fitness mərkəzlərinə giriş verən korporativ wellness benefiti. Motivasiya, sağlamlıq və komanda ruhu — bir paketdə.",
      keywords: ["korporativ", "FitNest biznes", "komanda fitness", "wellness benefit"],
    },
    en: {
      title: "Corporate",
      description:
        "Give your employees a corporate wellness benefit with access to fitness centers. Motivation, health, and team spirit in one package.",
      keywords: ["corporate", "FitNest business", "team fitness", "wellness benefit"],
    },
    ru: {
      title: "Корпоративным",
      description:
        "Корпоративный wellness-benefit с доступом в фитнес-центры для сотрудников. Мотивация, здоровье и командный дух в одном пакете.",
      keywords: ["корпоративный", "FitNest бизнес", "фитнес для команды", "wellness"],
    },
  },
  partner: {
    az: {
      title: "Tərəfdaş olun",
      description:
        "Zalınızı FitNest-ə qoşun, boş saatları yeni müştərilərlə doldurun və yalnız gələn ziyarətlərə görə qazanın.",
      keywords: ["tərəfdaş", "fitness zalı", "FitNest partner", "zal qoşulması"],
    },
    en: {
      title: "Become a partner",
      description:
        "Connect your gym to FitNest, fill empty hours with new customers, and earn only from visits that actually happen.",
      keywords: ["partner", "gym partnership", "FitNest partner", "connect gym"],
    },
    ru: {
      title: "Стать партнёром",
      description:
        "Подключите зал к FitNest, заполните пустые часы новыми клиентами и зарабатывайте только с реальных визитов.",
      keywords: ["партнёр", "фитнес-зал", "партнёр FitNest", "подключить зал"],
    },
  },
  about: {
    az: {
      title: "Haqqımızda — FitNest fitness abunəlik platforması",
      description:
        "FitNest bir abunə ilə Bakı və Azərbaycanda idman zallarına çıxış verir. QR giriş, çevik paketlər, yüzlərlə fitness mərkəzi.",
      keywords: ["Haqqımızda", "FitNest", "fitness abunəlik", "idman zalı Bakı"],
    },
    en: {
      title: "About FitNest — gym subscription in Azerbaijan",
      description:
        "FitNest opens gyms across Baku and Azerbaijan with one plan. QR check-in, flexible packages, hundreds of fitness centers.",
      keywords: ["About us", "FitNest", "gym subscription", "Baku gyms"],
    },
    ru: {
      title: "О FitNest — фитнес-подписка в Азербайджане",
      description:
        "FitNest открывает залы в Баку и Азербайджане по одной подписке. QR-вход, гибкие тарифы, сотни фитнес-центров.",
      keywords: ["О нас", "FitNest", "фитнес-подписка", "спортзалы Баку"],
    },
  },
  faq: {
    az: {
      title: "FAQ — FitNest abunəlik və idman zalları",
      description:
        "FitNest necə işləyir, abunəlik paketləri, Bakı idman zalları və QR giriş haqqında tez-tez verilən suallar.",
      keywords: ["FAQ", "FitNest suallar", "idman zalı abunəlik", "QR giriş"],
    },
    en: {
      title: "FAQ — FitNest plans, gyms and QR access",
      description:
        "How FitNest works, subscription plans, Baku gyms, and QR check-in — frequently asked questions.",
      keywords: ["FAQ", "FitNest questions", "gym subscription", "QR check-in"],
    },
    ru: {
      title: "FAQ — подписка FitNest, залы и QR-вход",
      description:
        "Как работает FitNest, тарифы, залы Баку и QR-вход — часто задаваемые вопросы.",
      keywords: ["FAQ", "вопросы FitNest", "фитнес подписка", "QR вход"],
    },
  },
  news: {
    az: {
      title: "Xəbərlər",
      description:
        "FitNest-dən yeni zallar, tətbiq yenilikləri və kommunity tədbirləri.",
      keywords: ["xəbərlər", "FitNest", "yeniliklər", "tədbirlər"],
    },
    en: {
      title: "News",
      description: "New gyms, app updates and community events from FitNest.",
      keywords: ["news", "FitNest", "updates", "events"],
    },
    ru: {
      title: "Новости",
      description: "Новые залы, обновления приложения и события FitNest.",
      keywords: ["новости", "FitNest", "обновления", "события"],
    },
  },
  feedback: {
    az: {
      title: "Rəy və Təkliflər",
      description: "FitNest xidmətləri haqqında rəy, təklif və şikayətlərini bizə göndər.",
      keywords: ["feedback", "rəy", "təklif", "şikayət"],
    },
    en: {
      title: "Feedback and Suggestions",
      description: "Send your feedback, suggestions, and complaints about FitNest services.",
      keywords: ["feedback", "suggestions", "complaint", "FitNest"],
    },
    ru: {
      title: "Отзывы и предложения",
      description: "Отправьте отзыв, предложение или жалобу о сервисах FitNest.",
      keywords: ["обратная связь", "предложение", "жалоба", "FitNest"],
    },
  },
  fitMarket: {
    az: {
      title: "FitStore",
      description:
        "İdman üçün geyim, qida, avadanlıq və müxtəlif çeşiddə məhsullar təklif edən mağazalar.",
      keywords: ["FitStore", "idman mağazası", "idman qidası", "endirim"],
    },
    en: {
      title: "FitStore",
      description:
        "Partner stores for sportswear, nutrition, equipment, and wellness products.",
      keywords: ["FitStore", "sports store", "sports nutrition", "discount"],
    },
    ru: {
      title: "FitStore",
      description:
        "Партнерские магазины спортивной одежды, питания, оборудования и товаров для здоровья.",
      keywords: ["FitStore", "спортмагазин", "спортпит", "скидки"],
    },
  },
  fitnessCenters: {
    az: {
      title: "Bakı və Azərbaycanda idman zalları | FitNest",
      description:
        "Bakı və ölkə üzrə fitness mərkəzləri, hovuzlar, yoqa və pilates. Bir abunəliklə QR giriş — yaxın zalı tap və müqayisə et.",
      keywords: ["idman zalları", "Bakı gym", "fitness mərkəzləri", "FitNest zallar"],
    },
    en: {
      title: "Gyms and fitness centers in Baku | FitNest",
      description:
        "Gyms, pools, yoga and pilates studios in Baku and Azerbaijan. One subscription, QR access — find a gym near you.",
      keywords: ["Baku gyms", "fitness centers", "Azerbaijan gym", "FitNest"],
    },
    ru: {
      title: "Спортзалы и фитнес-центры в Баку | FitNest",
      description:
        "Залы, бассейны, студии йоги и пилатеса в Баку и Азербайджане. Одна подписка, вход по QR — найдите зал рядом.",
      keywords: ["спортзалы Баку", "фитнес-центры", "Азербайджан", "FitNest"],
    },
  },
  privacy: {
    az: {
      title: "Məxfilik Siyasəti",
      description: "FitNest platformasında şəxsi məlumatların toplanması, istifadəsi və qorunması siyasəti.",
      keywords: ["məxfilik", "privacy policy", "şəxsi məlumatlar"],
    },
    en: {
      title: "Privacy Policy",
      description: "Policy for collecting, using, and protecting personal data on the FitNest platform.",
      keywords: ["privacy policy", "personal data", "FitNest"],
    },
    ru: {
      title: "Политика конфиденциальности",
      description:
        "Политика сбора, использования и защиты персональных данных на платформе FitNest.",
      keywords: ["конфиденциальность", "персональные данные", "FitNest"],
    },
  },
  terms: {
    az: {
      title: "İstifadə şərtləri",
      description:
        "FitNest xidmətlərindən istifadə zamanı qüvvədə olan şərtlər və hüquqi müddəalar. Vebsaytdan və FitNest mobil tətbiqindən istifadə etməklə siz bu şərtləri qəbul etmiş sayılırsınız.",
      keywords: ["istifadə şərtləri", "terms", "FitNest qaydaları"],
    },
    en: {
      title: "Terms of Use",
      description: "Terms and legal provisions applicable when using FitNest services.",
      keywords: ["terms of use", "legal", "FitNest"],
    },
    ru: {
      title: "Условия использования",
      description: "Условия и правовые положения, действующие при использовании сервисов FitNest.",
      keywords: ["условия использования", "правила", "FitNest"],
    },
  },
  paymentSuccess: {
    az: {
      title: "Ödəniş Uğurlu",
      description: "Ödəniş əməliyyatı uğurla tamamlandı.",
      keywords: ["ödəniş", "uğurlu ödəniş", "fitnest"],
    },
    en: {
      title: "Payment Successful",
      description: "The payment transaction was completed successfully.",
      keywords: ["payment", "successful payment", "fitnest"],
    },
    ru: {
      title: "Оплата успешна",
      description: "Платежная операция успешно завершена.",
      keywords: ["оплата", "успешная оплата", "fitnest"],
    },
  },
  paymentError: {
    az: {
      title: "Ödəniş Uğursuz",
      description: "Ödəniş əməliyyatı tamamlanmadı.",
      keywords: ["ödəniş", "uğursuz ödəniş", "fitnest"],
    },
    en: {
      title: "Payment Failed",
      description: "The payment transaction could not be completed.",
      keywords: ["payment", "payment failed", "fitnest"],
    },
    ru: {
      title: "Ошибка оплаты",
      description: "Платежная операция не была завершена.",
      keywords: ["оплата", "ошибка оплаты", "fitnest"],
    },
  },
  paymentOptions: {
    az: {
      title: "Xüsusi ödəniş imkanları",
      description:
        "ABB və Bank of Baku kartları ilə 0% komissiya və 12 ayadək taksit, FitNest Coin ilə endirim və tərəfdaş təklifləri.",
      keywords: [
        "ABB",
        "Bank of Baku",
        "taksit",
        "FitNest Coin",
        "ödəniş",
        "abunəlik",
      ],
    },
    en: {
      title: "Special payment options",
      description:
        "Pay with ABB and Bank of Baku cards at 0% commission and up to 12 months installment, plus FitNest Coin perks.",
      keywords: [
        "ABB",
        "Bank of Baku",
        "installment",
        "FitNest Coin",
        "payment",
        "subscription",
      ],
    },
    ru: {
      title: "Особые способы оплаты",
      description:
        "Карты ABB и Bank of Baku с 0% комиссией и рассрочкой до 12 месяцев, а также бонусы FitNest Coin.",
      keywords: [
        "ABB",
        "Bank of Baku",
        "рассрочка",
        "FitNest Coin",
        "оплата",
        "подписка",
      ],
    },
  },
  paymentOptionsAbb: {
    az: {
      title: "ABB kartı ilə taksit",
      description:
        "ABB kartı ilə FitNest abunəliyini 0% komissiya və 12 ayadək taksitlə əldə et.",
      keywords: ["ABB", "taksit", "0% komissiya", "FitNest abunəlik"],
    },
    en: {
      title: "ABB card installments",
      description:
        "Get a FitNest subscription with an ABB card at 0% commission and up to 12 months installment.",
      keywords: ["ABB", "installment", "0% commission", "FitNest subscription"],
    },
    ru: {
      title: "Рассрочка картой ABB",
      description:
        "Оформите подписку FitNest картой ABB с 0% комиссией и рассрочкой до 12 месяцев.",
      keywords: ["ABB", "рассрочка", "0% комиссия", "подписка FitNest"],
    },
  },
  paymentOptionsCoin: {
    az: {
      title: "FitNest Coin",
      description:
        "FitNest Coin qazan, abunəlikdə istifadə et: 20 Coin = 1 AZN, 12 ay etibarlılıq müddəti.",
      keywords: ["FitNest Coin", "coin", "endirim", "abunəlik", "bonus"],
    },
    en: {
      title: "FitNest Coin",
      description:
        "Earn FitNest Coin and use it on a subscription: 20 Coin = 1 AZN, valid for 12 months.",
      keywords: ["FitNest Coin", "coin", "discount", "subscription", "bonus"],
    },
    ru: {
      title: "FitNest Coin",
      description:
        "Копите FitNest Coin и используйте их для подписки: 20 Coin = 1 AZN, срок действия 12 месяцев.",
      keywords: ["FitNest Coin", "coin", "скидка", "подписка", "бонус"],
    },
  },
  paymentOptionsBob: {
    az: {
      title: "Bank of Baku kartı ilə taksit",
      description:
        "Bank of Baku kartı ilə FitNest abunəliyini 0% komissiya və 12 ayadək taksitlə əldə et.",
      keywords: ["Bank of Baku", "BOB", "taksit", "0% komissiya", "FitNest abunəlik"],
    },
    en: {
      title: "Bank of Baku card installments",
      description:
        "Get a FitNest subscription with a Bank of Baku card at 0% commission and up to 12 months installment.",
      keywords: [
        "Bank of Baku",
        "BOB",
        "installment",
        "0% commission",
        "FitNest subscription",
      ],
    },
    ru: {
      title: "Рассрочка картой Bank of Baku",
      description:
        "Оформите подписку FitNest картой Bank of Baku с 0% комиссией и рассрочкой до 12 месяцев.",
      keywords: ["Bank of Baku", "BOB", "рассрочка", "0% комиссия", "подписка FitNest"],
    },
  },
};

export const getSeoContent = (page: SeoPageKey, locale: Locale) =>
  seoContent[page][locale];
