const body = document.body;
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const revealEls = document.querySelectorAll(".reveal");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");
const themeToggle = document.getElementById("themeToggle");
const themeToggleLabel = document.getElementById("themeToggleLabel");
const themeToggleIcon = document.getElementById("themeToggleIcon");
const heroVisual = document.getElementById("heroVisual");
const parallaxEls = document.querySelectorAll(".parallax");
const counterEls = document.querySelectorAll("[data-counter]");
const projectModal = document.getElementById("projectModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");
const terminalBody = document.getElementById("terminalBody");
const contactForm = document.getElementById("contactForm");
const terminalActions = document.getElementById("terminalActions");
const projectFilters = document.getElementById("projectFilters");
const projectCards = document.querySelectorAll(".project-card");
const skillCards = document.querySelectorAll(".skill-card");
const skillDetail = document.getElementById("skillDetail");
const scrollProgressBar = document.getElementById("scrollProgressBar");
const localTime = document.getElementById("localTime");
const spotlightTitle = document.getElementById("spotlightTitle");
const spotlightText = document.getElementById("spotlightText");
const spotlightLink = document.getElementById("spotlightLink");
const spotlightBar = document.getElementById("spotlightBar");
const spotlightPrev = document.getElementById("spotlightPrev");
const spotlightNext = document.getElementById("spotlightNext");
const quickJump = document.getElementById("quickJump");
const sections = document.querySelectorAll("main .section");
const hoverPreview = document.getElementById("projectHoverPreview");
const hoverPreviewTitle = document.getElementById("hoverPreviewTitle");
const hoverPreviewText = document.getElementById("hoverPreviewText");
const terminalGame = document.getElementById("terminalGame");
const runnerCanvas = document.getElementById("runnerCanvas");
const runnerCtx = runnerCanvas ? runnerCanvas.getContext("2d") : null;
const gameStartBtn = document.getElementById("gameStartBtn");
const gameResetBtn = document.getElementById("gameResetBtn");
const gameStatus = document.getElementById("gameStatus");
const journeyNodes = document.querySelectorAll(".journey-node");
const journeyTitle = document.getElementById("journeyTitle");
const journeyProblem = document.getElementById("journeyProblem");
const journeyBuild = document.getElementById("journeyBuild");
const journeyTech = document.getElementById("journeyTech");
const journeyLearning = document.getElementById("journeyLearning");
const journeyNext = document.getElementById("journeyNext");
const compareRange = document.getElementById("compareRange");
const compareSliderArea = document.getElementById("compareSliderArea");
const compareBeforeLayer = document.querySelector(".compare-before");
const compareAfterLayer = document.getElementById("compareAfterLayer");
const focusBar = document.getElementById("focusBar");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
const sectionIds = ["home", "about", "skills", "projects", "journey", "experience", "contact"];
const sectionElements = sectionIds
  .map((id) => {
    const section = document.getElementById(id);
    return section ? { id, section } : null;
  })
  .filter(Boolean);

let sectionBounds = [];
let activeSectionId = "home";
let scrollTicking = false;
let pointerTicking = false;
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
let mouse = { x: pointerX, y: pointerY };
let activeTheme = "light";
let refreshThemeBlend = null;

