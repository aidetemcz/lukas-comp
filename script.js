// ── Clock ──
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('taskbar-time').textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 10000);

// ── Icon selection ──
document.querySelectorAll('.icon').forEach(icon => {
  icon.addEventListener('click', () => {
    document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
  });

  icon.addEventListener('dblclick', () => {
    const app = icon.dataset.app;
    openApp(app);
  });
});

// Deselect on desktop click
document.getElementById('desktop').addEventListener('click', e => {
  if (e.target === e.currentTarget || e.target.classList.contains('desktop-icons')) {
    document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
  }
});

// ── App launcher ──
function openApp(app) {
  switch (app) {
    case 'halo':
      showUpdateModal('Halo Infinite', 'Stahování aktualizace…', '12,4 GB');
      break;
    case 'cs':
      showUpdateModal('Counter-Strike 2', 'Stahování aktualizace…', '8,1 GB');
      break;
    case 'recycle':
      showModal('Koš', 'Koš je prázdný.');
      break;
    default:
      // placeholder — other apps will be implemented later
      break;
  }
}

// ── Modal helpers ──
const overlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
document.getElementById('modal-close').addEventListener('click', () => {
  overlay.classList.add('hidden');
});

function showModal(title, bodyHtml) {
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;
  overlay.classList.remove('hidden');
}

function showUpdateModal(appName, message, size) {
  modalTitle.textContent = appName;
  modalBody.innerHTML = `
    <p>${message}</p>
    <p style="margin-top:6px;font-size:12px;color:#888;">Zbývá stáhnout: ${size}</p>
    <div class="progress-bar-wrap">
      <div class="progress-bar"></div>
    </div>
  `;
  overlay.classList.remove('hidden');
}
