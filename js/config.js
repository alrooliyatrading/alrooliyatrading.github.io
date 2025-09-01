// Configuration Module
window.CONFIG = {
  // Contact Information
  WHATSAPP_NUMBER: '96899795913',
  PHONE_NUMBER: '+96899795913',
  EMAIL: 'alrooliyatrading@gmail.com',
  LOCATION: 'Qurayyat, Oman',
  CR_NUMBER: '15484626',
  
  // Business Hours - Updated as requested
  BUSINESS_HOURS: {
    weekdays: { 
      morning: { start: 7.5, end: 13.5 }, // 7:30 AM - 1:30 PM
      afternoon: { start: 15, end: 19.5 }  // 3:00 PM - 7:30 PM
    },
    friday: { 
      morning: { start: 7.5, end: 12.5 }, // 7:30 AM - 12:30 PM
      afternoon: { start: 15, end: 19.5 }  // 3:00 PM - 7:30 PM
    }
  },
  
  // Services Data
  SERVICES: [
    {
      key: "brakes",
      en: "Brake Service & Repair",
      ar: "خدمة وإصلاح الفرامل",
      icon: "fas fa-car-crash",
      category: "vehicle",
      description: {
        en: "Complete brake system diagnosis and repair",
        ar: "تشخيص وإصلاح نظام الفرامل الكامل"
      }
    },
    {
      key: "oil",
      en: "Oil Change Service",
      ar: "خدمة تغيير الزيت",
      icon: "fas fa-oil-can",
      category: "vehicle",
      description: {
        en: "Regular oil changes and filter replacements",
        ar: "تغيير الزيت المنتظم واستبدال الفلاتر"
      }
    },
    {
      key: "suspension",
      en: "Steering & Suspension",
      ar: "التوجيه والتعليق",
      icon: "fas fa-car-side",
      category: "vehicle",
      description: {
        en: "Steering and suspension system repair",
        ar: "إصلاح نظام التوجيه والتعليق"
      }
    },
    {
      key: "tyres",
      en: "Tyre Services",
      ar: "خدمات الإطارات",
      icon: "fas fa-life-ring",
      category: "vehicle",
      description: {
        en: "Tyre installation, balancing, and alignment",
        ar: "تركيب وموازنة ومحاذاة الإطارات"
      }
    },
    {
      key: "diagnostic",
      en: "Engine Diagnostics",
      ar: "تشخيص المحرك",
      icon: "fas fa-search",
      category: "vehicle",
      description: {
        en: "Advanced engine diagnostic services",
        ar: "خدمات تشخيص المحرك المتقدمة"
      }
    },
    {
      key: "filters",
      en: "Filter Replacement",
      ar: "استبدال الفلاتر",
      icon: "fas fa-filter",
      category: "vehicle",
      description: {
        en: "Air and cabin filter replacement services",
        ar: "خدمات استبدال فلاتر الهواء والمقصورة"
      }
    },
    {
      key: "exhaust",
      en: "Exhaust Repair",
      ar: "إصلاح العادم",
      icon: "fas fa-wind",
      category: "vehicle",
      description: {
        en: "Complete exhaust system repair and maintenance",
        ar: "إصلاح وصيانة نظام العادم الكامل"
      }
    },
    {
      key: "denting",
      en: "Body Work & Painting",
      ar: "أعمال الهيكل والدهان",
      icon: "fas fa-paint-brush",
      category: "vehicle",
      description: {
        en: "Professional denting, painting, and bodywork",
        ar: "أعمال السمكرة والدهان والهيكل المهنية"
      }
    },
    {
      key: "lathe",
      en: "Precision Machining",
      ar: "أعمال الخراطة",
      icon: "fas fa-cog",
      category: "vehicle",
      description: {
        en: "Precision lathe work and machining services",
        ar: "أعمال الخراطة والتشغيل الدقيقة"
      }
    },
    {
      key: "disc",
      en: "Brake Disc Resurfacing",
      ar: "تجديد أقراص الفرامل",
      icon: "fas fa-compact-disc",
      category: "vehicle",
      description: {
        en: "Professional brake disc resurfacing service",
        ar: "خدمة تجديد أقراص الفرامل المهنية"
      }
    },
    {
      key: "welding",
      en: "Welding Services",
      ar: "خدمات اللحام",
      icon: "fas fa-fire",
      category: "vehicle",
      description: {
        en: "Professional welding and metalwork",
        ar: "خدمات اللحام وأعمال المعادن المهنية"
      }
    },
    {
      key: "transmission",
      en: "Transmission Repair",
      ar: "إصلاح ناقل الحركة",
      icon: "fas fa-cogs",
      category: "vehicle",
      description: {
        en: "Manual transmission repair and maintenance",
        ar: "إصلاح وصيانة ناقل الحركة اليدوي"
      }
    },
    {
      key: "appliance",
      en: "Industrial Equipment",
      ar: "المعدات الصناعية",
      icon: "fas fa-industry",
      category: "appliance",
      description: {
        en: "Industrial appliance repair and maintenance",
        ar: "إصلاح وصيانة المعدات الصناعية"
      }
    }
  ],

  // Animation settings
  ANIMATIONS: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    stagger: 100
  },

  // Intersection Observer options
  OBSERVER_OPTIONS: {
    rootMargin: '-20% 0px',
    threshold: 0.1
  },

  // Form validation rules
  FORM_VALIDATION: {
    phone: {
      pattern: /^(\+968|968)?[0-9]{8}$/,
      message: {
        en: 'Please enter a valid Omani phone number',
        ar: 'يرجى إدخال رقم هاتف عماني صحيح'
      }
    },
    name: {
      minLength: 2,
      message: {
        en: 'Name must be at least 2 characters',
        ar: 'يجب أن يكون الاسم على الأقل حرفين'
      }
    }
  },

  // WhatsApp message templates
  WHATSAPP_MESSAGES: {
    general: {
      en: "Hello! I'm interested in your automotive services. Could you please provide more information?",
      ar: "مرحباً! أنا مهتم بخدماتكم للسيارات. هل يمكنكم تقديم المزيد من المعلومات؟"
    },
    appointment: {
      en: "Hi! I would like to book an appointment for {service}. My details:\nName: {name}\nPhone: {phone}\nVehicle: {vehicle}\nPreferred Date: {date}\nTime: {time}\nIssue: {description}",
      ar: "مرحباً! أود حجز موعد لـ {service}. تفاصيلي:\nالاسم: {name}\nالهاتف: {phone}\nالمركبة: {vehicle}\nالتاريخ المفضل: {date}\nالوقت: {time}\nالمشكلة: {description}"
    }
  }
};