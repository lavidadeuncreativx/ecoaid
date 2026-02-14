import './style.css'
import gsap from 'gsap'
import {
  ScrollTrigger
} from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger)

// --- 1. SETUP & LENIS ---
const lenis = new Lenis({
  duration: 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// --- 2. HEADER STICKY & ACTIVE LINK ---
const header = document.querySelector('#main-header')
ScrollTrigger.create({
  start: 'top -8',
  onUpdate: (self) => {
    if (self.scroll() >= 8) {
      header.classList.add('scrolled-header')
    } else {
      header.classList.remove('scrolled-header')
    }
  }
})

// --- 3. HERO ANIMATIONS ---
const tl = gsap.timeline({
  defaults: {
    ease: 'power3.out'
  }
})
tl.from('.hero-element', {
  y: 18,
  opacity: 0,
  duration: 0.8,
  stagger: 0.06,
  delay: 0.2
})
  .from('.hero-visual', {
    scale: 0.98,
    opacity: 0,
    duration: 1.2,
    ease: 'expo.out'
  }, '-=0.6')

// --- 4. SCROLL REVEALS ---
gsap.utils.toArray('.reveal-section').forEach(section => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
    },
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  })
})

// --- 5. PARALLAX EFFECTS ---
gsap.utils.toArray('.parallax-layer').forEach(layer => {
  const speed = layer.getAttribute('data-speed') || 0
  gsap.to(layer, {
    y: (i, target) => {
      return -(target.offsetHeight * speed) * 0.5
    },
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
})

// --- 6. CATALOGUE FILTER ---
const filterChips = document.querySelectorAll('.filter-chip')
const catalogItems = document.querySelectorAll('.catalog-item')

filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    // Active state
    filterChips.forEach(c => {
      c.classList.remove('active', 'bg-surface2', 'border-brandGreen2')
      c.classList.add('bg-white', 'border-gray-200')
    })
    chip.classList.add('active', 'bg-surface2', 'border-brandGreen2')
    chip.classList.remove('bg-white', 'border-gray-200')

    const category = chip.getAttribute('data-filter')

    catalogItems.forEach(item => {
      if (category === 'all' || !category || item.getAttribute('data-category') === category) {
        gsap.to(item, {
          autoAlpha: 1,
          scale: 1,
          display: 'block',
          duration: 0.3
        })
      } else {
        gsap.to(item, {
          autoAlpha: 0.2,
          scale: 0.95,
          display: 'none',
          duration: 0.3
        })
      }
    })
  })
})

// --- 7. SELECTOR & FORM LOGIC ---
window.selectType = (type) => {
  // Visual Selection
  document.querySelectorAll('.selection-card').forEach(card => card.classList.remove('ring-4', 'ring-brandLime'))
  const card = document.getElementById(type === 'solo_tela' ? 'card-solo-tela' : 'card-producto-terminado')
  if (card) card.classList.add('ring-4', 'ring-brandLime')

  // Scroll to form and set value
  lenis.scrollTo('#cotizar', {
    offset: -100
  })
  const select = document.getElementById('form-interest')
  if (select) {
    select.value = type
    select.dispatchEvent(new Event('change'))
  }
}


const interestSelect = document.getElementById('form-interest')
const fieldsTela = document.getElementById('fields-tela')
const fieldsProducto = document.getElementById('fields-producto')

if (interestSelect) {
  interestSelect.addEventListener('change', (e) => {
    const value = e.target.value
    const msgArea = document.getElementById('quote-message')

    // Reset fields visibility
    fieldsTela.classList.add('hidden')
    fieldsProducto.classList.add('hidden')

    if (value === 'solo_tela') {
      fieldsTela.classList.remove('hidden')
      if (msgArea) msgArea.placeholder = "Cuéntanos más sobre tu proyecto..."
    } else if (value === 'producto_terminado') {
      fieldsProducto.classList.remove('hidden')
      if (msgArea) msgArea.placeholder = "Cuéntanos más sobre tu proyecto..."
    } else if (value === 'muestras') {
      if (msgArea) msgArea.placeholder = "Hola, me interesa solicitar muestras de tela. Necesito que sean..."
    } else {
      if (msgArea) msgArea.placeholder = "Cuéntanos más sobre tu proyecto..."
    }
  })
}