const themeStorageKey = "portfolio-theme";
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const themeIcons = {
  moon: `<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3c-.05.33-.08.66-.08 1a8 8 0 0 0 8 8c.34 0 .67-.03 1-.08z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.2v2.2M12 19.6v2.2M2.2 12h2.2M19.6 12h2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M19.3 4.7l-1.6 1.6M6.3 17.7l-1.6 1.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
};

const fallbackThemePalette = {
  light: {
    bgMain: "#f4f1ec",
    bgSecondary: "#f7f5f2",
    accent: "#8f9d8a",
    card: "rgba(255, 255, 255, 0.5)"
  },
  dark: {
    bgMain: "#141a1a",
    bgSecondary: "#1a2221",
    accent: "#8cb09f",
    card: "rgba(22, 29, 29, 0.6)"
  }
};

function setThemeUiState(theme) {
  if (!themeToggle || !themeToggleLabel || !themeToggleIcon) {
    return;
  }

  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggleLabel.textContent = isDark ? "Light" : "Dark";
  themeToggleIcon.innerHTML = isDark ? themeIcons.sun : themeIcons.moon;
}

function applyTheme(theme, { persist = true } = {}) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  activeTheme = nextTheme;
  body.setAttribute("data-theme", nextTheme);
  setThemeUiState(nextTheme);

  if (persist) {
    localStorage.setItem(themeStorageKey, nextTheme);
  }

  if (typeof refreshThemeBlend === "function") {
    refreshThemeBlend();
    return;
  }

  const fallback = fallbackThemePalette[nextTheme];
  const root = document.documentElement;
  root.style.setProperty("--bg-main", fallback.bgMain);
  root.style.setProperty("--bg-secondary", fallback.bgSecondary);
  root.style.setProperty("--accent", fallback.accent);
  root.style.setProperty("--card", fallback.card);
}

const savedTheme = localStorage.getItem(themeStorageKey);
const initialTheme = savedTheme || (systemPrefersDark.matches ? "dark" : "light");
applyTheme(initialTheme, { persist: Boolean(savedTheme) });

if (!savedTheme) {
  systemPrefersDark.addEventListener("change", (e) => {
    applyTheme(e.matches ? "dark" : "light", { persist: false });
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    applyTheme(activeTheme === "dark" ? "light" : "dark");
  });
}

const projectDetails = {
  assam: {
    title: "Explore Assam Tourism and Heritage",
    text: "Tourism-focused web experience with smooth navigation improvements and user-friendly browsing flows.",
    stack: ["JavaScript", "UI/UX", "Web"]
  },
  transit: {
    title: "Transit-Live",
    text: "Realtime public transit monitoring with map APIs, route visibility, and live arrival information.",
    stack: ["JavaScript", "Maps", "Realtime Data"]
  },
  lakshya: {
    title: "Lakshya Learning Platform",
    text: "Goal-oriented learning platform to manage study resources and monitor progress effectively.",
    stack: ["JavaScript", "EdTech", "Productivity"]
  }
};

const terminalResponses = {
  skills: [
    "$ skills",
    "- Frontend: HTML, CSS, JavaScript",
    "- Backend & Logic: APIs, Python, C++",
    "- Platform: Firebase, MongoDB"
  ],
  projects: [
    "$ projects --mine",
    "- explore-Assam-tourism-and-heritage",
    "- Transit-Live"
  ],
  contact: [
    "$ contact",
    "github: github.com/Ananddutta",
    "email: anand.dev@example.com"
  ]
};

const spotlightItems = [
  {
    title: "Explore Assam Tourism and Heritage",
    text: "Tourism-focused web experience with smooth navigation improvements and user-friendly browsing flows.",
    url: "https://github.com/Ananddutta/explore-Assam-tourism-and-heritage"
  },
  {
    title: "Transit-Live",
    text: "Realtime public transit monitoring with map APIs, route visibility, and live arrival information.",
    url: "https://github.com/Ananddutta/Transit-Live"
  }
];

let spotlightIndex = 0;
let spotlightTimer = null;
let spotlightProgressTimer = null;

const runnerState = {
  active: false,
  running: false,
  score: 0,
  best: 0,
  frame: 0,
  speed: 2.4,
  player: { x: 52, y: 0, vy: 0, w: 20, h: 20, onGround: true },
  obstacles: [],
  particles: []
};

const journeyData = [
  {
    title: "Started B.Tech CSE",
    problem: "Needed a structured way to improve software foundations while building practical projects.",
    build: "Set up a consistent coding routine and created mini frontend projects weekly.",
    tech: "HTML, CSS, JavaScript, C++",
    learning: "Strong basics and consistency are the base for better product building.",
    next: "Improve architecture planning before implementation to reduce rework."
  },
  {
    title: "Assam Tourism Build",
    problem: "Navigation flow on redirected pages made user movement less intuitive.",
    build: "Improved navigation behavior and UX continuity, including better back-flow handling.",
    tech: "JavaScript, DOM APIs, UX Patterns",
    learning: "Small UX fixes can significantly improve user trust and session depth.",
    next: "Add analytics to measure navigation drop-offs and optimize funnel paths."
  },
  {
    title: "Transit-Live Build",
    problem: "Users needed clearer live transit visibility with map-based context.",
    build: "Integrated live movement context and map-oriented information display.",
    tech: "JavaScript, Maps, Realtime Data",
    learning: "Realtime interfaces must prioritize clarity and update stability over visual noise.",
    next: "Add route-level filtering and congestion overlays for faster decision-making."
  },
  {
    title: "Lakshya Platform Build",
    problem: "Students lacked a focused way to track progress and manage study resources.",
    build: "Built a goal-oriented learning workflow with progress-centric UI components.",
    tech: "JavaScript, Product Design, Frontend Logic",
    learning: "Educational tools need motivation loops and simple daily interactions.",
    next: "Add personalized reminders and smarter progress recommendations."
  }
];

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    nav.classList.remove("open");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("visible");
      if (entry.target.hasAttribute("data-counter")) {
        animateCounter(entry.target);
      }
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => observer.observe(el));
counterEls.forEach((el) => observer.observe(el));

function animateCounter(el) {
  const rawTarget = (el.getAttribute("data-counter") || "0").trim();
  const hasPlus = rawTarget.endsWith("+");
  const numericTarget = Number(rawTarget.replace("+", ""));
  const target = Number.isFinite(numericTarget) ? numericTarget : 0;
  const startTime = performance.now();
  const duration = 1200;

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = String(Math.round(target * eased));
    el.textContent = progress < 1 ? current : `${current}${hasPlus ? "+" : ""}`;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function updateSectionBounds() {
  sectionBounds = sectionElements.map(({ id, section }) => ({
    id,
    top: section.offsetTop - 140,
    bottom: section.offsetTop + section.offsetHeight - 140
  }));
}

function updateSectionFocus(nextSectionId) {
  navLinks.forEach((l) => {
    l.classList.toggle("active", l.getAttribute("href") === `#${nextSectionId}`);
  });

  sections.forEach((section) => {
    section.classList.toggle("in-focus", section.id === nextSectionId);
  });
}

