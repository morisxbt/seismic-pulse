const translations = {
  id: {
    eyebrow: 'LIVE · OTOMATIS · HARIAN',
    metaLabel: 'UPDATE TERAKHIR',
    ctaToday: 'Lihat Update Hari Ini',
    sectionTodayTitle: 'Apa yang berubah hari ini',
    sectionOfficialTitle: 'Dari akun resmi Seismic',
    sectionOfficialDesc: 'Post langsung dari @SeismicSys — dipisah dari CEO dan ekosistem.',
    sectionLeadershipTitle: 'Dari Lyron (CEO)',
    sectionLeadershipDesc: 'Post pribadi Lyron Co Ting Keh, CEO & Founder Seismic.',
    sectionEcosystemTitle: 'Post terbaru dari proyek ekosistem',
    sectionEcosystemDesc: '15 proyek yang dibangun di atas Seismic — dipisah dari akun resmi & CEO.',
    sectionExplainerTitle: 'Buat yang baru denger Seismic',
    explainerText1: 'Seismic itu blockchain EVM yang privasinya bawaan, bukan tempelan belakangan. Kamu tetap nulis Solidity, deploy pakai Foundry — semua workflow sama. Tapi ada satu perubahan kecil di tipe data yang efeknya gede ke seluruh sistem.',
    explainerText2: 'Di atasnya tumbuh ekosistem aplikasi finansial — Brookwell, DashX, Prism — yang butuh privasi ini untuk data keuangan yang sensitif.',
    codeNoteA: 'Saldo keliatan semua orang',
    codeNoteB: 'Cuma pemiliknya yang tau saldonya',
    sectionArchiveTitle: 'Update sebelumnya',
    archiveEmpty: 'Riwayat bakal keisi otomatis setelah workflow n8n jalan beberapa hari.',
    footerDisclaimer: 'Proyek komunitas independen — bukan situs resmi Seismic Systems Inc.',
    footerCredit: 'Dibangun sekali, diperbarui otomatis tiap hari via n8n.',
    translateLabel: 'Translate',
    docsChanged: 'Docs Berubah',
    docsQuiet: 'Docs Tenang',
    docsHeading: 'Update Dokumentasi',
    docsEmpty: 'Belum ada ringkasan.',
    githubHeading: 'Aktivitas GitHub · SeismicSystems',
    githubEmpty: 'Belum ada data aktivitas GitHub.',
    repoMessageMissing: '(belum ada pesan commit — jalanin ulang workflow n8n versi terbaru)',
    emptyGeneric: 'Belum ada post baru terdeteksi.',
    emptyOfficial: 'Belum ada post baru dari @SeismicSys.',
    emptyLeadership: 'Belum ada post baru dari Lyron.',
    lastUpdatedEmpty: 'Belum ada data update.',
    lastUpdatedFallback: 'Jalanin dulu workflow n8n-nya (lihat README).'
  },
  en: {
    eyebrow: 'LIVE · AUTOMATED · DAILY',
    metaLabel: 'LAST UPDATE',
    ctaToday: "See Today's Update",
    sectionTodayTitle: "What changed today",
    sectionOfficialTitle: 'From the official Seismic account',
    sectionOfficialDesc: 'Posts directly from @SeismicSys — separated from the CEO and ecosystem.',
    sectionLeadershipTitle: 'From Lyron (CEO)',
    sectionLeadershipDesc: 'Personal posts from Lyron Co Ting Keh, CEO & Founder of Seismic.',
    sectionEcosystemTitle: 'Latest posts from ecosystem projects',
    sectionEcosystemDesc: '15 projects built on top of Seismic — kept separate from the official account & CEO.',
    sectionExplainerTitle: 'New to Seismic?',
    explainerText1: 'Seismic is an EVM blockchain with privacy built in, not bolted on. You still write Solidity, deploy with Foundry — same workflow as always. But one small change to a data type changes everything downstream.',
    explainerText2: 'On top of it, a financial app ecosystem is growing — Brookwell, DashX, Prism among others — that needs this privacy for sensitive financial data.',
    codeNoteA: 'Balance visible to everyone',
    codeNoteB: 'Only the owner knows the balance',
    sectionArchiveTitle: 'Previous updates',
    archiveEmpty: 'History will fill in automatically once the n8n workflow has run for a few days.',
    footerDisclaimer: 'Independent community project — not an official site of Seismic Systems Inc.',
    footerCredit: 'Built once, updated automatically every day via n8n.',
    translateLabel: 'Translate',
    docsChanged: 'Docs Changed',
    docsQuiet: 'Docs Quiet',
    docsHeading: 'Documentation Update',
    docsEmpty: 'No summary yet.',
    githubHeading: 'GitHub Activity · SeismicSystems',
    githubEmpty: 'No GitHub activity data yet.',
    repoMessageMissing: '(no commit message yet — re-run the latest n8n workflow)',
    emptyGeneric: 'No new posts detected yet.',
    emptyOfficial: 'No new posts from @SeismicSys yet.',
    emptyLeadership: 'No new posts from Lyron yet.',
    lastUpdatedEmpty: 'No update data yet.',
    lastUpdatedFallback: 'Run the n8n workflow first (see README).'
  }
};

