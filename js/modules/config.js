// Configuration Module
window.CONFIG = {
  WHATSAPP_NUMBER: '96879638955',
  BUSINESS_HOURS: {
    weekdays: { open: 8, close: 20 },
    friday: { open: 14, close: 20 }
  },
  SERVICES: [
    {key:"brakes",en:"Brake service & repair",ar:"خدمة وإصلاح الفرامل",icon:"🔧",category:"vehicle"},
    {key:"oil",en:"Oil change",ar:"تغيير الزيت",icon:"🛢️",category:"vehicle"},
    {key:"suspension",en:"Steering & suspension repair",ar:"إصلاح التوجيه والتعليق",icon:"🚗",category:"vehicle"},
    {key:"tyres",en:"Tyres",ar:"الإطارات",icon:"⚙️",category:"vehicle"},
    {key:"diagnostic",en:"Vehicle engine diagnostic",ar:"تشخيص محرك المركبة",icon:"💻",category:"vehicle"},
    {key:"filters",en:"Air & cabin filter replacement",ar:"استبدال فلاتر الهواء والمقصورة",icon:"🔄",category:"vehicle"},
    {key:"exhaust",en:"Exhaust repair",ar:"إصلاح العادم",icon:"💨",category:"vehicle"},
    {key:"denting",en:"Denting & painting",ar:"سمكرة ودهان",icon:"🎨",category:"vehicle"},
    {key:"lathe",en:"Lathe work",ar:"خراطة",icon:"🔩",category:"vehicle"},
    {key:"disc",en:"Brake disc resurfacing",ar:"تسوية أقراص الفرامل",icon:"💿",category:"vehicle"},
    {key:"welding",en:"Welding",ar:"لحام",icon:"⚡",category:"vehicle"},
    {key:"transmission",en:"Manual transmission repair",ar:"إصلاح ناقل الحركة اليدوي",icon:"⚙️",category:"vehicle"},
    {key:"appliance",en:"Industrial appliance repair",ar:"إصلاح المعدات الصناعية",icon:"🏭",category:"appliance"}
  ],
  ANIMATIONS: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};