function handleScroll() {
  scrollTicking = false;

  const current = window.scrollY;
  if (navbar) {
    navbar.style.boxShadow = current > 12 ? "0 10px 40px rgba(43,43,43,0.08)" : "none";
  }

  let currentSectionId = "home";
  sectionBounds.forEach((bounds) => {
    if (current >= bounds.top && current < bounds.bottom) {
      currentSectionId = bounds.id;
    }
  });

  if (currentSectionId !== activeSectionId) {
    activeSectionId = currentSectionId;
    updateSectionFocus(currentSectionId);
  }

  if (scrollProgressBar) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (current / docHeight) * 100 : 0;
    scrollProgressBar.style.width = `${progress}%`;
  }
}

function requestScrollUpdate() {
  if (scrollTicking) {
    return;
  }

  scrollTicking = true;
  requestAnimationFrame(handleScroll);
}

function handlePointerEffects() {
  pointerTicking = false;
  mouse.x = pointerX;
  mouse.y = pointerY;

  const x = (pointerX / window.innerWidth - 0.5) * 2;
  const y = (pointerY / window.innerHeight - 0.5) * 2;

  if (!prefersReducedMotion && !isCoarsePointer) {
    parallaxEls.forEach((el) => {
      const depth = Number(el.getAttribute("data-depth") || 10);
      const tx = -x * depth;
      const ty = -y * depth;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });

    // Shift background blobs lightly with pointer movement for subtle depth.
    body.style.setProperty("--cursor-x", `${x}`);
    body.style.setProperty("--cursor-y", `${y}`);
  }
}

