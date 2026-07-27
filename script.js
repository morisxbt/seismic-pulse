/**
 * Seismic Pulse — script.js
 *
 * Tugas file ini cuma satu: ambil data/digest.json (yang diperbarui otomatis
 * sama workflow n8n tiap hari) terus render ke halaman. Ga ada logika
 * "mikir" di sini — semua keputusan (docs berubah atau ngga, post apa aja
 * yang dipajang, repo mana yang aktif) udah diputusin di n8n. Ini cuma
 * juru bicara.
 *
 * Catatan kompatibilitas: skema data sempat berubah (dari mingguan/1-akun
 * ke harian/multi-ekosistem). Fungsi di bawah baca field baru dulu,
 * fallback ke field lama, biar ga rusak pas transisi.
 */

async function loadDigest() {
  try {
    const res = await fetch('data/digest.json', { cache: 'no-store' });
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

  // --- Kartu: Update Dokumentasi + Aktivitas GitHub ---
  const grid = document.getElementById('digest-grid');
  grid.innerHTML = '';

  const docs = data.docs || {};
  const docsCard = document.createElement('article');
  docsCard.className = 'card';
  docsCard.innerHTML = `
    <span class="card-tag ${docs.changed ? 'tag-live' : 'tag-quiet'}">
      ${docs.changed ? 'Docs Berubah' : 'Docs Tenang'}
    </span>
    <h3>Update Dokumentasi</h3>
    <p>${escapeHtml(docs.summary || 'Belum ada ringkasan.')}</p>
    ${
      docs.changedPages && docs.changedPages.length
        ? `<ul class="mini-list">${docs.changedPages
            .map((p) => `<li><code>${escapeHtml(p)}</code></li>`)
            .join('')}</ul>`
        : ''
    }
  `;
  grid.appendChild(docsCard);

  const repos = data.github || [];
  const githubCard = document.createElement('article');
  githubCard.className = 'card';
  const repoHtml = repos.length
    ? repos
        .map(
          (r) => `
      <li>
        <a href="${escapeHtml(r.url || '#')}" target="_blank" rel="noopener">${escapeHtml(r.repo || '(repo)')}</a>
        <span class="repo-pushed">${formatDate(r.pushedAt)}</span>
      </li>`
        )
        .join('')
    : '<li class="muted">Belum ada data aktivitas GitHub.</li>';
  githubCard.innerHTML = `
    <span class="card-tag tag-social">GitHub</span>
    <h3>Aktivitas GitHub (SeismicSystems)</h3>
    <ul class="repo-list">${repoHtml}</ul>
  `;
  grid.appendChild(githubCard);

  // --- Sorotan Ekosistem (post dari @SeismicSys + proyek ekosistem) ---
  const ecoList = document.getElementById('ecosystem-list');
  const ecoPosts = data.ecosystemPosts || data.posts || []; // fallback ke skema lama
  ecoList.innerHTML = '';
  if (ecoPosts.length) {
    ecoPosts.forEach((p) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="eco-tag">${escapeHtml(p.project || 'Seismic')}</span>
        <span class="eco-body">
          <a href="${escapeHtml(p.url || '#')}" target="_blank" rel="noopener">${escapeHtml(p.text || '(tanpa teks)')}</a>
          <span class="eco-date">${formatDate(p.date)}</span>
        </span>
      `;
      ecoList.appendChild(li);
    });
  } else {
    ecoList.innerHTML = '<li class="muted">Belum ada post baru terdeteksi.</li>';
  }

  // --- Riwayat sebelumnya ---
  const archiveList = document.getElementById('archive-list');
  const history = data.history || [];
  archiveList.innerHTML = '';
  if (history.length) {
    history.forEach((entry) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="archive-week">${escapeHtml(entry.periodLabel || entry.weekLabel || '')}</span>
        <span class="archive-summary">${escapeHtml(entry.summary || '')}</span>
      `;
      archiveList.appendChild(li);
    });
  } else {
    archiveList.innerHTML =
      '<li class="muted">Riwayat bakal keisi otomatis setelah workflow n8n jalan beberapa hari.</li>';
  }

  renderPulses(history.length + 1);
}

function renderFallback() {
  document.getElementById('last-updated').textContent =
    'Belum ada data digest — jalanin dulu workflow n8n-nya (lihat README).';
  document.getElementById('digest-grid').innerHTML =
    '<p class="muted">data/digest.json belum ketemu, formatnya salah, atau belum pernah ditulis sama n8n.</p>';
  document.getElementById('ecosystem-list').innerHTML =
    '<li class="muted">Belum ada data ekosistem.</li>';
  renderPulses(1);
}

function renderPulses(count) {
  const g = document.getElementById('waveform-pulses');
  if (!g) return;
  g.innerHTML = '';
  const total = Math.max(1, Math.min(count, 8)); // biar ga numpuk kalau riwayat udah panjang
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
