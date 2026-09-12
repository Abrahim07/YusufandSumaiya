/* ==========================================================================
   GILDED MUGHAL ARCH WALIMA DIGITAL INVITATION - JAVASCRIPT ENGINE
   Yusuf Ibraheem & Syed Sumaiya | 13th December 2026
   Venue: Northern Railway Club, Lucknow
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // === CONFIG & CONSTANTS ===
  const TARGET_DATE = new Date('2026-12-13T19:30:00').getTime();

  // Initial Card State (Customizable by couple)
  let cardData = JSON.parse(localStorage.getItem('wedding_card_config_v4')) || {
    receptionTime: '07:30 PM onwards',
    venueTitle: 'Northern Railway Club',
    venueAddress: 'Northern Railway Club, Charbagh, Lucknow, Uttar Pradesh 226001',
    mapsLink: 'https://maps.google.com/?q=Northern+Railway+Club+Lucknow'
  };

  // Sample Pre-populated Duas
  const initialGuestbook = [
    {
      id: 1,
      sender: 'Uncle & Aunty Siddiqui',
      text: 'Barakallahu lakuma wa baraka \'alaykuma wa jama\'a baynakuma fii khayr. Wishing Yusuf & Sumaiya a blissful married life filled with Iman and happiness!',
      time: '2 hours ago',
      likes: 18
    },
    {
      id: 2,
      sender: 'Dr. Tariq & Family',
      text: 'Heartiest congratulations to Abdul Moid Sahab and Syed Salman Sahab on this auspicious Walima occasion! May Allah bless the newlyweds.',
      time: '5 hours ago',
      likes: 12
    },
    {
      id: 3,
      sender: 'Zayd & Farhan',
      text: 'Eagerly looking forward to attending the Walima at Northern Railway Club, Lucknow! May Allah bless Yusuf Ibraheem & Syed Sumaiya. Ameen!',
      time: '1 day ago',
      likes: 21
    }
  ];

  let guestbook = JSON.parse(localStorage.getItem('wedding_guestbook')) || initialGuestbook;
  let rsvps = JSON.parse(localStorage.getItem('wedding_rsvps')) || [
    {
      name: 'Ahmed Siddiqui',
      phone: '+91 9876543210',
      status: 'attending',
      count: 4,
      meal: 'Standard Halal Feast',
      dua: 'May Allah bless your union with endless happiness.'
    }
  ];

  // === AUDIO AMBIANCE SYNTHESIZER (WEB AUDIO API) ===
  let audioCtx = null;
  let isPlayingMusic = false;
  let synthTimer = null;

  const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // Soft Pentatonic C-Major

  function playSynthNote(freq, duration = 1.5) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.log('Audio synth error:', e);
    }
  }

  function startAmbientMusic() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    isPlayingMusic = true;
    updateMusicButtonState();

    let step = 0;
    synthTimer = setInterval(() => {
      if (!isPlayingMusic) return;
      const note = notes[step % notes.length];
      playSynthNote(note, 2.0);
      step = Math.floor(Math.random() * notes.length);
    }, 850);
  }

  function stopAmbientMusic() {
    isPlayingMusic = false;
    if (synthTimer) clearInterval(synthTimer);
    updateMusicButtonState();
  }

  function updateMusicButtonState() {
    const btnText = document.querySelector('#music-toggle-btn .btn-text');
    const icon = document.querySelector('#music-toggle-btn i');
    if (isPlayingMusic) {
      btnText.textContent = 'Music ON';
      icon.className = 'fa-solid fa-volume-high';
    } else {
      btnText.textContent = 'Music OFF';
      icon.className = 'fa-solid fa-music';
    }
  }

  const musicBtn = document.getElementById('music-toggle-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (isPlayingMusic) {
        stopAmbientMusic();
      } else {
        startAmbientMusic();
      }
    });
  }


  // === CRESCENT MOON & MUGHAL ARCH OPENING HANDLER ===
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const envelopeScreen = document.getElementById('envelope-screen');
  const mainInvitation = document.getElementById('main-invitation');
  let isEnvelopeOpened = false;

  function unsealEnvelope() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      playSynthNote(523.25, 0.5);
      playSynthNote(659.25, 0.8);
      playSynthNote(783.99, 1.2);
    } catch (e) {
      console.log('Audio playback error:', e);
    }

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#768A63', '#9CAF88', '#D4AF37', '#FAF7F2']
      });
    }

    envelopeScreen.classList.add('opened');
    setTimeout(() => {
      envelopeScreen.style.display = 'none';
      mainInvitation.classList.remove('hidden');
      mainInvitation.style.opacity = '0';
      mainInvitation.style.transform = 'translateY(20px)';
      mainInvitation.style.transition = 'all 0.8s ease';
      
      requestAnimationFrame(() => {
        mainInvitation.style.opacity = '1';
        mainInvitation.style.transform = 'translateY(0)';
      });

      startAmbientMusic();
    }, 800);
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      unsealEnvelope();
    });
  }

  if (envelopeScreen) {
    envelopeScreen.addEventListener('click', () => {
      unsealEnvelope();
    });
  }

  // === THEME PICKER ENGINE ===
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const theme = btn.getAttribute('data-theme');
      document.body.className = `theme-${theme}`;
    });
  });

  // === COUNTDOWN TIMER ===
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = TARGET_DATE - now;

    if (distance < 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-minutes').textContent = '00';
      document.getElementById('cd-seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // === CALENDAR INTEGRATION ===
  document.getElementById('add-google-cal').addEventListener('click', () => {
    const title = encodeURIComponent('Walima Ceremony of Yusuf Ibraheem & Syed Sumaiya');
    const details = encodeURIComponent('Join us for the Walima Ceremony at Northern Railway Club, Lucknow. BarakaAllah!');
    const location = encodeURIComponent(cardData.venueAddress);
    const startDate = '20261213T140000Z';
    const endDate = '20261213T180000Z';

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    window.open(googleUrl, '_blank');
  });

  document.getElementById('download-ics-cal').addEventListener('click', () => {
    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YusufAndSumaiya//WalimaInvitation//EN
BEGIN:VEVENT
SUMMARY:Walima Ceremony of Yusuf Ibraheem & Syed Sumaiya
DESCRIPTION:Auspicious Walima Reception Feast
LOCATION:${cardData.venueAddress}
DTSTART:20261213T193000
DTEND:20261213T233000
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Yusuf_And_Sumaiya_Walima.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // === COPY VENUE ADDRESS ===
  document.getElementById('copy-address-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(cardData.venueAddress).then(() => {
      const btn = document.getElementById('copy-address-btn');
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Address Copied!';
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Address';
      }, 2500);
    });
  });

  // === RSVP FORM SUBMISSION ===
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccessMsg = document.getElementById('rsvp-success-msg');

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('guest-name').value;
    const phone = document.getElementById('guest-phone').value;
    const status = document.getElementById('rsvp-status').value;
    const count = parseInt(document.getElementById('guest-count').value, 10);
    const meal = document.getElementById('dietary-req').value;
    const dua = document.getElementById('guest-dua').value;

    const newRsvp = { name, phone, status, count, meal, dua, timestamp: new Date().toISOString() };
    rsvps.push(newRsvp);
    localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));

    if (dua.trim()) {
      guestbook.unshift({
        id: Date.now(),
        sender: name,
        text: dua,
        time: 'Just now',
        likes: 1
      });
      localStorage.setItem('wedding_guestbook', JSON.stringify(guestbook));
      renderGuestbook();
    }

    rsvpForm.reset();
    rsvpSuccessMsg.classList.remove('hidden');

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#B8860B', '#D4AF37', '#FAF7F2']
      });
    }

    setTimeout(() => {
      rsvpSuccessMsg.classList.add('hidden');
    }, 5000);
  });

  // === GUESTBOOK DUAS RENDER & QUICK DUAS ===
  const guestbookContainer = document.getElementById('guestbook-container');

  function renderGuestbook() {
    guestbookContainer.innerHTML = '';
    guestbook.forEach(item => {
      const card = document.createElement('div');
      card.className = 'dua-card';
      card.innerHTML = `
        <div>
          <div class="dua-header">
            <span class="dua-sender">${escapeHtml(item.sender)}</span>
            <span class="dua-time">${item.time}</span>
          </div>
          <p class="dua-text">"${escapeHtml(item.text)}"</p>
        </div>
        <div class="dua-footer">
          <button class="like-btn" data-id="${item.id}">
            <i class="fa-solid fa-heart"></i> <span>${item.likes}</span>
          </button>
        </div>
      `;
      guestbookContainer.appendChild(card);
    });

    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const targetItem = guestbook.find(g => g.id === id);
        if (targetItem) {
          targetItem.likes += 1;
          localStorage.setItem('wedding_guestbook', JSON.stringify(guestbook));
          renderGuestbook();
        }
      });
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m]));
  }

  document.querySelectorAll('.quick-dua-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const duaText = btn.getAttribute('data-text');
      const textarea = document.getElementById('guest-dua');
      textarea.value = duaText;
      document.getElementById('rsvp-section').scrollIntoView({ behavior: 'smooth' });
    });
  });

  renderGuestbook();

  // === ADMIN DASHBOARD MODAL ===
  const adminModal = document.getElementById('admin-modal');
  const openAdminBtn = document.getElementById('open-couple-admin-btn');
  const closeAdminBtn = document.getElementById('close-admin-modal');

  openAdminBtn.addEventListener('click', () => {
    updateAdminStats();
    adminModal.classList.remove('hidden');
  });

  closeAdminBtn.addEventListener('click', () => {
    adminModal.classList.add('hidden');
  });

  function updateAdminStats() {
    const totalResponses = rsvps.length;
    const attendingCount = rsvps.filter(r => r.status === 'attending').reduce((acc, curr) => acc + curr.count, 0);
    const declinedCount = rsvps.filter(r => r.status === 'declined').length;

    document.getElementById('stat-total-responses').textContent = totalResponses;
    document.getElementById('stat-attending-headcount').textContent = attendingCount;
    document.getElementById('stat-declined-count').textContent = declinedCount;

    const tbody = document.getElementById('admin-rsvp-table-body');
    tbody.innerHTML = '';
    rsvps.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${escapeHtml(r.name)}</strong></td>
        <td>${escapeHtml(r.phone)}</td>
        <td><span class="status-badge ${r.status}">${r.status === 'attending' ? 'Attending' : 'Declined'}</span></td>
        <td>${r.count}</td>
        <td>${escapeHtml(r.meal)}</td>
        <td>${escapeHtml(r.dua || '-')}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('export-csv-btn').addEventListener('click', () => {
    let csvContent = "data:text/csv;charset=utf-8,Name,Phone,Status,Guest Count,Meal Preference,Dua/Message\n";
    rsvps.forEach(r => {
      csvContent += `"${r.name}","${r.phone}","${r.status}",${r.count},"${r.meal}","${(r.dua || '').replace(/"/g, '""')}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Yusuf_Sumaiya_Walima_RSVPs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  document.getElementById('clear-data-btn').addEventListener('click', () => {
    if (confirm('Reset demo RSVP responses?')) {
      rsvps = [];
      localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));
      updateAdminStats();
    }
  });

  // === CARD EDITOR MODAL ===
  const editorModal = document.getElementById('editor-modal');
  const openEditorBtn = document.getElementById('open-card-editor-btn');
  const closeEditorBtn = document.getElementById('close-editor-modal');
  const editorForm = document.getElementById('card-editor-form');

  openEditorBtn.addEventListener('click', () => {
    document.getElementById('edit-reception-time').value = cardData.receptionTime;
    document.getElementById('edit-venue-title').value = cardData.venueTitle;
    document.getElementById('edit-venue-address').value = cardData.venueAddress;
    document.getElementById('edit-maps-link').value = cardData.mapsLink;
    editorModal.classList.remove('hidden');
  });

  closeEditorBtn.addEventListener('click', () => {
    editorModal.classList.add('hidden');
  });

  editorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    cardData.receptionTime = document.getElementById('edit-reception-time').value;
    cardData.venueTitle = document.getElementById('edit-venue-title').value;
    cardData.venueAddress = document.getElementById('edit-venue-address').value;
    cardData.mapsLink = document.getElementById('edit-maps-link').value;

    localStorage.setItem('wedding_card_config_v4', JSON.stringify(cardData));
    applyCardConfig();
    editorModal.classList.add('hidden');
  });

  function applyCardConfig() {
    document.getElementById('reception-time-display').textContent = cardData.receptionTime;
    document.getElementById('venue-title-display').textContent = cardData.venueTitle;
    document.getElementById('venue-address-display').innerHTML = `<i class="fa-solid fa-map-pin"></i> ${cardData.venueAddress}`;
    document.getElementById('map-link-btn').setAttribute('href', cardData.mapsLink);
  }

  applyCardConfig();

  // === BACKGROUND PARTICLE CANVAS (FALLING OLIVE LEAVES & GOLDEN SPARKS) ===
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const leafColors = ['#6B7F59', '#768A63', '#9CAF88', '#556644', '#D4AF37', '#8A9E75'];
  const leaves = [];

  for (let i = 0; i < 38; i++) {
    leaves.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 10 + 7,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: Math.sin(Math.random() * Math.PI) * 0.5,
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.03,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.5 + 0.4,
      color: leafColors[Math.floor(Math.random() * leafColors.length)]
    });
  }

  function drawOliveLeaf(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.quadraticCurveTo(p.size * 0.5, 0, 0, p.size);
    ctx.quadraticCurveTo(-p.size * 0.5, 0, 0, -p.size);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();

    // Central leaf vein
    ctx.beginPath();
    ctx.moveTo(0, -p.size * 0.85);
    ctx.lineTo(0, p.size * 0.85);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  }

  function animateLeaves() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    leaves.forEach(p => {
      p.sway += p.swaySpeed;
      p.x += Math.sin(p.sway) * 0.8 + p.speedX;
      p.y += p.speedY;
      p.angle += p.spinSpeed;

      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }

      drawOliveLeaf(p);
    });
    requestAnimationFrame(animateLeaves);
  }
  animateLeaves();
});