window.addEventListener(
  "scroll",
  () => {
    requestScrollUpdate();
  },
  { passive: true }
);

window.addEventListener(
  "mousemove",
  (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;
    if (!pointerTicking) {
      pointerTicking = true;
      requestAnimationFrame(handlePointerEffects);
    }
  },
  { passive: true }
);

window.addEventListener(
  "resize",
  () => {
    updateSectionBounds();
    requestScrollUpdate();
  },
  { passive: true }
);

updateSectionBounds();
requestScrollUpdate();

function updateLocalTime() {
  if (!localTime) {
    return;
  }

  const now = new Date();
  localTime.textContent = `Local time: ${now.toLocaleTimeString()}`;
}

updateLocalTime();
setInterval(updateLocalTime, 1000);

function renderSpotlight() {
  if (!spotlightTitle || !spotlightText || !spotlightLink) {
    return;
  }

  const item = spotlightItems[spotlightIndex];
  spotlightTitle.textContent = item.title;
  spotlightText.textContent = item.text;
  spotlightLink.href = item.url;
}

function startSpotlightProgress() {
  if (!spotlightBar) {
    return;
  }

  let progress = 0;
  spotlightBar.style.width = "0%";
  clearInterval(spotlightProgressTimer);
  spotlightProgressTimer = setInterval(() => {
    progress += 2;
    spotlightBar.style.width = `${Math.min(progress, 100)}%`;
    if (progress >= 100) {
      clearInterval(spotlightProgressTimer);
    }
  }, 80);
}

function moveSpotlight(step = 1) {
  spotlightIndex = (spotlightIndex + step + spotlightItems.length) % spotlightItems.length;
  renderSpotlight();
  startSpotlightProgress();
}

function startSpotlightAuto() {
  clearInterval(spotlightTimer);
  spotlightTimer = setInterval(() => moveSpotlight(1), 4200);
}

if (spotlightPrev && spotlightNext) {
  spotlightPrev.addEventListener("click", () => {
    moveSpotlight(-1);
    startSpotlightAuto();
  });

  spotlightNext.addEventListener("click", () => {
    moveSpotlight(1);
    startSpotlightAuto();
  });

  renderSpotlight();
  startSpotlightProgress();
  startSpotlightAuto();
}

function openQuickJump() {
  if (!quickJump) {
    return;
  }
  quickJump.hidden = false;
}

function closeQuickJump() {
  if (!quickJump) {
    return;
  }
  quickJump.hidden = true;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")) {
    e.preventDefault();
    if (quickJump?.hidden) {
      openQuickJump();
    } else {
      closeQuickJump();
    }
  }

  if (e.key === "Escape") {
    closeQuickJump();
  }
});

if (quickJump) {
  quickJump.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeQuickJump());
  });
}

function renderJourney(step) {
  const item = journeyData[step];
  if (!item || !journeyTitle) {
    return;
  }

  journeyTitle.textContent = item.title;
  journeyProblem.innerHTML = `<strong>Problem:</strong> ${item.problem}`;
  journeyBuild.innerHTML = `<strong>What I Built:</strong> ${item.build}`;
  journeyTech.innerHTML = `<strong>Tech Used:</strong> ${item.tech}`;
  journeyLearning.innerHTML = `<strong>Key Learning:</strong> ${item.learning}`;
  journeyNext.innerHTML = `<strong>What I'd Improve Next:</strong> ${item.next}`;
}

if (journeyNodes.length) {
  journeyNodes.forEach((node) => {
    node.addEventListener("click", () => {
      const step = Number(node.getAttribute("data-step"));
      journeyNodes.forEach((n) => {
        n.classList.remove("active");
        n.setAttribute("aria-selected", "false");
      });
      node.classList.add("active");
      node.setAttribute("aria-selected", "true");
      renderJourney(step);
    });
  });
}