let currentLang = localStorage.getItem('seismicPulseLang') || 'id';
let latestDigest = null;

// Label & ikon buat tipe commit (dari parsing "tipe(bagian): pesan" di n8n).
// Dipisah dari `translations` di atas biar gampang nambah tipe baru.
const commitTypeMeta = {
  id: {
    feat: { icon: '✨', label: 'Fitur baru' },
    fix: { icon: '🐛', label: 'Perbaikan' },
    docs: { icon: '📝', label: 'Dokumentasi' },
    chore: { icon: '🔧', label: 'Perawatan' },
    refactor: { icon: '♻️', label: 'Rapihin kode' },
    perf: { icon: '⚡', label: 'Optimasi' },
    test: { icon: '✅', label: 'Pengujian' },
    build: { icon: '📦', label: 'Build/dependency' },
    ci: { icon: '⚙️', label: 'CI/pipeline' },
    style: { icon: '💅', label: 'Format kode' },
    revert: { icon: '⏪', label: 'Pembatalan' },
    other: { icon: '🔨', label: 'Update kode' }
  },
  en: {
    feat: { icon: '✨', label: 'New feature' },
    fix: { icon: '🐛', label: 'Bug fix' },
    docs: { icon: '📝', label: 'Documentation' },
    chore: { icon: '🔧', label: 'Maintenance' },
    refactor: { icon: '♻️', label: 'Refactor' },
    perf: { icon: '⚡', label: 'Performance' },
    test: { icon: '✅', label: 'Testing' },
    build: { icon: '📦', label: 'Build/deps' },
    ci: { icon: '⚙️', label: 'CI/pipeline' },
    style: { icon: '💅', label: 'Code style' },
    revert: { icon: '⏪', label: 'Revert' },
    other: { icon: '🔨', label: 'Code update' }
  }
};

function commitTypeInfo(type) {
  const dict = commitTypeMeta[currentLang] || commitTypeMeta.id;
  return dict[type] || dict.other;
}

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || translations.id[key] || key;
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang] && translations[currentLang][key] != null) {
      el.innerHTML = translations[currentLang][key];
    }
  });
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('seismicPulseLang', lang);
  applyStaticTranslations();
  if (latestDigest) renderDigest(latestDigest);
}

// ============================================================
// 2. Google Translate — nerjemahin SELURUH halaman ke bahasa apapun
//    (termasuk post X & pesan commit yang aslinya bahasa Inggris)
// ============================================================

function initGoogleTranslate() {
  window.googleTranslateElementInit = function () {
    // eslint-disable-next-line no-undef
    new google.translate.TranslateElement(
      { pageLanguage: 'id', autoDisplay: false },
      'google_translate_element'
    );
  };
  const script = document.createElement('script');
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.head.appendChild(script);
}

function setupTranslateToggle() {
  const btn = document.getElementById('translate-toggle');
  const box = document.getElementById('google_translate_element');
  if (!btn || !box) return;
  btn.addEventListener('click', () => box.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!box.contains(e.target) && e.target !== btn) box.classList.remove('open');
  });
}

// ============================================================
// 3. Ambil & render digest.json
// ============================================================

