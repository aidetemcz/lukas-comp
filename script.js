// ── Clock ──
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('taskbar-time').textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 10000);

// ── Icon selection + open ──
document.querySelectorAll('.icon').forEach(icon => {
  icon.addEventListener('click', () => {
    document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
    openApp(icon.dataset.app);
  });
});

// Deselect on desktop click
document.getElementById('desktop').addEventListener('click', e => {
  if (e.target === e.currentTarget || e.target.classList.contains('desktop-icons')) {
    document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
  }
});

// ── Notepad ──
const notepadWindow = document.getElementById('notepad-window');
const notepadContent = document.getElementById('notepad-content');
document.getElementById('notepad-close-btn').addEventListener('click', () => {
  notepadWindow.classList.add('hidden');
});

let diaryLoaded = false;

function openDiary() {
  notepadWindow.classList.remove('hidden');
  if (diaryLoaded) return;
  fetch('content/denik.md')
    .then(r => r.text())
    .then(text => {
      // Strip markdown headings/horizontal rules, keep readable plain text
      const plain = text
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^\s*---+\s*$/gm, '──────────────────────────────')
        .replace(/\*\*(.+?)\*\*/g, '$1');
      notepadContent.textContent = plain;
      diaryLoaded = true;
    })
    .catch(() => {
      notepadContent.textContent = '[Soubor nelze načíst]';
    });
}

// ── App launcher ──
function openApp(app) {
  switch (app) {
    case 'diary':
      openDiary();
      break;
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