if (compareRange && compareAfterLayer && compareSliderArea) {
  const themePalette = {
    light: {
      before: {
        bgMain: [247, 238, 227],
        bgSecondary: [244, 231, 216],
        accent: [176, 154, 124],
        card: [255, 248, 240]
      },
      after: {
        bgMain: [240, 244, 236],
        bgSecondary: [247, 250, 244],
        accent: [143, 157, 138],
        card: [246, 252, 246]
      }
    },
    dark: {
      before: {
        bgMain: [10, 15, 15],
        bgSecondary: [14, 21, 21],
        accent: [102, 126, 114],
        card: [22, 29, 29]
      },
      after: {
        bgMain: [20, 27, 27],
        bgSecondary: [27, 35, 35],
        accent: [140, 176, 159],
        card: [31, 41, 41]
      }
    }
  };

  const root = document.documentElement;

  const blend = (a, b, t) => Math.round(a + (b - a) * t);

  const blendColor = (c1, c2, t) => [
    blend(c1[0], c2[0], t),
    blend(c1[1], c2[1], t),
    blend(c1[2], c2[2], t)
  ];

  const applyGlobalTheme = (value) => {
    const palette = themePalette[activeTheme] || themePalette.light;
    const t = value / 100;
    const bgMain = blendColor(palette.before.bgMain, palette.after.bgMain, t);
    const bgSecondary = blendColor(palette.before.bgSecondary, palette.after.bgSecondary, t);
    const accent = blendColor(palette.before.accent, palette.after.accent, t);
    const card = blendColor(palette.before.card, palette.after.card, t);

    root.style.setProperty("--bg-main", `rgb(${bgMain[0]} ${bgMain[1]} ${bgMain[2]})`);
    root.style.setProperty("--bg-secondary", `rgb(${bgSecondary[0]} ${bgSecondary[1]} ${bgSecondary[2]})`);
    root.style.setProperty("--accent", `rgb(${accent[0]} ${accent[1]} ${accent[2]})`);
    root.style.setProperty("--card", `rgba(${card[0]}, ${card[1]}, ${card[2]}, ${activeTheme === "dark" ? "0.62" : "0.56"})`);
  };

  const updateCompare = () => {
    const value = Number(compareRange.value);
    const beforeOpacity = 0.35 + ((100 - value) / 100) * 0.65;
    const afterOpacity = 0.35 + (value / 100) * 0.65;
    const leftTint = 0.07 + ((100 - value) / 100) * 0.28;
    const rightTint = 0.07 + (value / 100) * 0.28;

    compareSliderArea.style.setProperty("--split", `${value}%`);
    compareSliderArea.style.setProperty("--before-opacity", beforeOpacity.toFixed(2));
    compareSliderArea.style.setProperty("--after-opacity", afterOpacity.toFixed(2));
    compareSliderArea.style.setProperty("--left-tint", leftTint.toFixed(2));
    compareSliderArea.style.setProperty("--right-tint", rightTint.toFixed(2));

    if (compareBeforeLayer) {
      compareBeforeLayer.style.opacity = beforeOpacity.toFixed(2);
    }
    compareAfterLayer.style.opacity = afterOpacity.toFixed(2);

    applyGlobalTheme(value);
  };

  compareRange.addEventListener("input", updateCompare);
  refreshThemeBlend = updateCompare;
  updateCompare();
}

if (focusBar) {
  const focusObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        focusBar.style.width = "84%";
        focusObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  focusObserver.observe(focusBar);
}

// Add tactile-feeling click ripples for interactive elements.
document.addEventListener("pointerdown", (e) => {
  const target = e.target;
  if (!(target instanceof Element)) {
    return;
  }

  const interactive = target.closest("a, button, .skill-card, .project-card, .terminal-btn, .filter-btn");
  if (!interactive) {
    return;
  }

  const ripple = document.createElement("span");
  ripple.className = "click-ripple";
  ripple.style.left = `${e.clientX}px`;
  ripple.style.top = `${e.clientY}px`;
  document.body.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
});

if (projectFilters) {
  projectFilters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) {
      return;
    }

    const filter = btn.getAttribute("data-filter");
    projectFilters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    projectCards.forEach((card) => {
      const types = card.getAttribute("data-type") || "";
      const show = filter === "all" || types.includes(filter);
      card.classList.toggle("is-hidden", !show);
    });
  });
}