// Deskripsi singkat "ini bagian apa dari Seismic" buat repo-repo yang
// sering muncul di aktivitas GitHub. Kalau repo baru ga ada di daftar
// ini, kartu-nya tetep tampil normal, cuma tanpa baris deskripsi.
const repoDescriptions = {
  'seismic-reth': 'Klien eksekusi node Seismic (fork dari Reth) — bagian yang mroses transaksi & state blockchain.',
  'seismic-revm': 'Implementasi EVM yang ditambahin fitur privasi (tipe data suint dkk).',
  'seismic-evm': 'Bagian EVM Seismic — mesin yang jalanin smart contract dengan tipe data privat.',
  'summit': 'Klien consensus Seismic — bagian yang bikin node-node sepakat soal urutan blok.',
  'enclave': 'Komponen secure enclave (TEE) — tempat data sensitif diproses tanpa kebuka ke publik.',
  'seismic': 'Repo inti protokol Seismic.',
  'seismic-solidity': 'Library Solidity buat nulis smart contract dengan tipe data privat (suint, dst).',
  'seismic-foundry': 'Fork toolkit Foundry yang dukung development dengan tipe data privat Seismic.',
  'tdx-init': 'Setup awal buat hardware secure enclave (Intel TDX).',
  'seismic-images': 'Container/image buat jalanin infrastruktur Seismic.',
  'faucet': 'Faucet testnet — tempat dapetin token buat coba-coba di jaringan uji.',
  'deploy': 'Script & config buat deploy infrastruktur Seismic.',
  'seismic-starter': 'Template starter buat mulai develop aplikasi di atas Seismic.'
};

function getRepoDescription(fullName) {
  if (!fullName) return '';
  const shortName = String(fullName).split('/').pop();
  return repoDescriptions[shortName] || '';
}

