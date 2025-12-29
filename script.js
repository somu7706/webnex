/**
 * ====== FIXED 24-HOUR COUNTDOWN + FIXED THEME TOGGLE ======
 * @format
 */

/* ================== COUNTDOWN (UNCHANGED LOGIC) ================== */

// 🔒 FIXED 24 HOURS (RUNS ONCE)
let fixedDiff = 24 * 60 * 60 * 1000;

const elDays = document.getElementById("days");
const elHours = document.getElementById("hours");
const elMinutes = document.getElementById("minutes");
const elSeconds = document.getElementById("seconds");

function setVal(el, val) {
  if (!el) return;
  if (el.textContent !== val) {
    const box = el.closest(".time-box");
    if (box) {
      box.classList.add("pop");
      setTimeout(() => box.classList.remove("pop"), 420);
    }
    el.textContent = val;
  }
}

function updateCountdown() {
  if (fixedDiff <= 0) {
    setVal(elDays, "00");
    setVal(elHours, "00");
    setVal(elMinutes, "00");
    setVal(elSeconds, "00");
    clearInterval(timer);
    return;
  }

  let diff = fixedDiff;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff %= 1000 * 60 * 60 * 24;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff %= 1000 * 60 * 60;

  const minutes = Math.floor(diff / (1000 * 60));
  diff %= 1000 * 60;

  const seconds = Math.floor(diff / 1000);

  setVal(elDays, String(days).padStart(2, "0"));
  setVal(elHours, String(hours).padStart(2, "0"));
  setVal(elMinutes, String(minutes).padStart(2, "0"));
  setVal(elSeconds, String(seconds).padStart(2, "0"));

  fixedDiff -= 1000;
}

const timer = setInterval(updateCountdown, 1000);
updateCountdown();

/* ================== THEME TOGGLE (FIXED) ================== */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const toggleBtn = document.getElementById("themeToggle");
  const STORAGE_KEY = "theme_pref";

  if (!toggleBtn) return;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    toggleBtn.setAttribute("aria-pressed", theme === "light");
    toggleBtn.title =
      theme === "light" ? "Switch to dark theme" : "Switch to light theme";
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }

  // ✅ INITIAL LOAD
  const saved = getSavedTheme();
  const systemDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  applyTheme(saved || (systemDark ? "dark" : "light"));

  // ✅ CLICK TOGGLE
  toggleBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    saveTheme(next);

    toggleBtn.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.08)" },
        { transform: "scale(1)" },
      ],
      { duration: 200, easing: "ease-out" }
    );
  });

  // ✅ KEYBOARD SUPPORT
  toggleBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleBtn.click();
    }
  });

  // ✅ SYSTEM THEME SYNC (ONLY IF USER DIDN’T SAVE)
  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", (e) => {
      if (!getSavedTheme()) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
  }
});

/* ================== BACK TO TOP (SAFE) ================== */

const backTop = document.getElementById("backTop");
if (backTop) {
  window.addEventListener("scroll", () => {
    backTop.classList.toggle("show", window.scrollY > 300);
  });

  backTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}