if (skillDetail) {
  skillCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const skill = card.getAttribute("data-skill") || "Skill";
      const detail = card.getAttribute("data-detail") || "";
      skillDetail.textContent = `${skill}: ${detail}`;
    });
  });
}

// Project modal and card tilt interactions.
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 14;
    const rotateX = -(y - 0.5) * 14;
    if (!prefersReducedMotion && !isCoarsePointer) {
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    }

    if (hoverPreview && !isCoarsePointer) {
      const offset = 18;
      hoverPreview.style.left = `${e.clientX + offset}px`;
      hoverPreview.style.top = `${e.clientY + offset}px`;
    }
  }, { passive: true });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";

    if (hoverPreview) {
      hoverPreview.classList.remove("show");
    }
  });

  card.addEventListener("mouseenter", () => {
    if (!hoverPreview || !hoverPreviewTitle || !hoverPreviewText) {
      return;
    }

    const key = card.getAttribute("data-project");
    const info = projectDetails[key];
    hoverPreviewTitle.textContent = info?.title || "Project";
    hoverPreviewText.textContent = info?.text || "Interactive project preview.";
    hoverPreview.classList.add("show");
  });

  card.addEventListener("click", () => {
    const key = card.getAttribute("data-project");
    const info = projectDetails[key];
    if (!info) {
      return;
    }
    modalContent.innerHTML = `
      <h3>${info.title}</h3>
      <p>${info.text}</p>
      <p><strong>Stack:</strong> ${info.stack.join(", ")}</p>
    `;
    projectModal.showModal();
  });
});

closeModal.addEventListener("click", () => projectModal.close());
projectModal.addEventListener("click", (e) => {
  const rect = projectModal.getBoundingClientRect();
  const isInDialog =
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom;
  if (!isInDialog) {
    projectModal.close();
  }
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector("button");
  const original = btn.textContent;
  btn.textContent = "Sending...";
  btn.disabled = true;

  const formData = new FormData(contactForm);

  fetch("https://formsubmit.co/ajax/mail2anand2024@gmail.com", {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json"
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Form endpoint failed");
      }
      return response.json();
    })
    .then(() => {
      btn.textContent = "Message Sent";
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 1300);
    })
    .catch(() => {
      // Fallback to native form POST if AJAX is blocked by browser/network policy.
      btn.textContent = "Redirecting...";
      contactForm.submit();
    });
});

function animateTerminal() {
  const lines = [
    "$ whoami",
    "anand dutta - frontend developer | 2nd year b.tech cse",
    "$ stack --top",
    "html css javascript python c++",
    "$ build --experience",
    "Compiling premium interaction layer... done"
  ];

  let lineIndex = 0;
  let charIndex = 0;
  terminalBody.textContent = "";

  function type() {
    if (lineIndex >= lines.length) {
      setTimeout(animateTerminal, 2300);
      return;
    }

    const line = lines[lineIndex];
    terminalBody.textContent += line[charIndex] || "";
    charIndex += 1;

    if (charIndex > line.length) {
      terminalBody.textContent += "\n";
      lineIndex += 1;
      charIndex = 0;
      setTimeout(type, 280);
      return;
    }

    setTimeout(type, 32);
  }

  type();
}

animateTerminal();

if (terminalActions) {
  terminalActions.addEventListener("click", (e) => {
    const btn = e.target.closest(".terminal-btn");
    if (!btn) {
      return;
    }

    const cmd = btn.getAttribute("data-cmd");

    if (cmd === "game") {
      if (terminalGame) {
        terminalGame.hidden = false;
      }
      if (gameStatus) {
        gameStatus.textContent = "Fluffy Runner ready. Press Start or Space to run.";
      }
      if (!runnerState.running) {
        drawRunnerGame();
      }
      return;
    }

    const lines = terminalResponses[cmd];
    if (!lines) {
      return;
    }

    terminalBody.textContent += "\n\n";
    lines.forEach((line, i) => {
      setTimeout(() => {
        terminalBody.textContent += `${line}\n`;
      }, i * 120);
    });
  });
}

