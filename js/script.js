/**
 * ACADEMIA ISAD FIT - SCRIPT JS
 * Interatividade, animações, calculadora de IMC, filtros e integração WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mouse Ambient Glow Follower
  const glow = document.createElement('div');
  glow.className = 'mouse-glow';
  document.body.appendChild(glow);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderGlow() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(renderGlow);
  }
  renderGlow();

  // 2. Header Scroll Effect & Active Link Tracker
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting
    let scrollPosition = window.scrollY + 120;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // 3. Mobile Navigation Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Animated Counters on Scroll
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animatedStats) {
        animatedStats = true;
        statNumbers.forEach((stat) => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const prefix = stat.getAttribute('data-prefix') || '';
          const suffix = stat.getAttribute('data-suffix') || '';
          const duration = 2000;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const counterInterval = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(counterInterval);
            }
            // Format number (e.g. 1500 -> 1.500)
            const formatted = Math.floor(current).toLocaleString('pt-BR');
            stat.textContent = `${prefix}${formatted}${suffix}`;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // 5. Interactive IMC (BMI) Calculator
  const weightInput = document.getElementById('imc-weight');
  const heightInput = document.getElementById('imc-height');
  const weightVal = document.getElementById('weight-val');
  const heightVal = document.getElementById('height-val');
  const imcScore = document.getElementById('imc-score');
  const imcClass = document.getElementById('imc-class');
  const imcAdvice = document.getElementById('imc-advice');
  const imcPointer = document.getElementById('imc-pointer');
  const imcWhatsappBtn = document.getElementById('imc-whatsapp-btn');

  function calculateIMC() {
    if (!weightInput || !heightInput) return;

    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value); // in cm

    weightVal.textContent = `${weight} kg`;
    heightVal.textContent = `${height} cm`;

    const heightInMeters = height / 100;
    const imc = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    imcScore.textContent = imc;

    // Pointer Gauge Math: Range from 15 to 40 IMC mapped to 5% to 95%
    const minImc = 15;
    const maxImc = 40;
    const percentage = Math.min(Math.max(((imc - minImc) / (maxImc - minImc)) * 100, 5), 95);
    imcPointer.style.left = `${percentage}%`;

    let classification = '';
    let advice = '';
    let color = '';
    let bg = '';

    if (imc < 18.5) {
      classification = 'Abaixo do Peso';
      advice = 'Recomendamos nosso plano com foco em ganho de massa muscular (hipertrofia) e acompanhamento nutricional.';
      color = '#3B82F6';
      bg = 'rgba(59, 130, 246, 0.15)';
    } else if (imc >= 18.5 && imc < 24.9) {
      classification = 'Peso Ideal / Saudável';
      advice = 'Excelente! Você está no peso ideal. Venha manter seu condicionamento e força com nossos treinos na Isad Fit!';
      color = '#10B981';
      bg = 'rgba(16, 185, 129, 0.15)';
    } else if (imc >= 25.0 && imc < 29.9) {
      classification = 'Sobrepeso Leve';
      advice = 'Momento ideal para combinar musculação e exercícios aeróbicos de alta intensidade (Spinning e Funcional).';
      color = '#F59E0B';
      bg = 'rgba(245, 158, 11, 0.15)';
    } else {
      classification = 'Obesidade';
      advice = 'Nossos professores especializados vão criar um programa seguro e gradual para queima de gordura e saúde total.';
      color = '#EF4444';
      bg = 'rgba(239, 68, 68, 0.15)';
    }

    imcClass.textContent = classification;
    imcClass.style.color = color;
    imcClass.style.borderColor = color;
    imcClass.style.backgroundColor = bg;
    imcAdvice.textContent = advice;

    // Update WhatsApp pre-filled text
    const message = encodeURIComponent(
      `Olá, Academia Isad Fit! Calculei meu IMC no site (Peso: ${weight}kg, Altura: ${height}cm, IMC: ${imc} - ${classification}). Gostaria de agendar uma aula experimental e conversar com um professor!`
    );
    if (imcWhatsappBtn) {
      imcWhatsappBtn.href = `https://wa.me/5561981843897?text=${message}`;
    }
  }

  if (weightInput && heightInput) {
    weightInput.addEventListener('input', calculateIMC);
    heightInput.addEventListener('input', calculateIMC);
    calculateIMC();
  }

  // 6. Planos Oficiais da Academia Isad Fit
  const planCards = document.querySelectorAll('.plan-card');
  planCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'var(--primary)';
    });
    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('featured')) {
        card.style.borderColor = 'var(--border-subtle)';
      }
    });
  });

  // 7. Schedule Tabs (Grade de Horários)
  const scheduleTabs = document.querySelectorAll('.schedule-tab');
  const scheduleItems = document.querySelectorAll('.schedule-item');

  scheduleTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      scheduleTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-day');

      scheduleItems.forEach((item) => {
        const itemDay = item.getAttribute('data-day');
        if (filter === 'all' || itemDay === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 8. Gallery Lightbox Modal
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      lightboxModal.classList.remove('active');
    }
  });

  // 9. Testimonials Carousel Auto-play & Controls
  const track = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.test-dot');
  let currentSlide = 0;
  let carouselInterval;

  function goToSlide(index) {
    if (!track) return;
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  function startCarousel() {
    carouselInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
  }

  function stopCarousel() {
    clearInterval(carouselInterval);
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      stopCarousel();
      goToSlide(idx);
      startCarousel();
    });
  });

  if (track) {
    track.addEventListener('mouseenter', stopCarousel);
    track.addEventListener('mouseleave', startCarousel);
    startCarousel();
  }

  // 10. Scroll Reveal Animation with IntersectionObserver
  const animatedElements = document.querySelectorAll('[data-animate]');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedElements.forEach((el) => revealObserver.observe(el));

  // 11. Toast Notifications System
  function showToast(message, icon = '✓') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color: var(--primary); font-weight: 800;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // 12. Contact Form Handling
  const contactForm = document.getElementById('gym-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const goal = document.getElementById('form-goal').value;
      const message = document.getElementById('form-message').value.trim();

      if (!name || !phone) {
        showToast('Por favor, preencha seu nome e telefone.', '⚠️');
        return;
      }

      showToast('Mensagem enviada com sucesso! Redirecionando para o WhatsApp...', '✓');

      const whatsappText = encodeURIComponent(
        `Olá, Academia Isad Fit! Meu nome é ${name} (${phone}).\nMeu objetivo principal é: ${goal}.\n${message ? `Mensagem: ${message}` : 'Gostaria de agendar uma visita e conhecer a academia!'}`
      );

      setTimeout(() => {
        window.open(`https://wa.me/5561981843897?text=${whatsappText}`, '_blank');
        contactForm.reset();
      }, 1000);
    });
  }

  // 13. 3D Card Hover Tilt Micro-interaction
  const tiltCards = document.querySelectorAll('.modality-card, .plan-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});
