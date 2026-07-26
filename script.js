"use strict";

const header = document.querySelector("#site-header");
const menuToggle = document.querySelector("#menu-toggle");
const navMenu = document.querySelector("#nav-menu");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];
const backToTop = document.querySelector("#back-to-top");
const revealItems = document.querySelectorAll(".reveal");
const workoutTabs = [...document.querySelectorAll(".workout-tab")];
const billingButtons = [...document.querySelectorAll("[data-billing]")];
const faqItems = [...document.querySelectorAll(".faq-item")];
const modal = document.querySelector("#demo-modal");
const openDemo = document.querySelector("#open-demo");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const workouts = {
  strength: {
    badge: "POWER SERIES",
    poster: "BUILD<br />STRENGTH",
    kicker: "STRENGTH TRAINING",
    name: "Full Body Power",
    description:
      "Build total-body strength through smart compound movements, guided form cues, and progressive weekly targets.",
    duration: "30–45 min",
    level: "All levels",
    equipment: "Optional",
    color: "#ff765f",
  },
  cardio: {
    badge: "ENERGY SERIES",
    poster: "MOVE<br />FASTER",
    kicker: "CARDIO TRAINING",
    name: "Heart Rate HIIT",
    description:
      "Improve stamina with efficient intervals that adjust to your pace, recovery, and target heart-rate zone.",
    duration: "18–32 min",
    level: "3 intensities",
    equipment: "None",
    color: "#d9ff43",
  },
  mobility: {
    badge: "RESTORE SERIES",
    poster: "MOVE<br />FREELY",
    kicker: "MOBILITY TRAINING",
    name: "Full Body Reset",
    description:
      "Release stiffness, improve range of motion, and support recovery through controlled, guided movement.",
    duration: "12–25 min",
    level: "All levels",
    equipment: "Mat only",
    color: "#8a6cff",
  },
};

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 34);
  backToTop.classList.toggle("visible", window.scrollY > 700);
}

function setMenu(open) {
  menuToggle.classList.toggle("open", open);
  navMenu.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation menu" : "Open navigation menu"
  );
}

menuToggle.addEventListener("click", () => {
  setMenu(!navMenu.classList.contains("open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
    closeModal();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) setMenu(false);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  },
  { rootMargin: "-38% 0px -53% 0px", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

if (reduceMotion.matches) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${(index % 3) * 75}ms`;
    revealObserver.observe(item);
  });
}

workoutTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const type = tab.dataset.workout;
    const workout = workouts[type];

    workoutTabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
    });

    document.querySelector("#poster-badge").textContent = workout.badge;
    document.querySelector("#poster-title").innerHTML = workout.poster;
    document.querySelector("#workout-kicker").textContent = workout.kicker;
    document.querySelector("#workout-name").textContent = workout.name;
    document.querySelector("#workout-description").textContent =
      workout.description;
    document.querySelector("#workout-duration").textContent = workout.duration;
    document.querySelector("#workout-level").textContent = workout.level;
    document.querySelector("#workout-equipment").textContent =
      workout.equipment;
    document.querySelector(".workout-poster").style.background = workout.color;
  });
});

billingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const billing = button.dataset.billing;

    billingButtons.forEach((item) =>
      item.classList.toggle("active", item === button)
    );

    document.querySelectorAll("[data-monthly][data-yearly]").forEach((price) => {
      const nextPrice = price.dataset[billing];
      price.textContent = nextPrice;
    });

    document.querySelectorAll(".price-period").forEach((period) => {
      period.textContent =
        billing === "yearly" ? "/ month, billed yearly" : "/ month";
    });
  });
});

faqItems.forEach((item) => {
  const button = item.querySelector("button");

  button.addEventListener("click", () => {
    const shouldOpen = !item.classList.contains("open");

    faqItems.forEach((faq) => {
      faq.classList.remove("open");
      faq.querySelector("button").setAttribute("aria-expanded", "false");
    });

    if (shouldOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

function openModal() {
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  openDemo.focus();
}

openDemo.addEventListener("click", openModal);

modal.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeModal);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

document.querySelector("#current-year").textContent = new Date().getFullYear();
