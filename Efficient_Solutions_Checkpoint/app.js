/* =============================================
   TASKFLOW — app.js
   ============================================= */

'use strict';

// ─── DATA MODEL ──────────────────────────────────────────────────────────────
/**
 * Task shape:
 * {
 *   id:       string   (unique)
 *   name:     string
 *   start:    string   (YYYY-MM-DD)
 *   end:      string   (YYYY-MM-DD)
 *   state:    'New' | 'In Progress' | 'On Hold' | 'Resolved' | 'Closed'
 *   urgency:  1 | 2 | 3
 *   impact:   1 | 2 | 3
 *   priority: 1..5  (computed)
 * }
 */

// Always start fresh — no persistence between sessions
let tasks = [];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const PRIORITY_LABELS = {
  1: 'P1 — Critical',
  2: 'P2 — High',
  3: 'P3 — Moderate',
  4: 'P4 — Low',
  5: 'P5 — Planning',
};

const STATE_CLASSES = {
  'New':         'state-new',
  'In Progress': 'state-inprogress',
  'On Hold':     'state-onhold',
  'Resolved':    'state-resolved',
  'Closed':      'state-closed',
};

const URGENCY_LABELS = { 1: '1 — High', 2: '2 — Medium', 3: '3 — Low' };
const IMPACT_LABELS  = { 1: '1 — High', 2: '2 — Medium', 3: '3 — Low' };

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function generateId() {
  return 'tf_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Escape HTML
function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Format YYYY-MM-DD → "07 Mar 2026"
function formatDate(str) {
  if (!str) return '—';
  const [y, m, d] = str.split('-');
  return `${d} ${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}

// ─── ALGORITHM 1 — SORT BY START DATE ────────────────────────────────────────
/**
 * Returns a new sorted array (original untouched).
 * Uses native Array.sort (Timsort).
 */
function sortByStartTime(arr, dir) {
  if (dir === 'none') return arr;
  return arr.slice().sort((a, b) => {
    if (a.start < b.start) return dir === 'asc' ? -1 : 1;
    if (a.start > b.start) return dir === 'asc' ?  1 : -1;
    return 0;
  });
}

// ─── ALGORITHM 2 — GROUP BY PRIORITY ─────────────────────────────────────────
/**
 * Single pass over the array; O(1) Map.get per task.
 * Returns a Map<priority, Task[]> preserving P1→P5 insertion order.
 */
function groupTasksByPriority(arr) {
  const map = new Map([[1,[]],[2,[]],[3,[]],[4,[]],[5,[]]]);
  for (const task of arr) map.get(task.priority).push(task);
  return map;
}

// ─── ALGORITHM 3 — DETECT OVERLAPPING TASKS ──────────────────────────────────
/**
 * Sort by start, then use a sliding window:
 * for each task i, scan j > i while j.start < i.end.
 * Two tasks overlap if: A.start < B.end  &&  B.start < A.end
 */
function detectOverlaps(arr) {
  if (arr.length < 2) return { pairs: [], flagged: new Set() };

  const sorted  = arr.slice().sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
  const pairs   = [];
  const flagged = new Set();

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[j].start >= sorted[i].end) break; // early exit
      if (sorted[i].start < sorted[j].end) {
        pairs.push({ taskA: sorted[i], taskB: sorted[j] });
        flagged.add(sorted[i].id);
        flagged.add(sorted[j].id);
      }
    }
  }

  return { pairs, flagged };
}

// ─── PRIORITY CALCULATION ─────────────────────────────────────────────────────
/**
 * ServiceNow priority matrix: urgency + impact - 1, clamped to [1,5]
 */
function computePriority(urgency, impact) {
  return Math.min(Math.max(parseInt(urgency, 10) + parseInt(impact, 10) - 1, 1), 5);
}

// ─── DOM REFS ─────────────────────────────────────────────────────────────────

const viewList     = document.getElementById('view-list');
const viewNew      = document.getElementById('view-new');
const viewOverlaps = document.getElementById('view-overlaps');
const taskTbody = document.getElementById('task-tbody');
const emptyEl   = document.getElementById('empty-state');
const formTitle = document.getElementById('form-title');
const editIndex = document.getElementById('edit-index');

const statTotal    = document.getElementById('stat-total');
const statCritical = document.getElementById('stat-critical');
const statActive   = document.getElementById('stat-active');

const filterState    = document.getElementById('filter-state');
const filterPriority = document.getElementById('filter-priority');
const filterSearch   = document.getElementById('filter-search');

const fName    = document.getElementById('f-name');
const fStart   = document.getElementById('f-start');
const fEnd     = document.getElementById('f-end');
const fState   = document.getElementById('f-state');
const fUrgency = document.getElementById('f-urgency');
const fImpact  = document.getElementById('f-impact');

const previewBadge = document.getElementById('preview-badge');
const previewDesc  = document.getElementById('preview-desc');

const modalOverlay = document.getElementById('modal-overlay');
const toast        = document.getElementById('toast');
// overlap view rendered separately via renderOverlapsView()

// ─── STATE ────────────────────────────────────────────────────────────────────

let sortDir       = 'none';   // 'none' | 'asc' | 'desc'
let groupByPriority = false;
let pendingDelete   = null;

// ─── NAVIGATION ──────────────────────────────────────────────────────────────

function showView(name) {
  viewList.classList.toggle('hidden',     name !== 'list');
  viewNew.classList.toggle('hidden',      name !== 'new');
  viewOverlaps.classList.toggle('hidden', name !== 'overlaps');
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.view === name);
  });
  if (name === 'overlaps') renderOverlapsView();
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const v = btn.dataset.view;
    if (v === 'new') openForm();
    else showView(v);
  });
});

document.getElementById('btn-open-form').addEventListener('click', () => openForm());
document.getElementById('btn-cancel').addEventListener('click',    () => showView('list'));
document.getElementById('btn-cancel-2').addEventListener('click',  () => showView('list'));

// ─── FORM ────────────────────────────────────────────────────────────────────

function openForm(task = null, index = null) {
  // Reset all fields and errors in one pass
  const fields = ['f-name','f-start','f-end','f-state','f-urgency','f-impact'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    el.value = '';
    el.classList.remove('error');
  });
  ['err-name','err-start','err-end','err-state','err-urgency','err-impact'].forEach(id => {
    document.getElementById(id).textContent = '';
  });
  previewBadge.textContent = '—';
  previewBadge.className   = 'preview-badge';
  previewDesc.textContent  = 'Select urgency and impact to compute';

  if (task) {
    formTitle.textContent = 'Edit Task';
    editIndex.value       = index;
    fName.value           = task.name;
    fStart.value          = task.start;
    fEnd.value            = task.end;
    fState.value          = task.state;
    fUrgency.value        = task.urgency;
    fImpact.value         = task.impact;
    updatePriorityPreview();
  } else {
    formTitle.textContent = 'New Task';
    editIndex.value       = '';
    fState.value          = 'New';   // default
  }

  showView('new');
}

// ─── PRIORITY PREVIEW ─────────────────────────────────────────────────────────

function updatePriorityPreview() {
  const u = fUrgency.value, i = fImpact.value;
  if (!u || !i) {
    previewBadge.textContent = '—';
    previewBadge.className   = 'preview-badge';
    previewDesc.textContent  = 'Select urgency and impact to compute';
    return;
  }
  const p = computePriority(u, i);
  previewBadge.textContent = `P${p}`;
  previewBadge.className   = `preview-badge badge-priority priority-${p}`;
  previewDesc.textContent  = PRIORITY_LABELS[p];
}

fUrgency.addEventListener('change', updatePriorityPreview);
fImpact.addEventListener('change',  updatePriorityPreview);

// ─── FORM VALIDATION ──────────────────────────────────────────────────────────

function validate() {
  let ok = true;
  const rules = [
    { id: 'f-name',    errId: 'err-name',    msg: 'Task name is required.' },
    { id: 'f-start',   errId: 'err-start',   msg: 'Start date is required.' },
    { id: 'f-end',     errId: 'err-end',     msg: 'End date is required.' },
    { id: 'f-state',   errId: 'err-state',   msg: 'State is required.' },
    { id: 'f-urgency', errId: 'err-urgency', msg: 'Urgency is required.' },
    { id: 'f-impact',  errId: 'err-impact',  msg: 'Impact is required.' },
  ];
  rules.forEach(({ id, errId, msg }) => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      document.getElementById(errId).textContent = msg;
      el.classList.add('error');
      ok = false;
    } else {
      document.getElementById(errId).textContent = '';
      el.classList.remove('error');
    }
  });
  if (fStart.value && fEnd.value && fStart.value >= fEnd.value) {
    document.getElementById('err-end').textContent = 'End must be after start.';
    fEnd.classList.add('error');
    ok = false;
  }
  return ok;
}

// ─── FORM SUBMIT ─────────────────────────────────────────────────────────────

document.getElementById('task-form').addEventListener('submit', e => {
  e.preventDefault();
  if (!validate()) return;

  const urgency  = parseInt(fUrgency.value, 10);
  const impact   = parseInt(fImpact.value, 10);

  const task = {
    id:       generateId(),
    name:     fName.value.trim(),
    start:    fStart.value,
    end:      fEnd.value,
    state:    fState.value,
    urgency,
    impact,
    priority: computePriority(urgency, impact),
  };

  const idx = editIndex.value;
  if (idx !== '') {
    task.id          = tasks[parseInt(idx, 10)].id;
    tasks[parseInt(idx, 10)] = task;
    showToast('Task updated successfully.', 'success');
  } else {
    tasks.push(task);
    showToast('Task created successfully.', 'success');
  }

  // Show list first, THEN render so the view is visible when rows are injected
  showView('list');
  renderTable();
  updateStats();
});

// ─── STATS — single pass O(n) ─────────────────────────────────────────────────

function updateStats() {
  let total = 0, critical = 0, active = 0;
  for (const t of tasks) {
    total++;
    if (t.priority === 1)           critical++;
    if (t.state === 'In Progress')  active++;
  }
  statTotal.textContent    = total;
  statCritical.textContent = critical;
  statActive.textContent   = active;
}

// ─── FILTERS ──────────────────────────────────────────────────────────

function getFilteredTasks() {
  const state    = filterState.value;
  const priority = filterPriority.value ? parseInt(filterPriority.value, 10) : 0;
  const search   = filterSearch.value.toLowerCase().trim();

  // Single pass — avoid redundant toLowerCase on each iteration
  return tasks.filter(t => {
    if (state    && t.state !== state)         return false;
    if (priority && t.priority !== priority)   return false;
    if (search   && !t.name.toLowerCase().includes(search)) return false;
    return true;
  });
}

[filterState, filterPriority, filterSearch].forEach(el => {
  el.addEventListener('input', renderTable);
});

// ─── BUILD ROW — reuses constants, no repeated object lookups ─────────────────

function buildRow(task, realIdx, flagged) {
  const isOverlap = flagged.has(task.id);
  const tr        = document.createElement('tr');

  tr.innerHTML = `
    <td>
      <span class="task-name" title="${esc(task.name)}">${esc(task.name)}</span>
      ${isOverlap ? `<span class="overlap-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>overlap</span>` : ''}
    </td>
    <td><span class="badge-state ${STATE_CLASSES[task.state]}">${esc(task.state)}</span></td>
    <td><span class="badge-priority priority-${task.priority}">${PRIORITY_LABELS[task.priority]}</span></td>
    <td><span class="pill pill-${task.urgency}">${URGENCY_LABELS[task.urgency]}</span></td>
    <td><span class="pill pill-${task.impact}">${IMPACT_LABELS[task.impact]}</span></td>
    <td><span class="task-time">${formatDate(task.start)}</span></td>
    <td><span class="task-time">${formatDate(task.end)}</span></td>
    <td>
      <div class="row-actions">
        <button class="icon-btn edit-btn" data-idx="${realIdx}" title="Edit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="icon-btn delete delete-btn" data-idx="${realIdx}" title="Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </td>`;

  return tr;
}

// ─── RENDER TABLE ─────────────────────────────────────────────────────────────
/**
 * Full render pipeline:
 *   1. Filter
 *   2. Sort
 *   3. Overlap + O(n·k)
 *   4. Group  (only when toggle is on)
 *   5. DOM  single DocumentFragment flush
 *
 * Index map built once — avoids O(n²) findIndex in loop.
 */
function renderTable() {
  let data = getFilteredTasks();
  taskTbody.innerHTML = '';

  if (data.length === 0) {
    emptyEl.classList.add('visible');
    updateOverlapBadge(0);
    return;
  }
  emptyEl.classList.remove('visible');

  // Build id→index map once: O(n) instead of O(n²) findIndex in loop
  const idxMap = new Map(tasks.map((t, i) => [t.id, i]));

  // Algorithm 1 — sort
  data = sortByStartTime(data, sortDir);

  // Algorithm 3 — overlaps (on full task list, not just filtered)
  const { pairs, flagged } = detectOverlaps(tasks);
  updateOverlapBadge(pairs.length);

  // Use a DocumentFragment: single DOM flush instead of n reflows
  const frag = document.createDocumentFragment();

  // Algorithm 2 — group or flat
  if (groupByPriority) {
    const grouped = groupTasksByPriority(data);
    grouped.forEach((group, priority) => {
      if (group.length === 0) return;
      const headerTr = document.createElement('tr');
      headerTr.className = 'group-header-row';
      headerTr.innerHTML = `
        <td colspan="8">
          <span class="group-header-label badge-priority priority-${priority}">
            ${PRIORITY_LABELS[priority]}
            <span class="group-count">${group.length}</span>
          </span>
        </td>`;
      frag.appendChild(headerTr);
      group.forEach(task => frag.appendChild(buildRow(task, idxMap.get(task.id), flagged)));
    });
  } else {
    data.forEach(task => frag.appendChild(buildRow(task, idxMap.get(task.id), flagged)));
  }

  taskTbody.appendChild(frag); // single reflow

}

// ─── TABLE CLICK DELEGATION ───────────────────────────────────────────────────
// Single delegated listener instead of n×2 individual listeners per render

function handleTableClick(e) {
  const edit = e.target.closest('.edit-btn');
  const del  = e.target.closest('.delete-btn');
  if (edit) {
    const idx = parseInt(edit.dataset.idx, 10);
    openForm(tasks[idx], idx);
  }
  if (del) {
    pendingDelete = parseInt(del.dataset.idx, 10);
    modalOverlay.classList.remove('hidden');
  }
}

// Attach delegation once only
taskTbody.addEventListener('click', handleTableClick);

// ─── OVERLAP BADGE (sidebar) ──────────────────────────────────────────────────

function updateOverlapBadge(count) {
  const badge = document.getElementById('nav-overlap-badge');
  if (count > 0) {
    badge.textContent = count;
    badge.classList.add('visible');
  } else {
    badge.textContent = '';
    badge.classList.remove('visible');
  }
}

// ─── OVERLAPS DEDICATED VIEW ──────────────────────────────────────────────────
// Called once when navigating to the Overlaps view.
// Re-runs detectOverlaps on current tasks.

function renderOverlapsView() {
  const grid       = document.getElementById('overlap-grid');
  const emptyEl    = document.getElementById('overlap-empty');
  const countBadge = document.getElementById('overlap-count-badge');
  const { pairs, flagged } = detectOverlaps(tasks);

  updateOverlapBadge(pairs.length);
  countBadge.textContent = pairs.length > 0
    ? pairs.length + ' conflict' + (pairs.length > 1 ? 's' : '')
    : 'No conflicts';

  if (pairs.length === 0) {
    emptyEl.classList.remove('hidden');
    grid.innerHTML = '';
    return;
  }
  emptyEl.classList.add('hidden');

  // Build all cards in a single DocumentFragment — one DOM flush
  const frag = document.createDocumentFragment();
  pairs.forEach(({ taskA, taskB }) => {
    const card = document.createElement('div');
    card.className = 'overlap-card';
    card.innerHTML = `
      <div class="overlap-task">
        <span class="overlap-task-name">${esc(taskA.name)}</span>
        <div class="overlap-task-meta">
          <span class="badge-priority priority-${taskA.priority}">${PRIORITY_LABELS[taskA.priority]}</span>
          <span class="overlap-task-date">${formatDate(taskA.start)} → ${formatDate(taskA.end)}</span>
        </div>
      </div>
      <div class="overlap-arrow">
        ⟷
        <span>conflict</span>
      </div>
      <div class="overlap-task">
        <span class="overlap-task-name">${esc(taskB.name)}</span>
        <div class="overlap-task-meta">
          <span class="badge-priority priority-${taskB.priority}">${PRIORITY_LABELS[taskB.priority]}</span>
          <span class="overlap-task-date">${formatDate(taskB.start)} → ${formatDate(taskB.end)}</span>
        </div>
      </div>`;
    frag.appendChild(card);
  });
  grid.innerHTML = '';
  grid.appendChild(frag);
}

// ─── SORT LISTENER ────────────────────────────────────────────────────────────

document.getElementById('th-start').addEventListener('click', () => {
  sortDir = (sortDir === 'asc') ? 'desc' : 'asc';
  const th   = document.getElementById('th-start');
  const icon = document.getElementById('sort-icon');
  th.classList.toggle('asc',  sortDir === 'asc');
  th.classList.toggle('desc', sortDir === 'desc');
  icon.textContent = sortDir === 'asc' ? '↑' : '↓';
  renderTable();
});

// ─── GROUP TOGGLE ─────────────────────────────────────────────────────────────

document.getElementById('btn-group-toggle').addEventListener('click', () => {
  groupByPriority = !groupByPriority;
  document.getElementById('btn-group-toggle').classList.toggle('active', groupByPriority);
  renderTable();
});

// ─── DELETE MODAL ─────────────────────────────────────────────────────────────

document.getElementById('modal-cancel').addEventListener('click', () => {
  pendingDelete = null;
  modalOverlay.classList.add('hidden');
});

document.getElementById('modal-confirm').addEventListener('click', () => {
  if (pendingDelete !== null) {
    tasks.splice(pendingDelete, 1);
    renderTable();
    updateStats();
    showToast('Task deleted.', 'info');
    pendingDelete = null;
  }
  modalOverlay.classList.add('hidden');
});

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) {
    pendingDelete = null;
    modalOverlay.classList.add('hidden');
  }
});

// ─── TOAST ────────────────────────────────────────────────────────────────────

let toastTimer;
function showToast(msg, type = 'info') {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.className   = `toast ${type} show`;
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ─── BACKGROUND CANVAS ───────────────────────────────────────────────────────

(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(56,189,248,0.18)';
    for (let x = 0; x < W; x += 40)
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
      }
  }
  resize(); draw();
  window.addEventListener('resize', () => { resize(); draw(); });
})();


// ─── POINT 4 — MEMORY USAGE ESTIMATOR ────────────────────────────────────────
/**
 * Estimates the in-memory footprint of the tasks array in bytes.
 *
 * JS string cost: 2 bytes per UTF-16 code unit (+ ~40B object overhead).
 * Per task fixed fields (urgency, impact, priority): 3 numbers × 8B = 24B.
 *
 * @param  {Task[]} arr
 * @returns {{ bytes: number, kb: string, breakdown: object }}
 */
function estimateMemoryUsage(arr) {
  const OBJECT_OVERHEAD  = 40;   // bytes — V8 plain object base cost
  const BYTES_PER_CHAR   = 2;    // UTF-16
  const BYTES_PER_NUMBER = 8;    // 64-bit float (JS number)
  const NUMBER_FIELDS    = 3;    // urgency, impact, priority

  let total = 0;

  for (const task of arr) {
    // Fixed numeric fields
    total += NUMBER_FIELDS * BYTES_PER_NUMBER;

    // String fields — proportional to actual content length
    total += (task.id    || '').length * BYTES_PER_CHAR;
    total += (task.name  || '').length * BYTES_PER_CHAR;
    total += (task.start || '').length * BYTES_PER_CHAR;
    total += (task.end   || '').length * BYTES_PER_CHAR;
    total += (task.state || '').length * BYTES_PER_CHAR;

    // Object overhead
    total += OBJECT_OVERHEAD;
  }

  // Array reference overhead (pointer per slot)
  total += arr.length * 8;

  return {
    bytes: total,
    kb:    (total / 1024).toFixed(2) + ' KB',
    breakdown: {
      taskCount:    arr.length,
      bytesPerTask: arr.length > 0 ? Math.round(total / arr.length) : 0,
      totalBytes:   total,
    },
  };
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

renderTable();
updateStats();
showView('list');