async function loadDigest() {
  try {
    const res = await fetch('data/digest.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('digest.json tidak ditemukan (status ' + res.status + ')');
    const data = await res.json();
    latestDigest = data;
    renderDigest(data);
  } catch (err) {
    console.error('[Seismic Pulse] gagal memuat digest:', err);
    renderFallback();
  }
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(currentLang === 'en' ? 'en-US' : 'id-ID', { dateStyle: 'medium', timeStyle: 'short' });
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
    metaVal.textContent = data.generatedAt ? formatDate(data.generatedAt) : t('lastUpdatedEmpty');
  }

  // Tren aktivitas (naik/turun dibanding kemarin)
  const trendEl = document.getElementById('hero-trend');
  if (trendEl) {
    const trend = data.trend || null;
    trendEl.classList.remove('trend-up', 'trend-down');
    if (trend && trend.changeLabel) {
      const arrow = trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '•';
      if (trend.direction === 'up') trendEl.classList.add('trend-up');
      if (trend.direction === 'down') trendEl.classList.add('trend-down');
      trendEl.textContent = `${arrow} ${trend.changeLabel}`;
    } else {
      trendEl.textContent = '';
    }
  }

  // Signal stats di hero — total post dari 3 bucket (Resmi + Lyron + Ekosistem)
  const totalPosts = (data.official?.length || 0) + (data.leadership?.length || 0) + (data.ecosystemPosts?.length || 0);
  const sigDocs  = document.getElementById('sig-docs');
  const sigPosts = document.getElementById('sig-posts');
  const sigRepos = document.getElementById('sig-repos');
  if (sigDocs)  sigDocs.textContent  = data.docs?.changed ? 'UPDATED' : 'STABLE';
  if (sigPosts) sigPosts.textContent = totalPosts + ' posts';
  if (sigRepos) sigRepos.textContent = (data.github?.length || 0) + ' repos';

  // ── Digest cards: Docs + GitHub ──
  const grid = document.getElementById('digest-grid');
  grid.innerHTML = '';

  const docs = data.docs || {};
  const docsCard = document.createElement('article');
  docsCard.className = 'card';
  docsCard.innerHTML = `
    <span class="card-tag ${docs.changed ? 'tag-live' : 'tag-quiet'}">
      ${docs.changed ? t('docsChanged') : t('docsQuiet')}
    </span>
    <h3>${t('docsHeading')}</h3>
    <p>${escapeHtml(docs.summary || t('docsEmpty'))}</p>
    ${docs.changedPages?.length
      ? `<ul class="mini-list">${docs.changedPages.map(p => `<li><code>${escapeHtml(p)}</code></li>`).join('')}</ul>`
      : ''}
  `;
  grid.appendChild(docsCard);

  // GitHub — sekarang nampilin pesan commit asli, bukan cuma nama repo
  const repos = data.github || [];
  const githubCard = document.createElement('article');
  githubCard.className = 'card';
  const repoHtml = repos.length
    ? repos.map(r => {
        const desc = getRepoDescription(r.repo);
        const meta = commitTypeInfo(r.type);
        const scopeLabel = r.scope ? ` <span class="repo-scope">· ${escapeHtml(r.scope)}</span>` : '';
        const summaryText = r.summary || r.message || '';
        return `
        <li>
          <div class="repo-top">
            <a href="${escapeHtml(r.url || '#')}" target="_blank" rel="noopener">${escapeHtml(r.repo || '(repo)')}</a>
            <span class="repo-pushed">${formatDate(r.date || r.pushedAt)}</span>
          </div>
          ${desc ? `<p class="repo-desc">${escapeHtml(desc)}</p>` : ''}
          <p class="repo-message${summaryText ? '' : ' repo-message-empty'}">
            <span class="repo-type">${meta.icon} ${escapeHtml(meta.label)}</span>${scopeLabel}${summaryText ? ' — ' + escapeHtml(summaryText) : ' ' + t('repoMessageMissing')}
          </p>
        </li>`;
      }).join('')
    : `<li class="list-placeholder">${t('githubEmpty')}</li>`;
  githubCard.innerHTML = `
    <span class="card-tag tag-social">GitHub</span>
    <h3>${t('githubHeading')}</h3>
    <ul class="repo-list">${repoHtml}</ul>
  `;
  grid.appendChild(githubCard);

  // ── Update Resmi (cuma @SeismicSys) ──
  const officialList = document.getElementById('official-list');
  const officialPosts = data.official || [];
  if (officialList) {
    officialList.innerHTML = officialPosts.length
      ? officialPosts.map(p => `
          <li>
            <span class="eco-tag" title="Seismic">Seismic</span>
            <span class="eco-body">
              <a href="${escapeHtml(p.url || '#')}" target="_blank" rel="noopener">${escapeHtml(p.text || '')}</a>
              <span class="eco-date">${formatDate(p.date)}</span>
            </span>
          </li>`).join('')
      : `<li class="list-placeholder">${t('emptyOfficial')}</li>`;
  }

  // ── Dari Lyron (CEO) — kepisah dari 15 proyek ekosistem ──
  const leadershipList = document.getElementById('leadership-list');
  const leadershipPosts = data.leadership || [];
  if (leadershipList) {
    leadershipList.innerHTML = leadershipPosts.length
      ? leadershipPosts.map(p => `
          <li>
            <span class="eco-tag" title="Lyron">Lyron</span>
            <span class="eco-body">
              <a href="${escapeHtml(p.url || '#')}" target="_blank" rel="noopener">${escapeHtml(p.text || '')}</a>
              <span class="eco-date">${formatDate(p.date)}</span>
            </span>
          </li>`).join('')
      : `<li class="list-placeholder">${t('emptyLeadership')}</li>`;
  }

  // ── Sorotan Ekosistem (15 proyek partner) ──
  const ecoList  = document.getElementById('ecosystem-list');
  const ecoPosts = data.ecosystemPosts || data.posts || [];
  ecoList.innerHTML = '';
  if (ecoPosts.length) {
    ecoPosts.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="eco-tag" title="${escapeHtml(p.project || 'Ecosystem')}">${escapeHtml(p.project || 'Ecosystem')}</span>
        <span class="eco-body">
          <a href="${escapeHtml(p.url || '#')}" target="_blank" rel="noopener">${escapeHtml(p.text || '(tanpa teks)')}</a>
          <span class="eco-date">${formatDate(p.date)}</span>
        </span>
      `;
      ecoList.appendChild(li);
    });
  } else {
    ecoList.innerHTML = `<li class="list-placeholder">${t('emptyGeneric')}</li>`;
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
    archiveList.innerHTML = `<li class="list-placeholder">${t('archiveEmpty')}</li>`;
  }

  renderPulses(history.length + 1);

  // biar script inline (kalau ada) tetep bisa dengerin event ini juga
  document.dispatchEvent(new CustomEvent('digest-rendered', { detail: data }));
}

function renderFallback() {
  const metaVal = document.querySelector('#last-updated .meta-value');
  if (metaVal) metaVal.textContent = t('lastUpdatedFallback');
  const trendEl = document.getElementById('hero-trend');
  if (trendEl) { trendEl.textContent = ''; trendEl.classList.remove('trend-up', 'trend-down'); }

  document.getElementById('digest-grid').innerHTML =
    '<p class="list-placeholder">data/digest.json belum ketemu atau belum pernah ditulis oleh n8n.</p>';
  document.getElementById('ecosystem-list').innerHTML = `<li class="list-placeholder">${t('emptyGeneric')}</li>`;
  const officialList = document.getElementById('official-list');
  const leadershipList = document.getElementById('leadership-list');
  if (officialList) officialList.innerHTML = `<li class="list-placeholder">${t('emptyOfficial')}</li>`;
  if (leadershipList) leadershipList.innerHTML = `<li class="list-placeholder">${t('emptyLeadership')}</li>`;

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

// ============================================================
// 4. Init
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  applyStaticTranslations();
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  setupTranslateToggle();
  initGoogleTranslate();
  loadDigest();
});
