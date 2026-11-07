/*
 * Mabel's Chair (showcase site)
 * Copyright (c) 2026 Miloš Milinkov. All rights reserved.
 * Proprietary and confidential. Use, copying, modification or distribution
 * without written permission is prohibited. See the LICENSE file.
 */

// ---------- Opening hours ----------
// The hours table in index.html is the single source of opening hours.
// A row without data-open is a closed day.
const HOUR_ROWS = [...document.querySelectorAll(".hours tr[data-days]")].map((row) => ({
  row,
  days: row.dataset.days.split(",").map(Number),
  hours: row.dataset.open ? [Number(row.dataset.open), Number(row.dataset.close)] : null,
}));
const HOURS = {}; // weekday (0 = Sunday) -> [open, close] in salon time, or null when closed
for (const { days, hours } of HOUR_ROWS) for (const day of days) HOURS[day] = hours;
const TIME_ZONE = "Europe/Belgrade";
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const pad = (h) => `${String(h).padStart(2, "0")}:00`;

function salonNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE, weekday: "long", hour: "numeric", minute: "numeric", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  return { day: WEEKDAYS.indexOf(get("weekday")), hour: Number(get("hour")) + Number(get("minute")) / 60 };
}

function nextOpening(day) {
  for (let ahead = 1; ahead <= 7; ahead++) {
    const d = (day + ahead) % 7;
    if (HOURS[d]) return `${ahead === 1 ? "tomorrow" : WEEKDAYS[d]} at ${pad(HOURS[d][0])}`;
  }
  return "soon";
}

function statusText({ day, hour }) {
  const today = HOURS[day];
  if (today && hour >= today[0] && hour < today[1]) return [true, `Open now, until ${pad(today[1])}`];
  if (today && hour < today[0]) return [false, `Closed now, opens today at ${pad(today[0])}`];
  return [false, `Closed now, opens ${nextOpening(day)}`];
}

function updateStatus(now) {
  const [open, text] = statusText(now);
  for (const el of document.querySelectorAll("[data-status]")) {
    el.classList.toggle("is-open", open);
    el.querySelector("[data-status-text]").textContent = text;
  }
}

function markToday({ day }) {
  for (const { row, days } of HOUR_ROWS) row.classList.toggle("is-today", days.includes(day));
}

// ---------- Mobile navigation ----------
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
  });
}

// ---------- Booking request (demo: nothing is sent) ----------
function initBooking() {
  const form = document.querySelector("[data-book-form]");
  const done = document.querySelector("[data-book-done]");

  // Earliest bookable day is today, in salon time.
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date());
  form.elements.day.min = today;

  // Links like "Book with Luka" pre-fill the form from their data-service / data-who.
  for (const link of document.querySelectorAll("[data-service], [data-who]")) {
    link.addEventListener("click", () => {
      if (link.dataset.service) form.elements.service.value = link.dataset.service;
      if (link.dataset.who) form.elements.who.value = link.dataset.who;
    });
  }

  const required = [form.elements.name, form.elements.phone];
  const dayInput = form.elements.day;
  const isPast = () => dayInput.value !== "" && dayInput.value < dayInput.min; // ISO dates compare as strings
  const showError = (input, show) => {
    input.setAttribute("aria-invalid", String(show));
    const error = document.getElementById(`${input.id}-error`);
    error.hidden = !show;
    if (show) input.setAttribute("aria-describedby", error.id);
    else input.removeAttribute("aria-describedby");
  };
  for (const input of required) {
    input.addEventListener("input", () => { if (input.value.trim()) showError(input, false); });
  }
  dayInput.addEventListener("input", () => { if (!isPast()) showError(dayInput, false); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const missing = required.filter((input) => !input.value.trim());
    if (isPast()) missing.push(dayInput);
    for (const input of [...required, dayInput]) showError(input, missing.includes(input));
    if (missing.length) { missing[0].focus(); return; }

    const data = new FormData(form);
    const name = data.get("name").trim();
    const day = data.get("day")
      ? new Date(`${data.get("day")}T12:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
      : "the first free day";
    const who = data.get("who") || "whoever is free";
    const time = data.get("time") ? `, ${data.get("time").toLowerCase()}` : "";

    document.querySelector("[data-book-done-title]").textContent = `Thanks, ${name}!`;
    document.querySelector("[data-book-done-text]").textContent =
      `We've got your request: ${data.get("service").toLowerCase()} with ${who}, ${day}${time}. ` +
      `We'll call you on ${data.get("phone").trim()} within the hour to confirm.`;
    form.hidden = true;
    done.hidden = false;
    done.focus();
  });

  document.querySelector("[data-book-again]").addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    done.hidden = true;
    form.elements.name.focus();
  });
}

const now = salonNow();
updateStatus(now);
markToday(now);
initNav();
initBooking();
for (const el of document.querySelectorAll("[data-year]")) el.textContent = new Date().getFullYear();
