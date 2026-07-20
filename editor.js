// ── Content editor ──
// Lets the site owner edit every visible text string and swap every image
// (icons, wallpaper, …) for a custom upload, without changing the app UI.
// Overrides are stored in localStorage and re-applied whenever content
// (re)renders, so they survive reloads but stay local to this browser.

(function () {
  const STORAGE_KEY = 'lukasEditorOverrides';
  const EDIT_ROOTS = ['#desktop', '#notepad-window', '#modal-overlay'];

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return {
        text: (parsed && parsed.text) || {},
        images: (parsed && parsed.images) || {},
      };
    } catch (e) {
      return { text: {}, images: {} };
    }
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      alert('Změnu se nepodařilo uložit (došlo místo v úložišti prohlížeče). Zkuste menší obrázek.');
    }
  }

  function computePath(el) {
    const parts = [];
    let node = el;
    while (node && node.parentElement && node !== document.body) {
      const parent = node.parentElement;
      const idx = Array.prototype.indexOf.call(parent.children, node);
      parts.unshift(node.tagName.toLowerCase() + idx);
      node = parent;
    }
    return parts.join('/');
  }

  function computeId(el) {
    const path = computePath(el);
    // Only the title/body are app-specific; modal chrome (e.g. the close
    // button) is shared across every app and must not be scoped per context.
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const isContextual =
      (modalTitle && modalTitle.contains(el)) || (modalBody && modalBody.contains(el));
    if (isContextual) {
      const modal = document.getElementById('modal');
      return 'ctx:' + (modal.dataset.context || '') + '/' + path;
    }
    return path;
  }

  function isLeafTextElement(el) {
    if (el.closest('#editor-ui')) return false;
    const skipTags = ['SCRIPT', 'STYLE', 'IMG', 'INPUT', 'SVG', 'PATH'];
    if (skipTags.includes(el.tagName)) return false;
    if (el.children.length > 0) return false;
    return el.textContent.replace(/\s+/g, '').length > 0;
  }

  function collectTextElements() {
    const found = [];
    EDIT_ROOTS.forEach((rootSel) => {
      const root = document.querySelector(rootSel);
      if (!root) return;
      root.querySelectorAll('*').forEach((el) => {
        if (isLeafTextElement(el)) found.push(el);
      });
    });
    return found;
  }

  function collectImageElements() {
    const found = [];
    EDIT_ROOTS.forEach((rootSel) => {
      const root = document.querySelector(rootSel);
      if (!root) return;
      root.querySelectorAll('img').forEach((el) => {
        if (!el.closest('#editor-ui')) found.push(el);
      });
    });
    return found;
  }

  let editMode = false;
  let pendingImageTarget = null;
  const fileInput = document.getElementById('editor-file-input');

  function bindTextElement(el) {
    if (el.dataset.editBound) return;
    el.dataset.editBound = '1';
    el.addEventListener('input', () => {
      const id = el.dataset.editId;
      const data = loadData();
      data.text[id] = el.textContent;
      saveData(data);
      if (el.id === 'taskbar-time') window.__clockOverridden = true;
    });
    el.addEventListener('click', (e) => {
      if (editMode) e.stopPropagation();
    });
    el.addEventListener('keydown', (e) => {
      if (!editMode) return;
      if (e.key === 'Enter' && el.id !== 'notepad-content') {
        e.preventDefault();
        el.blur();
      }
    });
  }

  function bindImageElement(el) {
    if (el.dataset.editBound) return;
    el.dataset.editBound = '1';
    el.addEventListener('click', (e) => {
      if (!editMode) return;
      e.preventDefault();
      e.stopPropagation();
      pendingImageTarget = { el, isBg: false };
      fileInput.click();
    });
  }

  function applyOverrides() {
    const data = loadData();
    collectTextElements().forEach((el) => {
      const id = computeId(el);
      el.dataset.editId = id;
      if (data.text[id] !== undefined && el.textContent !== data.text[id]) {
        el.textContent = data.text[id];
      }
      if (data.text[id] !== undefined && el.id === 'taskbar-time') {
        window.__clockOverridden = true;
      }
      bindTextElement(el);
      el.contentEditable = editMode ? 'true' : 'false';
    });
    collectImageElements().forEach((el) => {
      const id = computeId(el);
      el.dataset.editId = id;
      if (data.images[id]) el.src = data.images[id];
      bindImageElement(el);
    });
    const desktop = document.getElementById('desktop');
    if (desktop && data.images['bg:desktop']) {
      desktop.style.backgroundImage =
        `url(${data.images['bg:desktop']}), linear-gradient(135deg, #0d1b2a 0%, #1b2a3b 50%, #0a1628 100%)`;
    }
  }

  function setEditMode(on) {
    editMode = on;
    document.body.classList.toggle('edit-mode', on);
    document.getElementById('editor-panel').classList.toggle('hidden', !on);
    document.getElementById('editor-toggle-btn').classList.toggle('active', on);
    applyOverrides();
  }

  document.getElementById('editor-toggle-btn').addEventListener('click', () => {
    setEditMode(!editMode);
  });
  document.getElementById('editor-done-btn').addEventListener('click', () => {
    setEditMode(false);
  });
  document.getElementById('editor-wallpaper-btn').addEventListener('click', () => {
    pendingImageTarget = { el: document.getElementById('desktop'), isBg: true };
    fileInput.click();
  });
  document.getElementById('editor-reset-btn').addEventListener('click', () => {
    if (confirm('Opravdu obnovit veškerý text a obrázky na výchozí obsah?')) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file || !pendingImageTarget) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const { el, isBg } = pendingImageTarget;
      const data = loadData();
      if (isBg) {
        const id = 'bg:desktop';
        el.style.backgroundImage =
          `url(${dataUrl}), linear-gradient(135deg, #0d1b2a 0%, #1b2a3b 50%, #0a1628 100%)`;
        data.images[id] = dataUrl;
      } else {
        const id = el.dataset.editId || computeId(el);
        el.src = dataUrl;
        data.images[id] = dataUrl;
      }
      saveData(data);
      pendingImageTarget = null;
      fileInput.value = '';
    };
    reader.readAsDataURL(file);
  });

  applyOverrides();

  window.LukasEditor = {
    refresh: applyOverrides,
    isEditMode: () => editMode,
    setModalContext(ctx) {
      const modal = document.getElementById('modal');
      if (modal) modal.dataset.context = ctx;
    },
  };
})();
