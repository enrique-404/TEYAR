// ---- fricción básica: bloquear clic derecho y atajos comunes de DevTools ----
  // Nota: esto NO oculta el código real; cualquiera con conocimientos básicos
  // puede saltárselo (ej. deshabilitando JS o usando las opciones del menú del navegador).
  // Solo disuade a usuarios casuales, no protege información sensible.
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (e.key === 'F12') e.preventDefault();
    if (e.ctrlKey && e.shiftKey && (k === 'i' || k === 'j' || k === 'c')) e.preventDefault();
    if (e.ctrlKey && k === 'u') e.preventDefault();
  });

  // ---- header scroll state (throttled with rAF, passive listener) ----
  const header = document.getElementById('site-header');
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 40);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // ---- mobile nav ----
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  }));

  // ---- reveal on scroll ----
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  // ---- counters ----
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1400;
        const start = performance.now();
        function tick(now){
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterObserver.observe(el));

  // ---- project data + modal ----
  const projects = [
    { code:'TY-2024-014', name:'Nave Industrial Bajío Norte', meta:'Querétaro · Nave industrial · 2024',
      img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
      desc:'Diseño y construcción de nave industrial de 12,000 m² con andenes de carga, oficinas administrativas y patio de maniobras.',
      superficie:'12,000 m²', duracion:'11 meses', alcance:'Obra civil + electromecánica' },
    { code:'TY-2023-009', name:'Planta Electromecánica San Luis', meta:'San Luis Potosí · Electromecánica · 2023',
      img:'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=900&q=80',
      desc:'Instalación electromecánica integral para planta de manufactura, incluyendo subestación eléctrica y sistema contra incendio.',
      superficie:'5,400 m²', duracion:'7 meses', alcance:'Obra electromecánica' },
    { code:'TY-2023-002', name:'Corporativo Vía Industrial', meta:'Toluca · Obra civil · 2023',
      img:'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=900&q=80',
      desc:'Construcción de edificio corporativo de tres niveles con estructura de acero y fachada de cristal templado.',
      superficie:'3,200 m²', duracion:'9 meses', alcance:'Obra civil' },
    { code:'TY-2022-021', name:'Ampliación Planta Logística', meta:'Guanajuato · Nave industrial · 2022',
      img:'https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&w=900&q=80',
      desc:'Ampliación de 6,000 m² a una nave logística existente, manteniendo operación continua del cliente durante la obra.',
      superficie:'6,000 m²', duracion:'6 meses', alcance:'Obra civil + ingeniería' },
    { code:'TY-2022-006', name:'Parque Industrial Altavista', meta:'Edo. México · Desarrollo · 2022',
      img:'https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=900&q=80',
      desc:'Desarrollo inmobiliario industrial de tres naves especulativas con infraestructura de urbanización completa.',
      superficie:'22,000 m²', duracion:'14 meses', alcance:'Desarrollo inmobiliario' },
    { code:'TY-2021-017', name:'Torre Administrativa Norte', meta:'Querétaro · Proyecto e ingeniería · 2021',
      img:'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
      desc:'Proyecto ejecutivo y construcción de torre administrativa de cuatro niveles para complejo industrial.',
      superficie:'4,100 m²', duracion:'10 meses', alcance:'Proyecto e ingeniería' }
  ];

  const modalBg = document.getElementById('modalBg');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  document.querySelectorAll('.proj').forEach(el => {
    el.addEventListener('click', () => {
      const p = projects[parseInt(el.dataset.proj, 10)];
      modalContent.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <div class="modal-body">
          <div class="modal-code mono">${p.code}</div>
          <h3>${p.name}</h3>
          <p class="mono" style="font-size:11px; text-transform:uppercase; color:var(--gris-concreto); margin-bottom:20px;">${p.meta}</p>
          <div class="modal-meta">
            <div>Superficie<strong>${p.superficie}</strong></div>
            <div>Duración<strong>${p.duracion}</strong></div>
            <div>Alcance<strong>${p.alcance}</strong></div>
          </div>
          <p>${p.desc}</p>
        </div>
      `;
      modalBg.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  function closeModal(){
    modalBg.classList.remove('open');
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);
  modalBg.addEventListener('click', (e) => { if (e.target === modalBg) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ============================================================
  // GALERÍA — LIBRO DE FOTOS (FLIPBOOK)
  // ============================================================
  // CÓMO AGREGAR TUS FOTOS:
  // 1) Crea una carpeta llamada "images" y adentro otra llamada "galeria",
  //    junto a tu archivo index.html (misma carpeta que styles.css y script.js).
  // 2) Copia ahí tus fotos y ponles estos mismos nombres (foto-01.jpg, foto-02.jpg, etc.)
  //    — o bien, cambia los nombres de la lista de abajo por los nombres reales de tus fotos.
  // 3) Usa fotos verticales (más altas que anchas) para que se vean mejor como páginas de libro.
  // 4) Si quieres más o menos páginas, solo agrega o quita líneas de esta lista.
  const FOTOS_GALERIA = [
    'images/galeria/foto-01.jpg',
    'images/galeria/foto-02.jpg',
    'images/galeria/foto-03.jpg',
    'images/galeria/foto-04.jpg',
    'images/galeria/foto-05.jpg',
    'images/galeria/foto-06.jpg'
  ];

  (function initGaleriaFlipbook(){
    const libro = document.getElementById('libroGaleria');
    if (!libro || typeof St === 'undefined') return;

    FOTOS_GALERIA.forEach((src, i) => {
      const pagina = document.createElement('div');
      pagina.className = 'pagina';
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Foto de galería ${i + 1}`;
      img.loading = 'lazy';
      img.onerror = () => {
        pagina.classList.add('pagina-vacia');
        pagina.innerHTML = `<span>Falta esta foto:<br>${src}</span>`;
      };
      pagina.appendChild(img);
      libro.appendChild(pagina);
    });

    const pageFlip = new St.PageFlip(libro, {
      width: 400,
      height: 560,
      size: 'stretch',
      minWidth: 260,
      maxWidth: 560,
      minHeight: 360,
      maxHeight: 780,
      showCover: false,
      usePortrait: true,
      maxShadowOpacity: 0.5,
      mobileScrollSupport: false
    });
    pageFlip.loadFromHTML(document.querySelectorAll('#libroGaleria .pagina'));

    const counter = document.getElementById('flipCounter');
    function updateCounter(){
      if (counter) counter.textContent = `Página ${pageFlip.getCurrentPageIndex() + 1} de ${pageFlip.getPageCount()}`;
    }
    updateCounter();
    pageFlip.on('flip', updateCounter);

    const prevBtn = document.getElementById('flipPrev');
    const nextBtn = document.getElementById('flipNext');
    prevBtn?.addEventListener('click', () => pageFlip.flipPrev());
    nextBtn?.addEventListener('click', () => pageFlip.flipNext());
  })();

  // ---- contact form ----
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const correo = form.correo.value.trim();
    const mensaje = form.mensaje.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    if (!nombre || !emailOk || !mensaje){
      formMsg.textContent = 'Revisa los campos: nombre, correo válido y mensaje son obligatorios.';
      formMsg.className = 'form-msg err';
      return;
    }
    formMsg.textContent = 'Gracias, ' + nombre.split(' ')[0] + '. Tu solicitud fue enviada, te contactaremos pronto.';
    formMsg.className = 'form-msg ok';
    form.reset();
  });

  