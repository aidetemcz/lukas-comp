// ── Clock ──
function updateClock() {
  if (window.__clockOverridden) return;
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
    if (window.LukasEditor && window.LukasEditor.isEditMode()) return;
    document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
    openApp(icon.dataset.app);
  });
});

// Deselect on desktop click
document.getElementById('desktop').addEventListener('click', e => {
  if (window.LukasEditor && window.LukasEditor.isEditMode()) return;
  if (e.target === e.currentTarget || e.target.classList.contains('desktop-icons')) {
    document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
  }
});

// ── Notepad ──
const notepadWindow = document.getElementById('notepad-window');
const notepadContent = document.getElementById('notepad-content');
document.getElementById('notepad-close-btn').addEventListener('click', () => {
  if (window.LukasEditor && window.LukasEditor.isEditMode()) return;
  notepadWindow.classList.add('hidden');
});

const DIARY_FALLBACK = `denik_soukrome.txt
──────────────────────────────

3. 9. 2024

Zítra škola. Fakt se mi nechce. Každý rok to samý. Sedneme si, Kovaříková rozdá rozvrh, někdo udělá blbej vtip a všichni se smějou. Já taky. Jako bych byl tam.

──────────────────────────────

11. 9. 2024

Hrál jsem Halo do tří ráno. Máma nic neřekla, přišla v půl čtvrtý ze směny, šla rovnou spát. Babička spí od devíti.

Ve škole jsem usnul na matice. Novák si toho všiml, ale nic neřekl. To je vlastně horší.

──────────────────────────────

19. 9. 2024

Přidal jsem se na jeden Discord server. Našel jsem ho přes YouTube video — nějakej chlap co mluví o tom, proč je dnešní svět nastavený špatně. Celkem má pravdu v některých věcech. Server se jmenuje MenOnly_CZ, je tam asi 200 lidí. Zatím jen čtu.

──────────────────────────────

4. 10. 2024

Tereza si dneska sedla ke mně na obědě. Myslel jsem, že za mnou, ale čekala na Honzu. Pak odešli. Nic.

Večer jsem byl na serveru. Jeden typ tam psal, že holky se vždycky rozhodnou pro někoho jiného, ne proto že by ten druhej byl lepší, ale protože to tak prostě chodí. Nějak mi to přišlo jako pravda.

──────────────────────────────

21. 10. 2024

Začal jsem cvičit. Viděl jsem video o looksmaxxingu — říkaj, že většina věcí co tě brzdí jde opravit, když se chceš snažit. Jaw exercises, cold shower, posture. Zkusím to.

Klukům na serveru jsem napsal poprvý. Napsali zpátky.

──────────────────────────────

[pokračování bude doplněno]`;

function openDiary() {
  notepadWindow.classList.remove('hidden');
  fetch('content/denik.md')
    .then(r => {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    })
    .then(text => {
      const plain = text
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^\s*---+\s*$/gm, '──────────────────────────────')
        .replace(/\*\*(.+?)\*\*/g, '$1');
      notepadContent.textContent = plain;
      if (window.LukasEditor) window.LukasEditor.refresh();
    })
    .catch(() => {
      notepadContent.textContent = DIARY_FALLBACK;
      if (window.LukasEditor) window.LukasEditor.refresh();
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
  if (window.LukasEditor && window.LukasEditor.isEditMode()) return;
  overlay.classList.add('hidden');
});

function showModal(title, bodyHtml) {
  if (window.LukasEditor) window.LukasEditor.setModalContext(title);
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;
  overlay.classList.remove('hidden');
  if (window.LukasEditor) window.LukasEditor.refresh();
}

function showUpdateModal(appName, message, size) {
  if (window.LukasEditor) window.LukasEditor.setModalContext(appName);
  modalTitle.textContent = appName;
  modalBody.innerHTML = `
    <p>${message}</p>
    <p style="margin-top:6px;font-size:12px;color:#888;">Zbývá stáhnout: ${size}</p>
    <div class="progress-bar-wrap">
      <div class="progress-bar"></div>
    </div>
  `;
  overlay.classList.remove('hidden');
  if (window.LukasEditor) window.LukasEditor.refresh();
}
