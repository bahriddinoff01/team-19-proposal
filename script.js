// ===== Theme (light / dark), remembered between visits =====
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function getSavedTheme() {
  try { return localStorage.getItem("theme"); } catch { return null; }
}
function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  try { localStorage.setItem("theme", theme); } catch { /* storage blocked */ }
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(getSavedTheme() || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// ===== Hero slideshow =====
const slides = document.querySelectorAll(".slide");
const heroPlace = document.getElementById("heroPlace");
const places = ["Japan", "Switzerland", "Italy", "Greece", "Indonesia"];
let current = 0;

setInterval(() => {
  slides[current].classList.remove("active");
  current = (current + 1) % slides.length;
  slides[current].classList.add("active");

  heroPlace.style.opacity = 0;
  setTimeout(() => {
    heroPlace.textContent = places[current];
    heroPlace.style.opacity = 1;
  }, 400);
}, 5000);

// ===== Navbar: background on scroll, mobile menu, active link =====
const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
const menuBtn = document.getElementById("menuBtn");
const toTop = document.getElementById("toTop");

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 40);
  toTop.classList.toggle("show", y > 600);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  nav.classList.add("scrolled");
});
navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Highlight the nav link for the section currently on screen
const sections = document.querySelectorAll("main section[id]");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.querySelectorAll("a").forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));

// ===== Reveal elements as they scroll into view =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 80 + "ms"; // small stagger within a row
  revealObserver.observe(el);
});

// ===== Count-up numbers in the stats =====
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      let n = 0;
      const tick = setInterval(() => {
        n++;
        el.textContent = n;
        if (n >= target) clearInterval(tick);
      }, 180);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();
