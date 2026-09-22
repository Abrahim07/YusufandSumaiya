const weddingEvents = {
  nikah: { label: 'Nikah', venue: 'Kanpur', date: new Date('2026-12-06T00:00:00+05:30') },
  walima: { label: 'Walima', venue: 'Lucknow', date: new Date('2026-12-13T00:00:00+05:30') }
};
let selectedEvent = 'nikah';
const welcomeGate = document.getElementById('welcomeGate');
const enterInvitation = document.getElementById('enterInvitation');
const doorToggle = document.getElementById('doorToggle');
const canvas = document.getElementById('scratchCanvas');
const card = document.getElementById('scratchCard');
const revealButton = document.getElementById('revealButton');
const scratchNote = document.getElementById('scratchNote');
const mealField = document.getElementById('mealField');
const attendanceInputs = document.querySelectorAll('input[name="attendance"]');
const weddingAudio = document.getElementById('weddingAudio');
let context;
let isScratching = false;
let scratched = 0;

weddingAudio.volume = 0.25;

function startMusic() {
  weddingAudio.play().catch(() => {});
}

document.body.classList.add('gate-open');
function setDoorsOpen(isOpen) {
  welcomeGate.classList.toggle('is-open', isOpen);
  doorToggle.setAttribute('aria-pressed', String(isOpen));
  doorToggle.setAttribute('aria-label', isOpen ? 'Close wedding invitation doors' : 'Open wedding invitation doors');
}

doorToggle.addEventListener('click', (event) => {
  event.stopPropagation();
  if (welcomeGate.classList.contains('is-open')) return;
  setDoorsOpen(true);
  startMusic();
  welcomeGate.classList.add('is-opening');
  document.body.classList.remove('gate-open');
  window.setTimeout(() => welcomeGate.remove(), 1400);
});

enterInvitation.addEventListener('click', () => {
  if (!welcomeGate.classList.contains('is-open')) setDoorsOpen(true);
  startMusic();
  welcomeGate.classList.add('is-opening');
  document.body.classList.remove('gate-open');
  window.setTimeout(() => welcomeGate.remove(), 1400);
});

function paintCover() {
  if (!canvas || !card) return;
  const ratio = window.devicePixelRatio || 1;
  const bounds = card.getBoundingClientRect();
  canvas.width = bounds.width * ratio;
  canvas.height = bounds.height * ratio;
  canvas.style.width = `${bounds.width}px`;
  canvas.style.height = `${bounds.height}px`;
  context = canvas.getContext('2d', { willReadFrequently: true });
  context.scale(ratio, ratio);
  const gradient = context.createLinearGradient(0, 0, bounds.width, bounds.height);
  gradient.addColorStop(0, '#6f5062');
  gradient.addColorStop(0.52, '#4b324e');
  gradient.addColorStop(1, '#2e2039');
  context.fillStyle = gradient;
  context.fillRect(0, 0, bounds.width, bounds.height);
  context.fillStyle = 'rgba(239, 210, 169, .7)';
  context.font = '600 11px DM Sans, sans-serif';
  context.textAlign = 'center';
  context.letterSpacing = '2px';
  context.fillText('SCRATCH TO REVEAL DATES', bounds.width / 2, bounds.height / 2 - 8);
  context.font = '26px Amiri, serif';
  context.fillText('✦', bounds.width / 2, bounds.height / 2 + 29);
}

function revealAt(event) {
  if (!context || !canvas) return;
  const bounds = canvas.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  const x = point.clientX - bounds.left;
  const y = point.clientY - bounds.top;
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.arc(x, y, 43, 0, Math.PI * 2);
  context.fill();
  scratched += 1;
  if (scratched > 7) {
    canvas.classList.add('revealed');
    scratchNote.textContent = 'Nikah · 6 December · Kanpur  /  Walima · 13 December · Lucknow';
  }
}

if (canvas) {
  paintCover();
  window.addEventListener('resize', paintCover);
  canvas.addEventListener('pointerdown', (event) => { isScratching = true; canvas.setPointerCapture(event.pointerId); revealAt(event); });
  canvas.addEventListener('pointermove', (event) => { if (isScratching) revealAt(event); });
  canvas.addEventListener('pointerup', () => { isScratching = false; });
  canvas.addEventListener('pointercancel', () => { isScratching = false; });
}

revealButton.addEventListener('click', () => {
  canvas.style.display = 'none';
  scratchNote.textContent = 'Nikah · 6 December · Kanpur  /  Walima · 13 December · Lucknow';
  revealButton.textContent = 'Dates revealed';
});

function updateCountdown() {
  const event = weddingEvents[selectedEvent];
  const difference = event.date.getTime() - Date.now();
  const totalSeconds = Math.max(0, Math.floor(difference / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  document.getElementById('eventLabel').textContent = event.label;
  document.getElementById('eventVenue').textContent = event.venue;
  document.getElementById('eventCountdown').setAttribute('aria-label', `Countdown to ${event.label}`);
  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
}

const eventTabs = [...document.querySelectorAll('.event-tab')];
function selectEvent(eventKey, moveFocus = false) {
  selectedEvent = eventKey;
  eventTabs.forEach((tab) => {
    const isSelected = tab.dataset.event === selectedEvent;
    tab.classList.toggle('is-selected', isSelected);
    tab.setAttribute('aria-selected', String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    if (isSelected && moveFocus) tab.focus();
  });
  updateCountdown();
}

eventTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectEvent(tab.dataset.event));
  tab.addEventListener('keydown', (event) => {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    const targetIndex = direction ? (index + direction + eventTabs.length) % eventTabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? eventTabs.length - 1 : -1;
    if (targetIndex < 0) return;
    event.preventDefault();
    selectEvent(eventTabs[targetIndex].dataset.event, true);
  });
});

updateCountdown();
setInterval(updateCountdown, 60000);

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

function updateMealVisibility() {
  const attendance = document.querySelector('input[name="attendance"]:checked')?.value;
  const attending = attendance === 'Joyfully attending';
  mealField.hidden = !attending;
  mealField.setAttribute('aria-hidden', String(!attending));
  if (!attending) document.getElementById('meal').value = 'Not specified';
}

attendanceInputs.forEach((input) => input.addEventListener('change', updateMealVisibility));
updateMealVisibility();

document.getElementById('rsvpForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const status = document.getElementById('formStatus');
  const guestName = form.get('guestName');
  const attendance = form.get('attendance');
  const meal = form.get('meal');
  const message = form.get('message') || 'No message';
  const subject = encodeURIComponent(`Wedding RSVP from ${guestName}`);
  const body = encodeURIComponent(`Name: ${guestName}\nAttendance: ${attendance}\nMeal preference: ${meal}\nMessage: ${message}`);
  status.textContent = 'Opening your email app to send the RSVP...';
  window.location.href = `mailto:yusuf.ib09@gmail.com?subject=${subject}&body=${body}`;
});