function getGroundY() {
  return runnerCanvas ? runnerCanvas.height - 24 : 116;
}

function resetRunnerState() {
  runnerState.active = false;
  runnerState.running = false;
  runnerState.score = 0;
  runnerState.frame = 0;
  runnerState.speed = 3.2;
  runnerState.player = { x: 52, y: getGroundY() - 20, vy: 0, w: 20, h: 20, onGround: true };
  runnerState.obstacles = [];
  runnerState.particles = [];
  if (gameStatus) {
    gameStatus.textContent = "Fluffy Runner reset. Press Start to play.";
  }
  drawRunnerGame();
}

function spawnObstacle() {
  if (!runnerCanvas) {
    return;
  }
  const isTall = Math.random() > 0.58;
  const w = isTall ? 16 : 13;
  const h = isTall ? 34 : 24;
  runnerState.obstacles.push({
    x: runnerCanvas.width + 8,
    y: getGroundY() - h,
    w,
    h,
    passed: false
  });
}

function runnerCollide(obstacle) {
  const p = runnerState.player;
  return !(p.x + p.w < obstacle.x || p.x > obstacle.x + obstacle.w || p.y + p.h < obstacle.y || p.y > obstacle.y + obstacle.h);
}

function drawRunnerGame() {
  if (!runnerCtx || !runnerCanvas) {
    return;
  }

  const { width, height } = runnerCanvas;
  const groundY = getGroundY();

  runnerCtx.clearRect(0, 0, width, height);
  runnerCtx.fillStyle = "#efe9dd";
  runnerCtx.fillRect(0, 0, width, height);

  runnerCtx.fillStyle = "rgba(143, 157, 138, 0.15)";
  runnerCtx.beginPath();
  runnerCtx.arc(58, 28, 15, 0, Math.PI * 2);
  runnerCtx.arc(76, 28, 12, 0, Math.PI * 2);
  runnerCtx.fill();

  runnerCtx.beginPath();
  runnerCtx.arc(290, 24, 14, 0, Math.PI * 2);
  runnerCtx.arc(308, 24, 11, 0, Math.PI * 2);
  runnerCtx.fill();

  runnerCtx.strokeStyle = "rgba(43,43,43,0.24)";
  runnerCtx.setLineDash([8, 6]);
  runnerCtx.beginPath();
  runnerCtx.moveTo(0, groundY + 0.5);
  runnerCtx.lineTo(width, groundY + 0.5);
  runnerCtx.stroke();
  runnerCtx.setLineDash([]);

  runnerState.obstacles.forEach((ob) => {
    runnerCtx.fillStyle = "#8f9d8a";
    runnerCtx.fillRect(ob.x, ob.y, ob.w, ob.h);
    runnerCtx.fillStyle = "rgba(255,255,255,0.35)";
    runnerCtx.fillRect(ob.x + 3, ob.y + 3, 3, 3);
  });

  const p = runnerState.player;
  runnerCtx.fillStyle = "#ffffff";
  runnerCtx.beginPath();
  runnerCtx.roundRect(p.x, p.y, p.w, p.h, 7);
  runnerCtx.fill();

  runnerCtx.fillStyle = "#f5d7a5";
  runnerCtx.fillRect(p.x + 2, p.y + 8, p.w - 4, 8);
  runnerCtx.fillStyle = "#2b2b2b";
  runnerCtx.fillRect(p.x + 12, p.y + 6, 2, 2);

  runnerCtx.fillStyle = "#2b2b2b";
  runnerCtx.font = "700 12px Inter";
  runnerCtx.fillText(`Score: ${Math.floor(runnerState.score)}`, 10, 16);
  runnerCtx.fillText(`Best: ${runnerState.best}`, 10, 31);
}