// --- 8. CALCULATOR LOGIC ---
const calcBtn = document.getElementById('calc-btn')
if (calcBtn) {
  calcBtn.addEventListener('click', () => {
    const gramaje = parseFloat(document.getElementById('calc-gramaje').value) || 0
    const ancho = parseFloat(document.getElementById('calc-ancho').value) || 0
    const metros = parseFloat(document.getElementById('calc-metros').value) || 0

    const totalKg = (gramaje * ancho * metros) / 1000

    // Pop animation
    const resultEl = document.getElementById('calc-result')
    // Reset implementation for GSAP repeat
    gsap.fromTo(resultEl, {
      scale: 1.2
    }, {
      scale: 1,
      duration: 0.3,
      ease: 'back.out(1.7)'
    })

    // Using innerHTML to keep styling
    resultEl.innerHTML = `${totalKg.toFixed(1)} <span class="text-xl font-bold opacity-30 text-text">kg</span>`
  })
}

// --- 9. COUNTERS ---
// Simple counter implementation as ScrollTrigger might be complex with text plugins
// We will look for elements with .counter class
const counters = document.querySelectorAll('.counter')
counters.forEach(counter => {
  ScrollTrigger.create({
    trigger: counter,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      const target = +counter.getAttribute('data-target')
      const suffix = counter.getAttribute('data-suffix') || ''

      let obj = { val: 0 }
      gsap.to(obj, {
        val: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          counter.innerText = Math.floor(obj.val) + suffix
        }
      })
    }
  })
})


// --- 10. CTAs SCROLL ---
document.querySelectorAll('.trigger-scroll-cotizar').forEach(btn => {
  btn.addEventListener('click', () => {
    lenis.scrollTo('#cotizar', {
      offset: -100
    })
  })
})

// --- 11. COPY & WHATSAPP ---
// --- 11. COPY & WHATSAPP LOGIC ---
const copyBtn = document.getElementById('copy-template-btn')
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const template = document.getElementById('whatsapp-template')
    const text = template ? template.innerText : ''
    navigator.clipboard.writeText(text).then(() => {
      const originalText = copyBtn.innerHTML
      copyBtn.innerText = '¡Copiado!'
      setTimeout(() => copyBtn.innerHTML = originalText, 1500)
    })
  })
}

