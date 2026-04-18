/* ═══════════════════════════════════════════════════════════
   ছাত্রকন্ঠ — Jazzmin Admin JS
   UX enhancements: tooltips, feedback, polish
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Run after DOM ready ────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    fixLogoSize();
    enhanceMessages();
    addTableRowFeedback();
    enhanceDeleteConfirm();
    addSidebarActiveHighlight();
    addSearchClear();
    smoothPageLoad();
    addTooltips();
    addFormDirtyWarning();
    highlightRequiredFields();
    addActionConfirm();
    addCopyIdButtons();
    addCharCount();
    initSidebarCollapse();
  });


  /* ══════════════════════════════════════════════════════════
     1. FIX LOGO SIZE — ensure login logo never overflows
     ══════════════════════════════════════════════════════════ */
  function fixLogoSize() {
    var logos = document.querySelectorAll('.login-logo img, .brand-image, .navbar-brand img');
    logos.forEach(function (img) {
      // Force sensible constraints via inline style as a last resort
      if (img.closest('.login-logo')) {
        img.style.cssText += ';max-width:140px!important;max-height:80px!important;width:auto!important;height:auto!important;object-fit:contain!important;display:block!important;margin:0 auto!important;';
      } else {
        img.style.cssText += ';max-width:32px!important;max-height:32px!important;width:auto!important;height:auto!important;object-fit:contain!important;';
      }
    });
  }


  /* ══════════════════════════════════════════════════════════
     2. AUTO-DISMISS messages with progress bar
     ══════════════════════════════════════════════════════════ */
  function enhanceMessages() {
    var messages = document.querySelectorAll('.alert, #django-messages li, .messages li');
    messages.forEach(function (msg) {
      // Add dismiss button if not present
      if (!msg.querySelector('.close, .btn-close')) {
        var btn = document.createElement('button');
        btn.innerHTML = '&times;';
        btn.style.cssText = 'float:right;background:none;border:none;font-size:18px;line-height:1;cursor:pointer;opacity:0.6;color:inherit;padding:0 4px;margin-left:12px;';
        btn.title = 'Dismiss';
        btn.addEventListener('click', function () { dismissMessage(msg); });
        msg.insertBefore(btn, msg.firstChild);
      }

      // Add progress bar auto-dismiss (5s)
      var bar = document.createElement('div');
      bar.style.cssText = 'position:absolute;bottom:0;left:0;height:2px;width:100%;background:currentColor;opacity:0.3;transform-origin:left;transition:transform 5s linear;border-radius:0 0 6px 6px;';
      msg.style.position = 'relative';
      msg.style.overflow = 'hidden';
      msg.appendChild(bar);

      // Start countdown
      setTimeout(function () { bar.style.transform = 'scaleX(0)'; }, 50);
      setTimeout(function () { dismissMessage(msg); }, 5200);
    });
  }

  function dismissMessage(el) {
    el.style.transition = 'opacity 0.3s, max-height 0.3s, margin 0.3s, padding 0.3s';
    el.style.opacity = '0';
    el.style.maxHeight = '0';
    el.style.marginBottom = '0';
    el.style.paddingTop = '0';
    el.style.paddingBottom = '0';
    setTimeout(function () { el.remove(); }, 350);
  }


  /* ══════════════════════════════════════════════════════════
     3. TABLE ROW CLICK → highlight selected row
     ══════════════════════════════════════════════════════════ */
  function addTableRowFeedback() {
    var rows = document.querySelectorAll('#result_list tbody tr');
    rows.forEach(function (row) {
      row.addEventListener('click', function (e) {
        if (e.target.tagName === 'A' || e.target.tagName === 'INPUT') return;
        rows.forEach(function (r) { r.style.background = ''; });
        row.style.background = 'rgba(230,168,23,0.07)';
      });
    });
  }


  /* ══════════════════════════════════════════════════════════
     4. DELETE CONFIRM — styled native dialog replacement
     ══════════════════════════════════════════════════════════ */
  function enhanceDeleteConfirm() {
    var deleteLinks = document.querySelectorAll('a.deletelink, .deletelink');
    deleteLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var href = link.href || '#';
        showConfirmDialog(
          '⚠ Confirm Delete',
          'This action cannot be undone. Are you sure you want to delete this item?',
          'Delete',
          '#e8525a',
          function () { window.location.href = href; }
        );
      });
    });
  }


  /* ══════════════════════════════════════════════════════════
     5. SIDEBAR active highlight for current URL
     ══════════════════════════════════════════════════════════ */
  function addSidebarActiveHighlight() {
    var path = window.location.pathname;
    var navLinks = document.querySelectorAll('.sidebar .nav-link');
    navLinks.forEach(function (link) {
      if (link.getAttribute('href') && link.getAttribute('href') !== '#' &&
          path.startsWith(link.getAttribute('href'))) {
        link.classList.add('active');
        // Expand parent treeview
        var parent = link.closest('.nav-treeview');
        if (parent) {
          var parentItem = parent.closest('.nav-item');
          if (parentItem) parentItem.classList.add('menu-open');
        }
      }
    });
  }


  /* ══════════════════════════════════════════════════════════
     6. SEARCH — clear button
     ══════════════════════════════════════════════════════════ */
  function addSearchClear() {
    var searchInputs = document.querySelectorAll('#searchbar, #changelist-search input[type="text"]');
    searchInputs.forEach(function (input) {
      if (!input.value) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = '✕';
      btn.title = 'Clear search';
      btn.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;color:#7a8299;cursor:pointer;font-size:13px;padding:2px 4px;line-height:1;';
      var wrapper = input.parentElement;
      if (wrapper && getComputedStyle(wrapper).position === 'static') {
        wrapper.style.position = 'relative';
      }
      wrapper && wrapper.appendChild(btn);
      btn.addEventListener('click', function () {
        input.value = '';
        input.focus();
        btn.remove();
        // Submit parent form to clear search
        var form = input.closest('form');
        if (form) form.submit();
      });
    });
  }


  /* ══════════════════════════════════════════════════════════
     7. SMOOTH PAGE LOAD fade-in
     ══════════════════════════════════════════════════════════ */
  function smoothPageLoad() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.25s ease';
    setTimeout(function () { document.body.style.opacity = '1'; }, 40);
  }


  /* ══════════════════════════════════════════════════════════
     8. TOOLTIPS — for icon-only buttons
     ══════════════════════════════════════════════════════════ */
  function addTooltips() {
    var targets = document.querySelectorAll('[title]');
    targets.forEach(function (el) {
      if (!el.title) return;
      el.setAttribute('data-ck-title', el.title);

      el.addEventListener('mouseenter', function (e) {
        var tip = document.createElement('div');
        tip.id = '__ck_tip';
        tip.textContent = el.getAttribute('data-ck-title');
        tip.style.cssText = [
          'position:fixed',
          'z-index:99999',
          'background:#0f1117',
          'color:#e8eaf0',
          'border:1px solid #262d3e',
          'border-radius:5px',
          'padding:5px 10px',
          'font-size:12px',
          'font-family:DM Sans,sans-serif',
          'pointer-events:none',
          'white-space:nowrap',
          'box-shadow:0 4px 12px rgba(0,0,0,0.4)',
          'opacity:0',
          'transition:opacity 0.15s',
        ].join(';');
        document.body.appendChild(tip);

        var rect = el.getBoundingClientRect();
        tip.style.left = (rect.left + rect.width / 2 - tip.offsetWidth / 2) + 'px';
        tip.style.top = (rect.top - tip.offsetHeight - 6) + 'px';
        setTimeout(function () { tip.style.opacity = '1'; }, 10);
      });

      el.addEventListener('mouseleave', function () {
        var tip = document.getElementById('__ck_tip');
        if (tip) tip.remove();
      });
    });
  }


  /* ══════════════════════════════════════════════════════════
     9. FORM DIRTY WARNING — warn before leaving unsaved form
     ══════════════════════════════════════════════════════════ */
  function addFormDirtyWarning() {
    var form = document.querySelector('#content-main form');
    if (!form) return;

    var dirty = false;
    var inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(function (input) {
      input.addEventListener('change', function () { dirty = true; });
      input.addEventListener('input', function () { dirty = true; });
    });

    // Mark clean on submit
    form.addEventListener('submit', function () { dirty = false; });

    window.addEventListener('beforeunload', function (e) {
      if (dirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    });
  }


  /* ══════════════════════════════════════════════════════════
     10. HIGHLIGHT required fields
     ══════════════════════════════════════════════════════════ */
  function highlightRequiredFields() {
    var required = document.querySelectorAll('.required input, .required textarea, .required select, input[required], textarea[required], select[required]');
    required.forEach(function (el) {
      el.style.borderLeftColor = '#e6a817';
      el.style.borderLeftWidth = '3px';
    });
  }


  /* ══════════════════════════════════════════════════════════
     11. ACTION CONFIRM — confirm bulk actions
     ══════════════════════════════════════════════════════════ */
  function addActionConfirm() {
    var actionBtn = document.querySelector('.actions button[type="submit"], .actions input[type="submit"]');
    var actionSelect = document.querySelector('.actions select[name="action"]');
    if (!actionBtn || !actionSelect) return;

    actionBtn.addEventListener('click', function (e) {
      var action = actionSelect.value;
      if (!action) return;

      var checked = document.querySelectorAll('#result_list input[type="checkbox"]:checked:not(#action-toggle)');
      if (!checked.length) return;

      if (action.includes('delete')) {
        e.preventDefault();
        showConfirmDialog(
          '⚠ Confirm Bulk Delete',
          'You are about to delete ' + checked.length + ' item(s). This cannot be undone.',
          'Delete ' + checked.length + ' item(s)',
          '#e8525a',
          function () { actionBtn.closest('form') && actionBtn.closest('form').submit(); }
        );
      }
    });
  }


  /* ══════════════════════════════════════════════════════════
     12. COPY ID BUTTONS — click PK to copy
     ══════════════════════════════════════════════════════════ */
  function addCopyIdButtons() {
    // Add copy icon to th.column-id or first column values
    var idCells = document.querySelectorAll('#result_list tbody .field-id, #result_list tbody .field-pk');
    idCells.forEach(function (cell) {
      var text = cell.textContent.trim();
      if (!text) return;
      cell.title = 'Click to copy ID';
      cell.style.cursor = 'pointer';
      cell.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') return;
        navigator.clipboard && navigator.clipboard.writeText(text).then(function () {
          showToast('ID copied: ' + text);
        });
      });
    });
  }


  /* ══════════════════════════════════════════════════════════
     13. CHAR COUNTER for textareas with maxlength
     ══════════════════════════════════════════════════════════ */
  function addCharCount() {
    var textareas = document.querySelectorAll('textarea[maxlength]');
    textareas.forEach(function (ta) {
      var max = parseInt(ta.getAttribute('maxlength'));
      var counter = document.createElement('div');
      counter.style.cssText = 'text-align:right;font-size:11px;color:#7a8299;margin-top:3px;';

      function update() {
        var remaining = max - ta.value.length;
        counter.textContent = remaining + ' characters remaining';
        counter.style.color = remaining < 20 ? '#e8525a' : '#7a8299';
      }

      update();
      ta.addEventListener('input', update);
      ta.parentNode && ta.parentNode.insertBefore(counter, ta.nextSibling);
    });
  }


  /* ══════════════════════════════════════════════════════════
     14. SIDEBAR COLLAPSE memory (localStorage)
     ══════════════════════════════════════════════════════════ */
  function initSidebarCollapse() {
    try {
      // If sidebar is collapsed on load, apply remembered state
      var collapsed = localStorage.getItem('ck_sidebar_collapsed') === '1';
      var body = document.body;
      if (collapsed && body.classList.contains('sidebar-mini')) {
        body.classList.add('sidebar-collapse');
      }

      // Listen for toggle button
      var toggleBtn = document.querySelector('[data-widget="pushmenu"]');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
          setTimeout(function () {
            var isCollapsed = body.classList.contains('sidebar-collapse');
            localStorage.setItem('ck_sidebar_collapsed', isCollapsed ? '1' : '0');
          }, 100);
        });
      }
    } catch (e) { /* localStorage may be blocked */ }
  }


  /* ══════════════════════════════════════════════════════════
     HELPERS
     ══════════════════════════════════════════════════════════ */

  function showToast(message, duration) {
    duration = duration || 2500;
    var toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = [
      'position:fixed',
      'bottom:24px',
      'right:24px',
      'z-index:99998',
      'background:#1e2330',
      'border:1px solid #e6a817',
      'color:#e8eaf0',
      'padding:10px 18px',
      'border-radius:8px',
      'font-family:DM Sans,sans-serif',
      'font-size:13px',
      'box-shadow:0 4px 20px rgba(0,0,0,0.4)',
      'opacity:0',
      'transform:translateY(8px)',
      'transition:opacity 0.25s,transform 0.25s',
    ].join(';');
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 30);
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(function () { toast.remove(); }, 300);
    }, duration);
  }

  function showConfirmDialog(title, message, confirmLabel, confirmColor, onConfirm) {
    // Overlay
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99990;background:rgba(0,0,0,0.65);display:flex;align-items:center;justify-content:center;';

    // Box
    var box = document.createElement('div');
    box.style.cssText = [
      'background:#171b24',
      'border:1px solid #262d3e',
      'border-radius:10px',
      'padding:28px 28px 22px',
      'max-width:400px',
      'width:90%',
      'box-shadow:0 8px 40px rgba(0,0,0,0.5)',
      'font-family:DM Sans,sans-serif',
      'position:relative',
      'animation:ck_dlg_in 0.18s ease',
    ].join(';');

    box.innerHTML = [
      '<div style="font-family:Playfair Display,serif;font-size:18px;font-weight:700;color:#e8eaf0;margin-bottom:12px;">' + title + '</div>',
      '<div style="font-size:13.5px;color:#7a8299;line-height:1.6;margin-bottom:24px;">' + message + '</div>',
      '<div style="display:flex;gap:10px;justify-content:flex-end;">',
      '<button id="__ck_cancel" style="background:#1e2330;border:1px solid #262d3e;color:#e8eaf0;border-radius:6px;padding:8px 18px;font-size:13px;cursor:pointer;font-family:DM Sans,sans-serif;">Cancel</button>',
      '<button id="__ck_confirm" style="background:' + confirmColor + ';border:none;color:#fff;border-radius:6px;padding:8px 18px;font-size:13px;font-weight:600;cursor:pointer;font-family:DM Sans,sans-serif;">' + confirmLabel + '</button>',
      '</div>',
    ].join('');

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Add keyframe if not already present
    if (!document.getElementById('__ck_dlg_style')) {
      var s = document.createElement('style');
      s.id = '__ck_dlg_style';
      s.textContent = '@keyframes ck_dlg_in{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}';
      document.head.appendChild(s);
    }

    box.querySelector('#__ck_cancel').addEventListener('click', function () { overlay.remove(); });
    box.querySelector('#__ck_confirm').addEventListener('click', function () { overlay.remove(); onConfirm(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });

    // Keyboard ESC
    function onKey(e) { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', onKey); } }
    document.addEventListener('keydown', onKey);
  }

}());