function endRunnerGame() {
  runnerState.active = false;
  runnerState.running = false;
  runnerState.best = Math.max(runnerState.best, Math.floor(runnerState.score));
  if (gameStatus) {
    gameStatus.textContent = `Game over. Score ${Math.floor(runnerState.score)}. Best ${runnerState.best}. Press Start.`;
  }
  drawRunnerGame();
}

function jumpRunner() {
  if (!terminalGame || terminalGame.hidden) {
    return;
  }

  if (!runnerState.active) {
    startRunnerGame();
    return;
  }

  if (runnerState.player.onGround) {
    runnerState.player.vy = -6.2;
    runnerState.player.onGround = false;
  }
}

function updateRunnerGame() {
  if (!runnerState.active || !runnerCanvas) {
    return;
  }

  const groundY = getGroundY();
  runnerState.frame += 1;
  runnerState.score += 0.08;
  runnerState.speed = Math.min(5.8, 3.2 + runnerState.score * 0.016);

  if (runnerState.frame % Math.max(52, 90 - Math.floor(runnerState.score * 0.8)) === 0) {
    spawnObstacle();
  }

  const p = runnerState.player;
  p.vy += 0.34;
  p.y += p.vy;

  if (p.y + p.h >= groundY) {
    p.y = groundY - p.h;
    p.vy = 0;
    p.onGround = true;
  }

  runnerState.obstacles.forEach((ob) => {
    ob.x -= runnerState.speed;
  });
  runnerState.obstacles = runnerState.obstacles.filter((ob) => ob.x + ob.w > -12);

  const hit = runnerState.obstacles.some((ob) => runnerCollide(ob));
  drawRunnerGame();

  if (hit) {
    endRunnerGame();
    return;
  }

  requestAnimationFrame(updateRunnerGame);
}

function startRunnerGame() {
  resetRunnerState();
  runnerState.active = true;
  runnerState.running = true;
  if (gameStatus) {
    gameStatus.textContent = "Running. Press Space or tap to jump.";
  }
  requestAnimationFrame(updateRunnerGame);
}

if (gameStartBtn) {
  gameStartBtn.addEventListener("click", startRunnerGame);
}

if (gameResetBtn) {
  gameResetBtn.addEventListener("click", resetRunnerState);
}

if (runnerCanvas) {
  runnerCanvas.addEventListener("pointerdown", jumpRunner);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    const activeTag = document.activeElement?.tagName || "";
    if (["INPUT", "TEXTAREA"].includes(activeTag)) {
      return;
    }
    e.preventDefault();
    jumpRunner();
  }
});

resetRunnerState();

// Lightweight particle background.
const canvas = document.getElementById("particles");
let particles = [];
let particleFrame = null;

if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    if (prefersReducedMotion) {
      particles = [];
      return;
    }

    const cap = isCoarsePointer ? 20 : 40;
    const count = Math.min(cap, Math.floor(window.innerWidth / (isCoarsePointer ? 46 : 34)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.25
    }));
  }

  function renderParticles() {
    if (!ctx || document.hidden || prefersReducedMotion) {
      particleFrame = null;
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 160) {
        p.vx -= dx * 0.000006;
        p.vy -= dy * 0.000006;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.992;
      p.vy *= 0.992;

      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      ctx.beginPath();
      ctx.fillStyle = "rgba(143, 157, 138, 0.24)";
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    particleFrame = requestAnimationFrame(renderParticles);
  }

  function startParticles() {
    if (particleFrame || prefersReducedMotion) {
      return;
    }
    particleFrame = requestAnimationFrame(renderParticles);
  }

  function stopParticles() {
    if (!particleFrame) {
      return;
    }
    cancelAnimationFrame(particleFrame);
    particleFrame = null;
  }

  window.addEventListener(
    "resize",
    () => {
      resizeCanvas();
      createParticles();
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopParticles();
      return;
    }
    startParticles();
  });

  resizeCanvas();
  createParticles();
  startParticles();
}

// Initial reveal for in-view elements on first paint.
requestAnimationFrame(() => {
  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.classList.add("visible");
    }
  });
});
