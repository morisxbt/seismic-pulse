/**
 * Seismic Pulse — script.js
 *
 * Tugas file ini cuma satu: ambil digest.json (yang diperbarui otomatis
 * sama workflow n8n tiap minggu) terus render ke halaman. Ga ada logika
 * "mikir" di sini — semua keputusan (docs berubah atau ngga, post apa aja
 * yang dipajang) udah diputusin di n8n. Ini cuma juru bicara.
 */

async function loadDigest() {
  try {
    const res = await fetch('digest.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('digest.json tidak ditemukan (status ' + res.status + ')');
    const data = await res.json();
    renderDigest(data);
  } catch (err) {
    console.error('[Seismic Pulse] gagal memuat digest:', err);
    renderFallback();
  }
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function renderDigest(data) {
  // --- Waktu update terakhir ---
  const lastUpdatedEl = document.getElementById('last-updated');
  lastUpdatedEl.textContent = data.generatedAt
    ? `Terakhir diperbarui otomatis: ${formatDate(data.generatedAt)}`
    : 'Belum ada waktu update tercatat.';

  // --- Kartu digest minggu ini ---
  const grid = document.getElementById('digest-grid');
  grid.innerHTML = '';

  // Kartu 1: update docs
  const docs = data.docs || {};
  const docsCard = document.createElement('article');
  docsCard.className = 'card';
  docsCard.innerHTML = `
    <span class="card-tag ${docs.changed ? 'tag-live' : 'tag-quiet'}">
      ${docs.changed ? 'Docs Berubah' : 'Docs Tenang'}
    </span>
    <h3>Update Dokumentasi</h3>
    <p>${escapeHtml(docs.summary || 'Belum ada ringkasan minggu ini.')}</p>
    ${
      docs.changedPages && docs.changedPages.length
        ? `<ul class="mini-list">${docs.changedPages
            .map((p) => `<li><code>${escapeHtml(p)}</code></li>`)
            .join('')}</ul>`
        : ''
    }
  `;
  grid.appendChild(docsCard);

  // Kartu 2: post X terbaru
  const posts = data.posts || [];
  const postsCard = document.createElement('article');
  postsCard.className = 'card';
  const postsHtml = posts.length
    ? posts
        .map(
          (p) => `
      <li>
        <a href="${escapeHtml(p.url || '#')}" target="_blank" rel="noopener">${escapeHtml(p.text || '(tanpa teks)')}</a>
        <span class="post-date">${formatDate(p.date)}</span>
      </li>`
        )
        .join('')
    : '<li class="muted">Belum ada post baru dari @SeismicSys minggu ini.</li>';
  postsCard.innerHTML = `
    <span class="card-tag tag-social">Dari X</span>
    <h3>Post Terbaru @SeismicSys</h3>
    <ul class="post-list">${postsHtml}</ul>
  `;
  grid.appendChild(postsCard);

  // --- Arsip minggu lalu ---
  const archiveList = document.getElementById('archive-list');
  const history = data.history || [];
  archiveList.innerHTML = '';
  if (history.length) {
    history.forEach((week) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="archive-week">${escapeHtml(week.weekLabel || '')}</span>
        <span class="archive-summary">${escapeHtml(week.summary || '')}</span>
      `;
      archiveList.appendChild(li);
    });
  } else {
    archiveList.innerHTML =
      '<li class="muted">Arsip bakal keisi otomatis setelah workflow n8n jalan beberapa minggu.</li>';
  }

  renderPulses(history.length + 1);
}

function renderFallback() {
  document.getElementById('last-updated').textContent =
    'Belum ada data digest — jalanin dulu workflow n8n-nya (lihat README).';
  document.getElementById('digest-grid').innerHTML =
    '<p class="muted">digest.json belum ketemu, formatnya salah, atau belum pernah ditulis sama n8n.</p>';
  renderPulses(1);
}

function renderPulses(count) {
  const g = document.getElementById('waveform-pulses');
  if (!g) return;
  g.innerHTML = '';
  const total = Math.max(1, Math.min(count, 8)); // biar ga numpuk kalau arsip udah panjang
  const spacing = 1000 / (total + 1);
  for (let i = 1; i <= total; i++) {
    const cx = spacing * i;
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', cx.toFixed(1));
    dot.setAttribute('cy', '60');
    dot.setAttribute('r', '5');
    dot.setAttribute('class', 'pulse-dot');
    dot.style.animationDelay = `${i * 0.3}s`;
    g.appendChild(dot);
  }
}

document.addEventListener('DOMContentLoaded', loadDigest);
