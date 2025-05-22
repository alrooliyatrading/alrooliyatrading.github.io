// Al Rooliya Trading Est. Website JS

(() => {
  const WHATSAPP_NUMBER = '96879638955';
  const SERVICES = [
    {key:"brakes",en:"Brake service & repair",ar:"خدمة وإصلاح الفرامل"},
    {key:"oil",en:"Oil change",ar:"تغيير الزيت"},
    {key:"suspension",en:"Steering & suspension repair",ar:"إصلاح التوجيه والتعليق"},
    {key:"tyres",en:"Tyres",ar:"الإطارات"},
    {key:"diagnostic",en:"Vehicle engine diagnostic",ar:"تشخيص محرك المركبة"},
    {key:"filters",en:"Air & cabin filter replacement",ar:"استبدال فلاتر الهواء والمقصورة"},
    {key:"exhaust",en:"Exhaust repair",ar:"إصلاح العادم"},
    {key:"denting",en:"Denting & painting",ar:"سمكرة ودهان"},
    {key:"lathe",en:"Lathe work",ar:"خراطة"},
    {key:"disc",en:"Brake disc resurfacing",ar:"تسوية أقراص الفرامل"},
    {key:"welding",en:"Welding",ar:"لحام"},
    {key:"transmission",en:"Manual transmission repair",ar:"إصلاح ناقل الحركة اليدوي"},
    {key:"appliance",en:"Industrial appliance repair & maintenance",ar:"صيانة وإصلاح المعدات الصناعية"}
  ];

  let currentLang = 'en';

  // Elements
  const langBtns    = document.querySelectorAll('#lang-switch button');
  const servicesUl  = document.getElementById('services-list');
  const applyBtn    = document.getElementById('apply-btn');
  const clearBtn    = document.getElementById('clear-btn');
  const bookBtn     = document.getElementById('book-btn');
  const formFields  = document.getElementById('form-fields');
  const catSelect   = document.getElementById('category');
  const svcSelect   = document.getElementById('service');
  const plateGrp    = document.getElementById('plate-group');
  const bmLabel     = document.getElementById('bm-label');
  const typGrp      = document.getElementById('typ-group');
  const dateInput   = document.getElementById('date');
  const timeInput   = document.getElementById('time');
  const urgencySel  = document.getElementById('urgency');
  const contactSel  = document.getElementById('contact');
  const problemTA   = document.getElementById('problem');
  const errorMsg    = document.getElementById('error-msg');
  const whatsappBtn = document.getElementById('whatsapp-chat-btn');
  const appointmentForm = document.getElementById('appointment-form');

  // Language switching
  function setDirAndFont(lang) {
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    document.body.style.fontFamily = (lang === 'ar')
      ? "'Cairo', 'Urbanist', Arial, sans-serif"
      : "'Urbanist', 'Cairo', Arial, sans-serif";
  }
  function showLang(lang) {
    currentLang = lang;
    setDirAndFont(lang);

    // Only one .active per language per element
    document.querySelectorAll('.lang.en, .lang.ar').forEach(el => {
      el.classList.remove('active');
      el.style.display = 'none';
    });
    document.querySelectorAll('.lang.' + lang).forEach(el => {
      el.classList.add('active');
      el.style.display = 'inline';
    });
    // Update select option texts
    document.querySelectorAll('#category option').forEach(opt=>opt.textContent=opt.dataset[lang]);
    document.querySelectorAll('#urgency option').forEach(opt=>opt.textContent=opt.dataset[lang]);
    document.querySelectorAll('#contact option').forEach(opt=>opt.textContent=opt.dataset[lang]);
    populateServiceOptions();
  }

  // Service List
  function populateServicesSection() {
    servicesUl.innerHTML = '';
    SERVICES.forEach(s => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="lang en active">${s.en}</span>
        <span class="lang ar">${s.ar}</span>
      `;
      servicesUl.appendChild(li);
    });
  }

  // Service <select> options
  function populateServiceOptions() {
    const isApp = catSelect.value === 'appliance';
    svcSelect.innerHTML = '';
    SERVICES.filter(s => (s.key==='appliance')===isApp).forEach(s => {
      const o = document.createElement('option');
      o.value = s.key;
      o.textContent = (currentLang==='en' ? s.en : s.ar);
      svcSelect.appendChild(o);
    });

    if (isApp) {
      plateGrp.classList.add('hidden');
      bmLabel.querySelector('.en').innerHTML = 'Make & Model <small>(optional)</small>';
      bmLabel.querySelector('.ar').innerHTML = 'النوع والموديل <small>(اختياري)</small>';
      typGrp.classList.remove('hidden');
    } else {
      plateGrp.classList.remove('hidden');
      bmLabel.querySelector('.en').innerHTML = 'Make & Model <small>(optional)</small>';
      bmLabel.querySelector('.ar').innerHTML = 'النوع والموديل <small>(اختياري)</small>';
      typGrp.classList.add('hidden');
    }
  }

  // WhatsApp Button
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', e => {
      e.preventDefault();
      whatsappBtn.animate([{boxShadow:'0 0 0 0 #25d36655'}, {boxShadow:'0 0 0 7px #25d36655'}, {boxShadow:'0 0 0 0 #25d36655'}], {duration:410, easing:'ease'});
      setTimeout(() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank'), 210);
    });
  }

  // Apply Button
  applyBtn.addEventListener('click', () => {
    formFields.classList.remove('hidden');
    errorMsg.textContent = '';
    populateServiceOptions();
    setTimeout(() => {
      document.getElementById('form-fields').scrollIntoView({behavior:'smooth',block:'start'});
    }, 180);
  });

  // Clear Button
  clearBtn.addEventListener('click', () => {
    formFields.classList.add('hidden');
    errorMsg.textContent = '';
    catSelect.value = 'vehicle';
    svcSelect.innerHTML = '';
    appointmentForm.reset();
    populateServiceOptions();
  });

  // Book Button
  bookBtn.addEventListener('click', () => {
    errorMsg.textContent = '';
    bookBtn.animate([{boxShadow:'0 0 0 0 #ff9b2466'}, {boxShadow:'0 0 0 11px #ff9b2466'}, {boxShadow:'0 0 0 0 #ff9b2466'}], {duration:330, easing:'ease'});
    const missing = [];
    if(!svcSelect.value) missing.push(currentLang==='en'?'Service':'الخدمة');
    if(!document.getElementById('name').value.trim()) missing.push(currentLang==='en'?'Name':'الاسم');
    const ph = document.getElementById('phone').value.trim();
    if(!/^\d{8}$/.test(ph)) missing.push(currentLang==='en'?'Phone (8 digits)':'الهاتف (8 أرقام)');
    if(!dateInput.value) missing.push(currentLang==='en'?'Date':'التاريخ');
    if(!timeInput.value) missing.push(currentLang==='en'?'Time':'الوقت');
    if(!urgencySel.value) missing.push(currentLang==='en'?'Urgency':'درجة الأهمية');
    if(!contactSel.value) missing.push(currentLang==='en'?'Contact method':'طريقة الاتصال');
    if(missing.length){
      errorMsg.textContent = (currentLang==='en'?'Please fill/fix: ':'يرجى ملء/تصحيح: ')+ missing.join(', ');
      return;
    }

    const isApp = catSelect.value==='appliance';
    const lines = [];
    const svcText = svcSelect.options[svcSelect.selectedIndex].text;

    if(isApp){
      lines.push(currentLang==='en'?'Hello,':'مرحبًا،');
      lines.push(currentLang==='en'?'I would like to book a service appointment for an industrial appliance.':'أرغب في حجز موعد لصيانة جهاز صناعي.');
      lines.push('');
      lines.push((currentLang==='en'?'Service Requested: ':'الخدمة المطلوبة: ')+svcText);

      const typ = document.getElementById('typ').value.trim();
      if(typ) lines.push((currentLang==='en'?'Appliance Type: ':'نوع الجهاز: ')+typ);

      const bm = document.getElementById('bm').value.trim();
      if(bm) lines.push((currentLang==='en'?'Make & Model: ':'النوع والموديل: ')+bm);
    } else {
      lines.push(currentLang==='en'?'Hello,':'مرحبًا،');
      lines.push(currentLang==='en'?'I would like to schedule an appointment for my vehicle.':'أرغب في حجز موعد لمركبتي.');
      lines.push('');
      lines.push((currentLang==='en'?'Service Requested: ':'الخدمة المطلوبة: ')+svcText);

      const bm = document.getElementById('bm').value.trim();
      if(bm) lines.push((currentLang==='en'?'Vehicle Make & Model: ':'نوع وموديل المركبة: ')+bm);

      const plate = document.getElementById('plate').value.trim();
      if(plate) lines.push((currentLang==='en'?'Vehicle Plate Number: ':'رقم لوحة المركبة: ')+plate);
    }

    lines.push((currentLang==='en'?'Preferred Date: ':'التاريخ المفضل: ')+dateInput.value);
    lines.push((currentLang==='en'?'Preferred Time: ':'الوقت المفضل: ')+timeInput.value);
    lines.push((currentLang==='en'?'Urgency Level: ':'درجة الأهمية: ')+urgencySel.value);
    lines.push((currentLang==='en'?'Preferred Contact Method: ':'طريقة الاتصال المفضلة: ')+contactSel.value);

    const prob = problemTA.value.trim();
    if(prob) lines.push((currentLang==='en'?'Problem Description: ':'وصف المشكلة: ')+prob);

    lines.push((currentLang==='en'?'Customer Name: ':'اسم العميل: ')+
      document.getElementById('name').value.trim());
    lines.push((currentLang==='en'?'Phone Number: ':'رقم الهاتف: ')+ph);

    lines.push('');
    lines.push(currentLang==='en'?'Thank you for your assistance.':'شكرًا لكم على تعاونكم.');
    lines.push('---');
    lines.push(
      currentLang==='en'
        ? '(This message was generated via the Al Rooliya Website Appointment System.)'
        : '(تم إنشاء هذه الرسالة عبر نظام حجز المواعيد بموقع مؤسسة الرولية.)'
    );

    setTimeout(() => {
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n\n'))}`,
        '_blank'
      );
    }, 120);
  });

  // Language Switcher
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b=>b.classList.remove('active-lang-btn'));
      btn.classList.add('active-lang-btn');
      showLang(btn.dataset.lang);
    });
  });

  // Urgency highlight
  if (urgencySel) {
    urgencySel.addEventListener('change', () => {
      if (urgencySel.value === "Urgent") {
        urgencySel.style.borderColor = "#f72e21";
        urgencySel.style.boxShadow = "0 0 0 2px #f72e217a";
      } else {
        urgencySel.style.borderColor = "#25d366";
        urgencySel.style.boxShadow = "";
      }
    });
  }

  // Auto set min date today
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Render on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    showLang('en');
    populateServicesSection();
    // Set year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // For accessibility: tab highlight
    document.body.addEventListener('keyup', e => {
      if (e.key === "Tab") {
        document.body.classList.add('show-focus');
      }
    });
    document.body.addEventListener('mousedown', () => {
      document.body.classList.remove('show-focus');
    });
  });

  // Optional: Auto-detect Arabic if browser is Arabic (uncomment to enable)
  // if (navigator.language && navigator.language.startsWith('ar')) showLang('ar');
})();
