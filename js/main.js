/**
 * ============================================================================
 * VRINDAVAN ECO FARMS — INTERACTIVE APPLICATION LOGIC (js/main.js)
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initConfigBindings();
  initSmartImageFallbacks();
  initStickyHeaderAndMobileMenu();
  initScrollRevealAnimations();
  initLightboxModal();
  initWhatsAppLeadForm();
});

/**
 * 1. Bind settings from SITE_CONFIG (js/site-config.js) to the webpage
 */
function initConfigBindings() {
  if (typeof SITE_CONFIG === "undefined") return;

  // Bind image paths from SITE_CONFIG
  const configImages = document.querySelectorAll("[data-config-img]");
  configImages.forEach((imgEl) => {
    const key = imgEl.getAttribute("data-config-img");
    if (SITE_CONFIG.images && SITE_CONFIG.images[key]) {
      imgEl.src = SITE_CONFIG.images[key];
    }
  });

  // Bind Google Maps Button
  const mapBtn = document.getElementById("google-maps-btn");
  if (mapBtn && SITE_CONFIG.googleMapsUrl) {
    mapBtn.href = SITE_CONFIG.googleMapsUrl;
  }

  // Bind Phone Numbers in Footer & Mobile Bar
  const phoneListContainer = document.getElementById("footer-phone-list");
  if (phoneListContainer && Array.isArray(SITE_CONFIG.displayPhones)) {
    phoneListContainer.innerHTML = "";
    SITE_CONFIG.displayPhones.forEach((phoneStr) => {
      const cleanTel = phoneStr.replace(/[^+\d]/g, "");
      const link = document.createElement("a");
      link.href = `tel:${cleanTel}`;
      link.className = "footer-phone-link";
      link.textContent = phoneStr;
      phoneListContainer.appendChild(link);
    });
  }

  // Bind Mobile Call & WhatsApp Quick Buttons
  const mobileCallBtn = document.getElementById("mobile-call-btn");
  if (mobileCallBtn && SITE_CONFIG.displayPhones && SITE_CONFIG.displayPhones.length > 0) {
    const primaryTel = SITE_CONFIG.displayPhones[0].replace(/[^+\d]/g, "");
    mobileCallBtn.href = `tel:${primaryTel}`;
  }

  const mobileWaBtn = document.getElementById("mobile-whatsapp-btn");
  if (mobileWaBtn && SITE_CONFIG.whatsappNumber) {
    const defaultMsg = encodeURIComponent(
      "Namaste! I explored the Vrindavan Eco Farms website and would like to inquire about a farm plot and schedule a site visit."
    );
    mobileWaBtn.href = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${defaultMsg}`;
    mobileWaBtn.target = "_blank";
    mobileWaBtn.rel = "noopener noreferrer";
  }

  // Set dynamic copyright year
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * 2. Smart Local SVG Fallback Generator
 * If an image file hasn't been uploaded into `assets/images/` yet, this automatically
 * generates a clean, botanical-themed placeholder showing the exact filename to drop in.
 */
function initSmartImageFallbacks() {
  const allImages = document.querySelectorAll("img");

  allImages.forEach((img) => {
    img.addEventListener("error", function handleImageError() {
      if (this.dataset.fallbackApplied === "true") return;
      this.dataset.fallbackApplied = "true";

      const rawSrc = this.getAttribute("src") || "image.jpg";
      const fileName = rawSrc.split("/").pop();
      const altText = this.getAttribute("alt") || "Vrindavan Eco Farms Visual";

      // Generate a clean offline SVG data URI with sage-forest aesthetics
      const svgPlaceholder = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="sageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0F4C29"/>
            <stop offset="100%" stop-color="#1E6B3E"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#sageGrad)"/>
        <circle cx="400" cy="240" r="54" fill="none" stroke="#C69C53" stroke-width="2.5" opacity="0.8"/>
        <path d="M370 260 L395 220 L415 245 L430 225 L450 260 Z" fill="#C69C53" opacity="0.75"/>
        <text x="400" y="340" font-family="sans-serif" font-size="22" font-weight="bold" fill="#F3F7F0" text-anchor="middle">${altText.replace(/[<>&"']/g, "")}</text>
        <text x="400" y="380" font-family="monospace" font-size="16" fill="#C69C53" text-anchor="middle">Ready for local file: assets/images/${fileName}</text>
      </svg>`;

      this.src = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgPlaceholder);
    });
  });
}

/**
 * 3. Sticky Navigation Bar & Mobile Hamburger Drawer
 */
function initStickyHeaderAndMobileMenu() {
  const header = document.getElementById("navbar");
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileLinks = document.querySelectorAll(".mobile-link, .mobile-cta-link");

  // Sticky Header Scroll Check
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Mobile Menu Toggle
  if (menuBtn && mobileDrawer) {
    menuBtn.addEventListener("click", () => {
      const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!isExpanded));
      menuBtn.classList.toggle("active");
      mobileDrawer.classList.toggle("open");
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.classList.remove("active");
        mobileDrawer.classList.remove("open");
      });
    });
  }
}

/**
 * 4. Smooth Scroll-Triggered Reveal Animations
 */
function initScrollRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal-up");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/**
 * 5. Full-Screen Lightbox Modal for 3D Concept Renders & Route Map
 */
function initLightboxModal() {
  const lightbox = document.getElementById("image-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("lightbox-close");
  const triggers = document.querySelectorAll(".lightbox-trigger");

  if (!lightbox || !lightboxImg) return;

  const openLightbox = (triggerEl) => {
    const imgEl = triggerEl.querySelector("img");
    if (!imgEl) return;

    const captionEl = triggerEl.querySelector("figcaption");
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt;
    lightboxCaption.textContent = captionEl ? captionEl.textContent : imgEl.alt;

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openLightbox(trigger));
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(trigger);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}

/**
 * 6. Direct-to-WhatsApp Site Visit Scheduler Engine
 */
function initWhatsAppLeadForm() {
  const form = document.getElementById("site-visit-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("visitor-name").value.trim();
    const phone = document.getElementById("visitor-phone").value.trim();
    const preference = document.getElementById("visit-preference").value;

    const targetWhatsApp =
      typeof SITE_CONFIG !== "undefined" && SITE_CONFIG.whatsappNumber
        ? SITE_CONFIG.whatsappNumber
        : "919999999999";

    const messageLines = [
      "🌿 *VRINDAVAN ECO FARMS — SITE VISIT INQUIRY* 🌿",
      "",
      `*Name:* ${name}`,
      `*Phone:* ${phone}`,
      `*Request:* ${preference}`,
      "",
      "Please share location details and available slot timings."
    ];

    const encodedMessage = encodeURIComponent(messageLines.join("\n"));
    const whatsappUrl = `https://wa.me/${targetWhatsApp}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}