// WhatsApp Send Button
const whatsappBtn = document.getElementById('btn-whatsapp-send')
if (whatsappBtn) {
  whatsappBtn.addEventListener('click', () => {
    const name = document.querySelector('input[placeholder="Tu nombre"]').value
    const email = document.querySelector('input[placeholder="Tu email"]').value
    const interest = document.getElementById('form-interest').value
    const message = document.getElementById('quote-message').value

    let text = `Hola ECOAID, soy ${name}. `
    if (interest) text += `Me interesa: ${interest}. `
    text += `${message}`

    // Encode and open
    const url = `https://wa.me/525538802913?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  })
}

// --- 12. SAMPLE REQUEST BUTTON ---
const sampleBtn = document.getElementById('btn-solicitar-muestras')
if (sampleBtn) {
  sampleBtn.addEventListener('click', () => {
    // Scroll to form
    lenis.scrollTo('#cotizar', { offset: -100 })

    // Product Modal Logic
    const modal = document.getElementById('product-modal')
    const modalBackdrop = document.getElementById('modal-backdrop')
    const modalCloseBtn = document.getElementById('modal-close')
    const modalContent = document.getElementById('modal-content')
    const modalImage = document.getElementById('modal-image')
    const modalTitle = document.getElementById('modal-title')
    const modalDesc = document.getElementById('modal-description')
    const modalPrev = document.getElementById('modal-prev')
    const modalNext = document.getElementById('modal-next')
    const modalDots = document.getElementById('modal-dots')

    let currentImages = []
    let currentImageIndex = 0

    function openModal(title, description, images) {
      currentImages = images
      currentImageIndex = 0

      modalTitle.textContent = title
      modalDesc.textContent = description

      updateModalImage()

      modal.classList.remove('hidden')
      // Small delay to allow transition
      setTimeout(() => {
        modal.classList.remove('opacity-0')
        modalContent.classList.remove('scale-95')
        modalContent.classList.add('scale-100')
      }, 10)

      document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    function closeModal() {
      modal.classList.add('opacity-0')
      modalContent.classList.remove('scale-100')
      modalContent.classList.add('scale-95')

      setTimeout(() => {
        modal.classList.add('hidden')
        document.body.style.overflow = ''
      }, 300)
    }

    function updateModalImage() {
      // Fade out
      modalImage.style.opacity = '0'

      setTimeout(() => {
        modalImage.src = currentImages[currentImageIndex]
        // Fade in
        modalImage.style.opacity = '1'
      }, 200)

      // Update Buttons state
      modalPrev.disabled = currentImages.length <= 1
      modalNext.disabled = currentImages.length <= 1

      // Update Dots
      modalDots.innerHTML = currentImages.map((_, index) => `
    <button class="w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-brandGreen' : 'bg-gray-300'}" 
            onclick="goToImage(${index})"></button>
  `).join('')
    }

    function nextImage() {
      currentImageIndex = (currentImageIndex + 1) % currentImages.length
      updateModalImage()
    }

    function prevImage() {
      currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length
      updateModalImage()
    }

    // Global function for dots
    window.goToImage = (index) => {
      currentImageIndex = index
      updateModalImage()
    }

    // Event Listeners for Catalog Items
    document.querySelectorAll('.catalog-item').forEach(item => {
      item.addEventListener('click', () => {
        const title = item.getAttribute('data-title')
        const description = item.getAttribute('data-description')
        try {
          const images = JSON.parse(item.getAttribute('data-images'))
          openModal(title, description, images)
        } catch (e) {
          console.error("Error parsing product images", e)
        }
      })
    })

    // Modal Event Listeners
    if (modal) {
      modalCloseBtn.addEventListener('click', closeModal)
      modalBackdrop.addEventListener('click', closeModal)
      modalPrev.addEventListener('click', prevImage)
      modalNext.addEventListener('click', nextImage)

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return
        if (e.key === 'Escape') closeModal()
        if (e.key === 'ArrowLeft') prevImage()
        if (e.key === 'ArrowRight') prevImage() // Corrected: should be prevImage()
      })
    }
    const select = document.getElementById('form-interest')
    if (select) {
      select.value = 'muestras'
      select.dispatchEvent(new Event('change'))
    }

    // Focus message area
    setTimeout(() => {
      const msgArea = document.getElementById('quote-message')
      if (msgArea) msgArea.focus()
    }, 100)
  })
}

// --- 13. SMOOTH FAQ ACCORDION ---
const faqs = document.querySelectorAll("#faq details");

faqs.forEach((detail) => {
  const summary = detail.querySelector("summary");
  const content = detail.querySelector("div");
  const icon = detail.querySelector(".expand-icon");

  // Initial state setup
  if (!detail.hasAttribute("open")) {
    gsap.set(content, { height: 0, opacity: 0 });
  }

  summary.addEventListener("click", (e) => {
    e.preventDefault();

    const isOpen = detail.hasAttribute("open");

    // Close other open details
    faqs.forEach((otherDetail) => {
      if (otherDetail !== detail && otherDetail.hasAttribute("open")) {
        const otherContent = otherDetail.querySelector("div");
        const otherIcon = otherDetail.querySelector(".expand-icon");

        // Animate closing
        gsap.to(otherContent, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power3.inOut",
          onComplete: () => {
            otherDetail.removeAttribute("open");
          }
        });
        if (otherIcon) gsap.to(otherIcon, { rotation: 0, duration: 0.4, ease: "power3.inOut" });
      }
    });

    if (isOpen) {
      // Close this one
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power3.inOut",
        onComplete: () => {
          detail.removeAttribute("open");
        }
      });
      if (icon) gsap.to(icon, { rotation: 0, duration: 0.4, ease: "power3.inOut" });
    } else {
      // Open this one
      detail.setAttribute("open", "");
      // Animate from height 0 to auto
      gsap.fromTo(content,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power3.inOut" }
      );
      if (icon) gsap.to(icon, { rotation: 180, duration: 0.4, ease: "power3.inOut" });
    }
  });
});

