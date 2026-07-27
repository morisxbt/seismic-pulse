/**
 * Seismic Pulse — script.js
 * Ambil data/digest.json, render ke halaman. Semua keputusan konten
 * udah diputusin di n8n — ini cuma juru bicara.
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
  } catch { return iso; }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function renderDigest(data) {
  // Waktu update terakhir
  const metaVal = document.querySelector('#last-updated .meta-value');
  if (metaVal) {
    metaVal.textContent = data.generatedAt
      ? formatDate(data.generatedAt)
      : 'Belum ada data update.';
  }

  // Signal stats di hero
  const sigDocs  = document.getElementById('sig-docs');
  const sigPosts = document.getElementById('sig-posts');
  const sigRepos = document.getElementById('sig-repos');
  if (sigDocs)  sigDocs.textContent  = data.docs?.changed ? 'UPDATED' : 'STABLE';
  if (sigPosts) sigPosts.textContent = (data.ecosystemPosts?.length || 0) + ' posts';
  if (sigRepos) sigRepos.textContent = (data.github?.length || 0) + ' repos';

  // ── Digest cards ──
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
    ${docs.changedPages?.length
      ? `<ul class="mini-list">${docs.changedPages.map(p => `<li><code>${escapeHtml(p)}</code></li>`).join('')}</ul>`
      : ''}
  `;
  grid.appendChild(docsCard);

  const repos = data.github || [];
  const githubCard = document.createElement('article');
  githubCard.className = 'card';
  const repoHtml = repos.length
    ? repos.map(r => `
        <li>
          <a href="${escapeHtml(r.url || '#')}" target="_blank" rel="noopener">${escapeHtml(r.repo || '(repo)')}</a>
          <span class="repo-pushed">${formatDate(r.pushedAt)}</span>
        </li>`).join('')
    : '<li class="list-placeholder">Belum ada data aktivitas GitHub.</li>';
  githubCard.innerHTML = `
    <span class="card-tag tag-social">GitHub</span>
    <h3>Aktivitas GitHub · SeismicSystems</h3>
    <ul class="repo-list">${repoHtml}</ul>
  `;
  grid.appendChild(githubCard);

  // ── Ekosistem ──
  const ecoList  = document.getElementById('ecosystem-list');
  const ecoPosts = data.ecosystemPosts || data.posts || [];
  ecoList.innerHTML = '';
  if (ecoPosts.length) {
    ecoPosts.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="eco-tag" title="${escapeHtml(p.project || 'Seismic')}">${escapeHtml(p.project || 'Seismic')}</span>
        <span class="eco-body">
          <a href="${escapeHtml(p.url || '#')}" target="_blank" rel="noopener">${escapeHtml(p.text || '(tanpa teks)')}</a>
          <span class="eco-date">${formatDate(p.date)}</span>
        </span>
      `;
      ecoList.appendChild(li);
    });
  } else {
    ecoList.innerHTML = '<li class="list-placeholder">Belum ada post baru terdeteksi.</li>';
  }

  // ── Riwayat ──
  const archiveList = document.getElementById('archive-list');
  const history = data.history || [];
  archiveList.innerHTML = '';
  if (history.length) {
    history.forEach(entry => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="archive-week">${escapeHtml(entry.periodLabel || entry.weekLabel || '')}</span>
        <span class="archive-summary">${escapeHtml(entry.summary || '')}</span>
      `;
      archiveList.appendChild(li);
    });
  } else {
    archiveList.innerHTML = '<li class="list-placeholder">Riwayat bakal keisi otomatis setelah workflow n8n jalan beberapa hari.</li>';
  }

  renderPulses(history.length + 1);
}

function renderFallback() {
  const metaVal = document.querySelector('#last-updated .meta-value');
  if (metaVal) metaVal.textContent = 'Jalanin dulu workflow n8n-nya (lihat README).';

  document.getElementById('digest-grid').innerHTML =
    '<p class="list-placeholder">data/digest.json belum ketemu atau belum pernah ditulis oleh n8n.</p>';
  document.getElementById('ecosystem-list').innerHTML =
    '<li class="list-placeholder">Belum ada data ekosistem.</li>';

  const sigDocs  = document.getElementById('sig-docs');
  const sigPosts = document.getElementById('sig-posts');
  const sigRepos = document.getElementById('sig-repos');
  if (sigDocs)  sigDocs.textContent  = '—';
  if (sigPosts) sigPosts.textContent = '—';
  if (sigRepos) sigRepos.textContent = '—';

  renderPulses(1);
}

function renderPulses(count) {
  const g = document.getElementById('waveform-pulses');
  if (!g) return;
  g.innerHTML = '';
  const total = Math.max(1, Math.min(count, 8));
  const spacing = 600 / (total + 1);
  for (let i = 1; i <= total; i++) {
    const cx = spacing * i;
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', cx.toFixed(1));
    dot.setAttribute('cy', '70');
    dot.setAttribute('r', '5');
    dot.setAttribute('class', 'pulse-dot');
    dot.style.animationDelay = `${i * 0.35}s`;
    g.appendChild(dot);
  }
}

document.addEventListener('DOMContentLoaded', loadDigest);
