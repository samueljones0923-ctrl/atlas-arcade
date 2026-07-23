(() => {
  'use strict';

  const DATA = window.ATLAS_DATA;
  if (!DATA) {
    document.body.innerHTML = '<p style="padding:2rem;font-family:system-ui">Map data failed to load.</p>';
    return;
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const STORAGE_KEY = 'atlasArcadeProgressV1';
  const SETTINGS_KEY = 'atlasArcadeSettingsV1';
  const CONFIG = Object.freeze({
    supabaseUrl: '',
    supabasePublishableKey: '',
    leaderboardEnabled: false,
    accountsEnabled: false,
    siteUrl: '',
    ...(window.ATLAS_CONFIG || {})
  });
  const SUPABASE_JS_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.106.2/dist/umd/supabase.min.js';
  const SPRINT_VERSION = 2;
  const SPRINT_PENALTY_SECONDS = 2;
  const MAX_MAP_SCALE = 24;
  const COMPETITIVE_COUNTDOWN_STEPS = ['3', '2', '1', 'GO'];
  const MAP_ANSWER_MODES = new Set(['locate', 'capitals', 'flags']);
  const FLAG_COLUMNS = 14;
  const FLAG_ROWS = 15;
  const countries = DATA.countries;
  const byIso = new Map(countries.map(country => [country.iso2, country]));
  const byIso3 = new Map(countries.map(country => [country.iso3, country]));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  countries.forEach((country, index) => { country.flagIndex = index; });

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  const el = {
    body: document.body,
    html: document.documentElement,
    brandButton: $('#brandButton'),
    playNav: $('#playNav'),
    studyNav: $('#studyNav'),
    leaderboardNav: $('#leaderboardNav'),
    statsNav: $('#statsNav'),
    gamePanel: $('#gamePanel'),
    studyPanel: $('#studyPanel'),
    modeChip: $('#modeChip'),
    newGameButton: $('#newGameButton'),
    missionPanel: $('#missionPanel'),
    missionCollapseButton: $('#missionCollapseButton'),
    sprintBadge: $('#sprintBadge'),
    sprintBest: $('#sprintBest'),
    questionLabel: $('#questionLabel'),
    scoreLabel: $('#scoreLabel'),
    streakLabel: $('#streakLabel'),
    questionStat: $('#questionStat'),
    scoreStat: $('#scoreStat'),
    streakStat: $('#streakStat'),
    timeLabel: $('#timeLabel'),
    timeStat: $('#timeStat'),
    promptLead: $('#promptLead'),
    promptText: $('#promptText'),
    promptMeta: $('#promptMeta'),
    flagPrompt: $('#flagPrompt'),
    reverseForm: $('#reverseForm'),
    reverseInput: $('#reverseInput'),
    spellForm: $('#spellForm'),
    spellInput: $('#spellInput'),
    spellCount: $('#spellCount'),
    spellRemaining: $('#spellRemaining'),
    spellMeter: $('#spellMeter'),
    spellRecent: $('#spellRecent'),
    keyboardAnswer: $('#keyboardAnswer'),
    countryAnswerSelect: $('#countryAnswerSelect'),
    countryAnswerButton: $('#countryAnswerButton'),
    hintButton: $('#hintButton'),
    hintCost: $('#hintCost'),
    skipButton: $('#skipButton'),
    hintBox: $('#hintBox'),
    hintText: $('#hintText'),
    feedback: $('#feedback'),
    feedbackText: $('#feedbackText'),
    accuracyMeter: $('#accuracyMeter'),
    accuracyStat: $('#accuracyStat'),
    lastCountryCard: $('#lastCountryCard'),
    lastFlag: $('#lastFlag'),
    lastCountryName: $('#lastCountryName'),
    lastCapital: $('#lastCapital'),
    lastRegion: $('#lastRegion'),
    lastArea: $('#lastArea'),
    lastNeighbors: $('#lastNeighbors'),
    lastCapitalNote: $('#lastCapitalNote'),
    headerRunPill: $('#headerRunPill'),
    headerMode: $('#headerMode'),
    headerScore: $('#headerScore'),
    accountButton: $('#accountButton'),
    accountButtonLabel: $('#accountButtonLabel'),
    installButton: $('#installButton'),
    soundToggle: $('#soundToggle'),
    themeToggle: $('#themeToggle'),
    fullscreenToggle: $('#fullscreenToggle'),
    helpButton: $('#helpButton'),
    worldMap: $('#worldMap'),
    mapViewport: $('#mapViewport'),
    graticuleLayer: $('#graticuleLayer'),
    territoryLayer: $('#territoryLayer'),
    countryLayer: $('#countryLayer'),
    markerLayer: $('#markerLayer'),
    mapStage: $('#mapStage'),
    mobilePromptButton: $('#mobilePromptButton'),
    mobilePromptFlag: $('#mobilePromptFlag'),
    mobilePromptLead: $('#mobilePromptLead'),
    mobilePromptText: $('#mobilePromptText'),
    mobilePromptMeta: $('#mobilePromptMeta'),
    mapReticle: $('#mapReticle'),
    zoomReadout: $('#zoomReadout'),
    countdownOverlay: $('#countdownOverlay'),
    countdownValue: $('#countdownValue'),
    countdownLabel: $('#countdownLabel'),
    mapTooltip: $('#mapTooltip'),
    mapCallout: $('#mapCallout'),
    calloutFlag: $('#calloutFlag'),
    calloutName: $('#calloutName'),
    calloutMeta: $('#calloutMeta'),
    tinyCountryNote: $('#tinyCountryNote'),
    mapToolbarTitle: $('#mapToolbarTitle'),
    mapToolbarMeta: $('#mapToolbarMeta'),
    mapStatusDot: $('#mapStatusDot'),
    zoomOutButton: $('#zoomOutButton'),
    resetMapButton: $('#resetMapButton'),
    zoomInButton: $('#zoomInButton'),
    roundProgress: $('#roundProgress'),
    footerProgressText: $('#footerProgressText'),
    fitScopeButton: $('#fitScopeButton'),
    setupDialog: $('#setupDialog'),
    setupForm: $('#setupForm'),
    startGameButton: $('#startGameButton'),
    sprintInput: $('#sprintInput'),
    sprintChoice: $('#sprintChoice'),
    setupLockNote: $('#setupLockNote'),
    resultsDialog: $('#resultsDialog'),
    resultsClose: $('#resultsClose'),
    resultsEyebrow: $('#resultsEyebrow'),
    resultsTitle: $('#resultsTitle'),
    resultsSummary: $('#resultsSummary'),
    resultScore: $('#resultScore'),
    resultAccuracy: $('#resultAccuracy'),
    resultStreak: $('#resultStreak'),
    resultTime: $('#resultTime'),
    resultRank: $('#resultRank'),
    resultRankCopy: $('#resultRankCopy'),
    resultScoreLabel: $('#resultScoreLabel'),
    resultAccuracyLabel: $('#resultAccuracyLabel'),
    resultStreakLabel: $('#resultStreakLabel'),
    resultTimeLabel: $('#resultTimeLabel'),
    sprintResultCard: $('#sprintResultCard'),
    sprintOfficialTime: $('#sprintOfficialTime'),
    sprintRawTime: $('#sprintRawTime'),
    sprintMistakes: $('#sprintMistakes'),
    sprintPenalty: $('#sprintPenalty'),
    sprintResultMode: $('#sprintResultMode'),
    sprintSubmissionStatus: $('#sprintSubmissionStatus'),
    missedSection: $('#missedSection'),
    missedCount: $('#missedCount'),
    missedList: $('#missedList'),
    playAgainButton: $('#playAgainButton'),
    practiceMissedButton: $('#practiceMissedButton'),
    shareResultButton: $('#shareResultButton'),
    viewLeaderboardButton: $('#viewLeaderboardButton'),
    studyResultsButton: $('#studyResultsButton'),
    leaderboardDialog: $('#leaderboardDialog'),
    leaderboardClose: $('#leaderboardClose'),
    leaderboardModeTabs: $('#leaderboardModeTabs'),
    leaderboardStatus: $('#leaderboardStatus'),
    leaderboardRows: $('#leaderboardRows'),
    leaderboardScopeLabel: $('#leaderboardScopeLabel'),
    leaderboardPersonalBest: $('#leaderboardPersonalBest'),
    leaderboardBestTime: $('#leaderboardBestTime'),
    leaderboardBestMeta: $('#leaderboardBestMeta'),
    playerNameInput: $('#playerNameInput'),
    savePlayerNameButton: $('#savePlayerNameButton'),
    startSprintButton: $('#startSprintButton'),
    refreshLeaderboardButton: $('#refreshLeaderboardButton'),
    accountDialog: $('#accountDialog'),
    accountClose: $('#accountClose'),
    accountGuestView: $('#accountGuestView'),
    accountMemberView: $('#accountMemberView'),
    accountTabs: $('#accountTabs'),
    accountSignInForm: $('#accountSignInForm'),
    accountSignInEmail: $('#accountSignInEmail'),
    accountSignInPassword: $('#accountSignInPassword'),
    accountCreateForm: $('#accountCreateForm'),
    accountCreateName: $('#accountCreateName'),
    accountCreateEmail: $('#accountCreateEmail'),
    accountCreatePassword: $('#accountCreatePassword'),
    accountForgotButton: $('#accountForgotButton'),
    accountEmail: $('#accountEmail'),
    accountDisplayName: $('#accountDisplayName'),
    accountSaveNameButton: $('#accountSaveNameButton'),
    accountSyncDot: $('#accountSyncDot'),
    accountSyncStatus: $('#accountSyncStatus'),
    accountSyncButton: $('#accountSyncButton'),
    accountRecoveryForm: $('#accountRecoveryForm'),
    accountNewPassword: $('#accountNewPassword'),
    accountSignOutButton: $('#accountSignOutButton'),
    accountStatus: $('#accountStatus'),
    statsStorageCopy: $('#statsStorageCopy'),
    statsDialog: $('#statsDialog'),
    statsClose: $('#statsClose'),
    statsGames: $('#statsGames'),
    statsSolved: $('#statsSolved'),
    statsAccuracy: $('#statsAccuracy'),
    statsBestStreak: $('#statsBestStreak'),
    statsSeen: $('#statsSeen'),
    statsMastered: $('#statsMastered'),
    worldMasteryLabel: $('#worldMasteryLabel'),
    worldMasteryMeter: $('#worldMasteryMeter'),
    worldMasteryCopy: $('#worldMasteryCopy'),
    weakList: $('#weakList'),
    practiceWeakButton: $('#practiceWeakButton'),
    achievementCount: $('#achievementCount'),
    achievementGrid: $('#achievementGrid'),
    modeProgressGrid: $('#modeProgressGrid'),
    recentRuns: $('#recentRuns'),
    exportStatsButton: $('#exportStatsButton'),
    resetStatsButton: $('#resetStatsButton'),
    helpDialog: $('#helpDialog'),
    helpClose: $('#helpClose'),
    studySearchForm: $('#studySearchForm'),
    studySearch: $('#studySearch'),
    countryDatalist: $('#countryDatalist'),
    studyFilters: $('#studyFilters'),
    randomCountryButton: $('#randomCountryButton'),
    studyPlaceholder: $('#studyPlaceholder'),
    studyDetails: $('#studyDetails'),
    studyFlag: $('#studyFlag'),
    studySubregion: $('#studySubregion'),
    studyName: $('#studyName'),
    favoriteButton: $('#favoriteButton'),
    studyCapital: $('#studyCapital'),
    studyArea: $('#studyArea'),
    studyGeography: $('#studyGeography'),
    studyBorders: $('#studyBorders'),
    studyMasteryLabel: $('#studyMasteryLabel'),
    studyMasteryMeter: $('#studyMasteryMeter'),
    studyMasteryText: $('#studyMasteryText'),
    studyCapitalNote: $('#studyCapitalNote'),
    practiceRegionButton: $('#practiceRegionButton'),
    focusCountryButton: $('#focusCountryButton'),
    toastRegion: $('#toastRegion'),
    confettiCanvas: $('#confettiCanvas')
  };

  const modeLabels = {
    locate: 'Locate',
    capitals: 'Capitals',
    flags: 'Flags',
    reverse: 'Map → Name',
    mixed: 'Mixed Mission',
    spelling: 'Spell All'
  };

  const achievements = [
    { id: 'first_step', icon: '⌖', name: 'First Footfall', copy: 'Solve your first country.' },
    { id: 'streak_10', icon: '↗', name: 'Ten in a Row', copy: 'Build a clean streak of 10.' },
    { id: 'clean_sweep', icon: '100', name: 'Clean Sweep', copy: 'Finish 10+ questions at 100% first-try accuracy.' },
    { id: 'lightning', icon: '⚡', name: 'Lightning Recall', copy: 'Solve a country in under three seconds with no hint.' },
    { id: 'globe_trotter', icon: '◎', name: 'Globe Trotter', copy: 'Solve at least one country on every continent.' },
    { id: 'micro_master', icon: '·', name: 'Micro Master', copy: 'Correctly solve 10 tiny countries or microstates.' }
  ];

  const scopeViews = {
    World: { scale: 1, x: 600, y: 310 },
    Africa: { scale: 2.15, x: 680, y: 320 },
    Americas: { scale: 1.56, x: 340, y: 285 },
    Asia: { scale: 1.72, x: 850, y: 245 },
    Europe: { scale: 3.05, x: 640, y: 165 },
    Oceania: { scale: 1.95, x: 1010, y: 365 }
  };

  let settings = loadSettings();
  let progress = loadProgress();
  let currentView = 'play';
  let run = null;
  let lastConfig = null;
  let selectedStudyIso = null;
  let studyContinent = 'World';
  let timerHandle = null;
  let audioContext = null;
  let dialogPauseDepth = 0;
  let pauseStarted = 0;
  let pendingAutoAdvance = null;
  let leaderboardMode = 'locate';
  let leaderboardAbortController = null;
  let supabaseClient = null;
  let authSession = null;
  let authSubscription = null;
  let cloudSyncTimer = null;
  let cloudSyncInFlight = false;
  let accountRecoveryActive = false;
  let lastSyncedAuthUserId = null;
  let deferredInstallPrompt = null;
  let countdownHandles = [];
  let mapInertiaFrame = 0;
  let mapTransformFrame = 0;

  const mapState = {
    scale: 1,
    tx: 0,
    ty: 0,
    pointers: new Map(),
    dragging: false,
    pinching: false,
    lastPoint: null,
    pinchDistance: 0,
    pinchCenter: null,
    moved: 0,
    suppressClickUntil: 0,
    velocityX: 0,
    velocityY: 0,
    lastMoveAt: 0,
    reticlePoint: null
  };

  function makePlayerId() {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `atlas-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }

  function defaultProgress() {
    return {
      version: 3,
      games: 0,
      totalQuestions: 0,
      totalSolved: 0,
      firstTry: 0,
      wrongGuesses: 0,
      bestStreak: 0,
      countries: {},
      unlocked: {},
      continentWins: {},
      microCorrect: 0,
      modeSolved: {},
      favorites: [],
      playerId: makePlayerId(),
      playerName: 'Explorer',
      sprintRecords: {},
      localSprintScores: [],
      modeStats: {},
      recentRuns: []
    };
  }

  function loadProgress() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const base = defaultProgress();
      const merged = {
        ...base,
        ...(parsed || {}),
        version: 3,
        countries: parsed?.countries || {},
        unlocked: parsed?.unlocked || {},
        continentWins: parsed?.continentWins || {},
        modeSolved: parsed?.modeSolved || {},
        favorites: parsed?.favorites || [],
        playerId: parsed?.playerId || base.playerId,
        playerName: sanitizePlayerName(parsed?.playerName || '') || 'Explorer',
        sprintRecords: parsed?.sprintRecords || {},
        localSprintScores: Array.isArray(parsed?.localSprintScores) ? parsed.localSprintScores : [],
        modeStats: parsed?.modeStats && typeof parsed.modeStats === 'object' ? parsed.modeStats : {},
        recentRuns: Array.isArray(parsed?.recentRuns) ? parsed.recentRuns.slice(0, 12) : []
      };
      return merged;
    } catch {
      return defaultProgress();
    }
  }

  function saveProgress({ cloud = true } = {}) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* storage can be blocked */ }
    if (cloud) scheduleCloudSync();
  }

  function loadSettings() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY));
      return { theme: 'dark', muted: false, ...(parsed || {}) };
    } catch {
      return { theme: 'dark', muted: false };
    }
  }

  function saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
  }

  function normalizeName(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  const searchIndex = new Map();
  countries.forEach(country => {
    [country.name, country.iso2, country.iso3, ...(country.aliases || [])].forEach(name => {
      const normalized = normalizeName(name);
      if (normalized && !searchIndex.has(normalized)) searchIndex.set(normalized, country);
    });
  });

  const spellingIndex = new Map();
  const ambiguousSpellings = new Set();
  countries.forEach(country => {
    [country.name, country.iso2, country.iso3, ...(country.aliases || [])].forEach(name => {
      const normalized = normalizeName(name);
      if (!normalized || ambiguousSpellings.has(normalized)) return;
      const existing = spellingIndex.get(normalized);
      if (existing && existing.iso2 !== country.iso2) {
        spellingIndex.delete(normalized);
        ambiguousSpellings.add(normalized);
      } else {
        spellingIndex.set(normalized, country);
      }
    });
  });
  const extraSpellings = {
    usa: 'US', 'u s a': 'US', america: 'US', uk: 'GB', 'u k': 'GB', britain: 'GB',
    uae: 'AE', 'u a e': 'AE', drc: 'CD', 'd r c': 'CD', 'ivory coast': 'CI',
    'south korea': 'KR', 'north korea': 'KP', 'east timor': 'TL', 'cape verde': 'CV',
    'swaziland': 'SZ', 'burma': 'MM', 'czech republic': 'CZ', 'vatican': 'VA'
  };
  Object.entries(extraSpellings).forEach(([name, iso2]) => spellingIndex.set(normalizeName(name), byIso.get(iso2)));

  function flagPosition(country) {
    const index = Math.max(0, Number(country?.flagIndex || 0));
    const column = index % FLAG_COLUMNS;
    const row = Math.floor(index / FLAG_COLUMNS);
    return {
      x: FLAG_COLUMNS > 1 ? column / (FLAG_COLUMNS - 1) * 100 : 0,
      y: FLAG_ROWS > 1 ? row / (FLAG_ROWS - 1) * 100 : 0
    };
  }

  function flagMarkup(country, extraClass = '') {
    if (!country) return '<span class="flag-art flag-fallback" aria-hidden="true">⚑</span>';
    const { x, y } = flagPosition(country);
    return `<span class="flag-art ${escapeHtml(extraClass)}" style="background-position:${x}% ${y}%" role="img" aria-label="Flag of ${escapeHtml(country.name)}"></span>`;
  }

  function setFlag(container, country, { decorative = false } = {}) {
    if (!container || !country) return;
    container.innerHTML = flagMarkup(country);
    const art = container.firstElementChild;
    if (decorative && art) {
      art.setAttribute('aria-hidden', 'true');
      art.removeAttribute('role');
      art.removeAttribute('aria-label');
    }
  }

  function formatNumber(value) {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: value < 10 ? 2 : 0 }).format(value);
  }

  function formatArea(area) {
    return `${formatNumber(area)} km²`;
  }

  function formatTime(totalSeconds, tenths = false) {
    const seconds = Math.max(0, totalSeconds);
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (tenths && mins === 0) return `${secs}.${Math.floor((seconds % 1) * 10)}s`;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }

  function titleCase(value) {
    return value ? value[0].toUpperCase() + value.slice(1) : value;
  }

  function randomShuffle(input, rng = Math.random) {
    const array = [...input];
    for (let index = array.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(rng() * (index + 1));
      [array[index], array[swap]] = [array[swap], array[index]];
    }
    return array;
  }

  function balancedCountryOrder(input, rng = Math.random) {
    const groups = new Map();
    input.forEach(country => {
      const key = country.continent || 'World';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(country);
    });
    const queues = [...groups.entries()].map(([continent, items]) => ({ continent, items: randomShuffle(items, rng) }));
    const ordered = [];
    let lastContinent = '';
    while (ordered.length < input.length) {
      const available = queues.filter(group => group.items.length);
      if (!available.length) break;
      const randomized = randomShuffle(available, rng).sort((a, b) => b.items.length - a.items.length);
      const chosen = randomized.find(group => group.continent !== lastContinent) || randomized[0];
      ordered.push(chosen.items.shift());
      lastContinent = chosen.continent;
    }
    return ordered;
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function seededRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state += 0x6D2B79F5;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function sanitizePlayerName(value) {
    return String(value || '')
      .replace(/[^\p{L}\p{N} _-]+/gu, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 24);
  }

  function supabaseConfigured() {
    return Boolean(String(CONFIG.supabaseUrl || '').trim() && String(CONFIG.supabasePublishableKey || '').trim());
  }

  function globalLeaderboardEnabled() {
    return Boolean(CONFIG.leaderboardEnabled && supabaseConfigured());
  }

  function accountsEnabled() {
    return Boolean(CONFIG.accountsEnabled && supabaseConfigured());
  }

  function activePlayerId() {
    return authSession?.user?.id || progress.playerId;
  }

  function accountDisplayName() {
    const authName = sanitizePlayerName(authSession?.user?.user_metadata?.display_name || '');
    return authName || sanitizePlayerName(progress.playerName) || 'Explorer';
  }

  function loadExternalScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-atlas-src="${CSS.escape(src)}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true') resolve();
        else {
          existing.addEventListener('load', resolve, { once: true });
          existing.addEventListener('error', reject, { once: true });
        }
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.atlasSrc = src;
      script.addEventListener('load', () => { script.dataset.loaded = 'true'; resolve(); }, { once: true });
      script.addEventListener('error', () => reject(new Error('The online score service could not load.')), { once: true });
      document.head.append(script);
    });
  }

  async function getSupabaseClient() {
    if (!supabaseConfigured()) return null;
    if (supabaseClient) return supabaseClient;
    if (!window.supabase?.createClient) await loadExternalScript(SUPABASE_JS_URL);
    if (!window.supabase?.createClient) throw new Error('The online score service did not initialize.');
    supabaseClient = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    if (accountsEnabled()) {
      const { data: listener } = supabaseClient.auth.onAuthStateChange((event, session) => {
        window.setTimeout(() => applyAuthSession(session, event), 0);
      });
      authSubscription = listener?.subscription || null;
    }
    return supabaseClient;
  }

  function accountRedirectUrl() {
    const configured = String(CONFIG.siteUrl || '').trim();
    if (configured) return configured;
    if (location.protocol === 'http:' || location.protocol === 'https:') return `${location.origin}${location.pathname}`;
    return undefined;
  }

  function setAccountStatus(message = '', type = '') {
    if (!el.accountStatus) return;
    el.accountStatus.textContent = message;
    el.accountStatus.classList.toggle('is-error', type === 'error');
    el.accountStatus.classList.toggle('is-success', type === 'success');
  }

  function setCloudSyncState(message, state = 'idle') {
    if (!el.accountSyncStatus || !el.accountSyncDot) return;
    el.accountSyncStatus.textContent = message;
    el.accountSyncDot.className = `account-sync-dot${state === 'idle' ? '' : ` is-${state}`}`;
  }

  function switchAccountTab(tab = 'signin') {
    const create = tab === 'create';
    el.accountSignInForm.hidden = create;
    el.accountCreateForm.hidden = !create;
    $$('#accountTabs [data-account-tab]').forEach(button => {
      const active = button.dataset.accountTab === tab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    setAccountStatus('');
    requestAnimationFrame(() => (create ? el.accountCreateName : el.accountSignInEmail)?.focus());
  }

  function updateAccountUI() {
    const enabled = accountsEnabled();
    if (el.accountButton) el.accountButton.hidden = !enabled;
    if (!enabled) return;
    const signedIn = Boolean(authSession?.user);
    el.accountButton.classList.toggle('is-signed-in', signedIn);
    el.accountButtonLabel.textContent = signedIn ? accountDisplayName() : 'Sign in';
    el.accountGuestView.hidden = signedIn;
    el.accountMemberView.hidden = !signedIn;
    if (el.statsStorageCopy) {
      el.statsStorageCopy.textContent = signedIn ? 'Your progress is saved here and synced to your Atlas account.' : 'Your progress is saved in this browser.';
    }
    if (!signedIn) return;
    el.accountEmail.textContent = authSession.user.email || 'Signed-in account';
    el.accountDisplayName.value = accountDisplayName();
    el.playerNameInput.value = accountDisplayName();
    el.accountRecoveryForm.hidden = !accountRecoveryActive;
  }

  async function initializeAccounts() {
    updateAccountUI();
    if (!accountsEnabled()) return;
    try {
      const client = await getSupabaseClient();
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      await applyAuthSession(data.session, 'INITIAL_SESSION');
    } catch (error) {
      console.warn('Atlas account initialization failed:', error);
      authSession = null;
      updateAccountUI();
    }
  }

  function numericMax(...values) {
    return Math.max(0, ...values.map(value => Number(value) || 0));
  }

  function earliestPositive(...values) {
    const finite = values.map(Number).filter(value => Number.isFinite(value) && value > 0);
    return finite.length ? Math.min(...finite) : null;
  }

  function mergeCountryRecords(localRecord = {}, cloudRecord = {}) {
    const modes = {};
    new Set([...Object.keys(localRecord.modes || {}), ...Object.keys(cloudRecord.modes || {})]).forEach(mode => {
      modes[mode] = {
        seen: numericMax(localRecord.modes?.[mode]?.seen, cloudRecord.modes?.[mode]?.seen),
        solved: numericMax(localRecord.modes?.[mode]?.solved, cloudRecord.modes?.[mode]?.solved)
      };
    });
    return {
      seen: numericMax(localRecord.seen, cloudRecord.seen),
      solved: numericMax(localRecord.solved, cloudRecord.solved),
      firstTry: numericMax(localRecord.firstTry, cloudRecord.firstTry),
      misses: numericMax(localRecord.misses, cloudRecord.misses),
      fastest: earliestPositive(localRecord.fastest, cloudRecord.fastest),
      modes
    };
  }

  function betterSprintRecord(a, b) {
    if (!a) return b;
    if (!b) return a;
    if (Number(a.officialMs) !== Number(b.officialMs)) return Number(a.officialMs) < Number(b.officialMs) ? a : b;
    if (Number(a.mistakes) !== Number(b.mistakes)) return Number(a.mistakes) < Number(b.mistakes) ? a : b;
    return Number(a.elapsedMs) <= Number(b.elapsedMs) ? a : b;
  }

  function modeStat(mode, source = progress) {
    const stored = source?.modeStats?.[mode] || {};
    return {
      runs: Number(stored.runs) || 0,
      competitiveRuns: Number(stored.competitiveRuns) || 0,
      questions: Number(stored.questions) || 0,
      solved: Number(stored.solved) || 0,
      firstTry: Number(stored.firstTry) || 0,
      mistakes: Number(stored.mistakes) || 0,
      bestScore: Number(stored.bestScore) || 0,
      bestAccuracy: Number(stored.bestAccuracy) || 0,
      bestStreak: Number(stored.bestStreak) || 0,
      lastPlayed: stored.lastPlayed || ''
    };
  }

  function mergeModeStat(localStat = {}, cloudStat = {}) {
    const local = modeStat('unused', { modeStats: { unused: localStat } });
    const cloud = modeStat('unused', { modeStats: { unused: cloudStat } });
    const dates = [local.lastPlayed, cloud.lastPlayed].filter(Boolean).sort();
    return {
      runs: numericMax(local.runs, cloud.runs),
      competitiveRuns: numericMax(local.competitiveRuns, cloud.competitiveRuns),
      questions: numericMax(local.questions, cloud.questions),
      solved: numericMax(local.solved, cloud.solved),
      firstTry: numericMax(local.firstTry, cloud.firstTry),
      mistakes: numericMax(local.mistakes, cloud.mistakes),
      bestScore: numericMax(local.bestScore, cloud.bestScore),
      bestAccuracy: numericMax(local.bestAccuracy, cloud.bestAccuracy),
      bestStreak: numericMax(local.bestStreak, cloud.bestStreak),
      lastPlayed: dates.at(-1) || ''
    };
  }

  function mergeRecentRuns(localRuns = [], cloudRuns = []) {
    const unique = new Map();
    [...cloudRuns, ...localRuns].forEach(item => {
      if (!item || typeof item !== 'object') return;
      const key = String(item.id || `${item.completedAt || ''}-${item.mode || ''}-${item.durationMs || 0}`);
      if (!unique.has(key)) unique.set(key, item);
    });
    return [...unique.values()]
      .sort((a, b) => String(b.completedAt || '').localeCompare(String(a.completedAt || '')))
      .slice(0, 12);
  }

  function mergeProgress(localProgress, cloudProgress) {
    const local = localProgress || defaultProgress();
    const cloud = cloudProgress && typeof cloudProgress === 'object' ? cloudProgress : {};
    const merged = { ...defaultProgress(), ...local, version: 3 };
    ['games', 'totalQuestions', 'totalSolved', 'firstTry', 'wrongGuesses', 'bestStreak', 'microCorrect'].forEach(key => {
      merged[key] = numericMax(local[key], cloud[key]);
    });
    merged.countries = {};
    new Set([...Object.keys(local.countries || {}), ...Object.keys(cloud.countries || {})]).forEach(iso2 => {
      merged.countries[iso2] = mergeCountryRecords(local.countries?.[iso2], cloud.countries?.[iso2]);
    });
    merged.unlocked = { ...(cloud.unlocked || {}), ...(local.unlocked || {}) };
    merged.continentWins = { ...(cloud.continentWins || {}), ...(local.continentWins || {}) };
    merged.modeSolved = {};
    new Set([...Object.keys(local.modeSolved || {}), ...Object.keys(cloud.modeSolved || {})]).forEach(mode => {
      merged.modeSolved[mode] = numericMax(local.modeSolved?.[mode], cloud.modeSolved?.[mode]);
    });
    merged.modeStats = {};
    new Set([...Object.keys(local.modeStats || {}), ...Object.keys(cloud.modeStats || {})]).forEach(mode => {
      merged.modeStats[mode] = mergeModeStat(local.modeStats?.[mode], cloud.modeStats?.[mode]);
    });
    merged.recentRuns = mergeRecentRuns(local.recentRuns, cloud.recentRuns);
    merged.favorites = [...new Set([...(local.favorites || []), ...(cloud.favorites || [])])].filter(iso2 => byIso.has(iso2));
    merged.sprintRecords = {};
    new Set([...Object.keys(local.sprintRecords || {}), ...Object.keys(cloud.sprintRecords || {})]).forEach(mode => {
      merged.sprintRecords[mode] = betterSprintRecord(local.sprintRecords?.[mode], cloud.sprintRecords?.[mode]);
    });
    merged.localSprintScores = Object.values(merged.sprintRecords).filter(Boolean);
    merged.playerId = local.playerId || cloud.playerId || makePlayerId();
    merged.playerName = sanitizePlayerName(authSession?.user?.user_metadata?.display_name || local.playerName || cloud.playerName) || 'Explorer';
    return merged;
  }

  function progressForCloud() {
    return JSON.parse(JSON.stringify(progress));
  }

  function scheduleCloudSync() {
    if (!authSession?.user || !supabaseClient || !accountsEnabled()) return;
    clearTimeout(cloudSyncTimer);
    cloudSyncTimer = window.setTimeout(() => pushCloudProgress({ quiet: true }), 900);
  }

  async function pushCloudProgress({ quiet = false } = {}) {
    if (!authSession?.user || !supabaseClient || cloudSyncInFlight) return false;
    cloudSyncInFlight = true;
    if (!quiet) setCloudSyncState('Saving your progress…', 'syncing');
    try {
      const payload = { user_id: authSession.user.id, player_name: progress.playerName, progress: progressForCloud(), updated_at: new Date().toISOString() };
      const { error } = await supabaseClient.from('atlas_player_progress').upsert(payload, { onConflict: 'user_id' });
      if (error) throw error;
      setCloudSyncState(`Synced ${new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date())}.`, 'synced');
      return true;
    } catch (error) {
      console.warn('Atlas cloud save failed:', error);
      setCloudSyncState('Cloud sync is unavailable. Local progress is still safe.', 'error');
      return false;
    } finally {
      cloudSyncInFlight = false;
    }
  }

  async function pullAndMergeCloudProgress() {
    if (!authSession?.user) return false;
    const client = await getSupabaseClient();
    setCloudSyncState('Merging this device with your cloud save…', 'syncing');
    const { data, error } = await client.from('atlas_player_progress').select('player_name,progress,updated_at').eq('user_id', authSession.user.id).maybeSingle();
    if (error) throw error;
    if (data?.progress) {
      progress = mergeProgress(progress, data.progress);
      const cloudName = sanitizePlayerName(data.player_name || '');
      if (cloudName && !authSession.user.user_metadata?.display_name) progress.playerName = cloudName;
      saveProgress({ cloud: false });
      renderStats();
      if (currentView === 'study' && selectedStudyIso) selectStudyCountry(selectedStudyIso, false);
    }
    updateAccountUI();
    await pushCloudProgress();
    return true;
  }

  async function applyAuthSession(session, event = '') {
    authSession = session || null;
    if (event === 'PASSWORD_RECOVERY') accountRecoveryActive = true;
    if (!authSession) {
      lastSyncedAuthUserId = null;
      accountRecoveryActive = false;
      updateAccountUI();
      return;
    }
    const metadataName = sanitizePlayerName(authSession.user.user_metadata?.display_name || '');
    if (metadataName) progress.playerName = metadataName;
    saveProgress({ cloud: false });
    updateAccountUI();
    if (lastSyncedAuthUserId !== authSession.user.id) {
      lastSyncedAuthUserId = authSession.user.id;
      await pullAndMergeCloudProgress().catch(error => {
        console.warn('Atlas cloud merge failed:', error);
        setCloudSyncState('Could not reach cloud storage. Local progress is still safe.', 'error');
      });
    }
  }

  async function openAccountDialog() {
    if (!accountsEnabled()) return;
    setAccountStatus('');
    pauseForDialog();
    if (!el.accountDialog.open) el.accountDialog.showModal();
    try { await getSupabaseClient(); updateAccountUI(); }
    catch { setAccountStatus('The account service could not be reached. Guest play still works.', 'error'); }
  }

  async function signInAccount(event) {
    event.preventDefault();
    setAccountStatus('Signing in…');
    try {
      const client = await getSupabaseClient();
      const { error } = await client.auth.signInWithPassword({ email: el.accountSignInEmail.value.trim(), password: el.accountSignInPassword.value });
      if (error) throw error;
      el.accountSignInPassword.value = '';
      setAccountStatus('Signed in. Your progress is syncing.', 'success');
    } catch (error) { setAccountStatus(error?.message || 'Sign-in failed.', 'error'); }
  }

  async function createAccount(event) {
    event.preventDefault();
    const name = sanitizePlayerName(el.accountCreateName.value);
    if (name.length < 2) { setAccountStatus('Choose a display name with at least two characters.', 'error'); return; }
    setAccountStatus('Creating your account…');
    try {
      const client = await getSupabaseClient();
      const redirect = accountRedirectUrl();
      const options = { data: { display_name: name } };
      if (redirect) options.emailRedirectTo = redirect;
      const email = el.accountCreateEmail.value.trim();
      const { data, error } = await client.auth.signUp({ email, password: el.accountCreatePassword.value, options });
      if (error) throw error;
      progress.playerName = name;
      saveProgress();
      el.accountCreatePassword.value = '';
      if (data.session) setAccountStatus('Account created. Your progress is syncing.', 'success');
      else {
        switchAccountTab('signin');
        el.accountSignInEmail.value = email;
        setAccountStatus('Account created. Check your email to confirm it, then sign in.', 'success');
      }
    } catch (error) { setAccountStatus(error?.message || 'Could not create the account.', 'error'); }
  }

  async function sendPasswordReset() {
    const email = el.accountSignInEmail.value.trim();
    if (!email) { setAccountStatus('Enter your email first.', 'error'); el.accountSignInEmail.focus(); return; }
    setAccountStatus('Sending a reset link…');
    try {
      const client = await getSupabaseClient();
      const redirectTo = accountRedirectUrl();
      const { error } = await client.auth.resetPasswordForEmail(email, redirectTo ? { redirectTo } : undefined);
      if (error) throw error;
      setAccountStatus('Reset link sent. Check your email.', 'success');
    } catch (error) { setAccountStatus(error?.message || 'Could not send the reset email.', 'error'); }
  }

  async function updateRecoveredPassword(event) {
    event.preventDefault();
    try {
      const client = await getSupabaseClient();
      const { error } = await client.auth.updateUser({ password: el.accountNewPassword.value });
      if (error) throw error;
      accountRecoveryActive = false;
      el.accountRecoveryForm.hidden = true;
      el.accountNewPassword.value = '';
      setAccountStatus('Password updated.', 'success');
    } catch (error) { setAccountStatus(error?.message || 'Could not update the password.', 'error'); }
  }

  async function saveAccountDisplayName() {
    const name = sanitizePlayerName(el.accountDisplayName.value);
    if (name.length < 2) { setAccountStatus('Choose a name with at least two characters.', 'error'); return; }
    try {
      const client = await getSupabaseClient();
      const { error } = await client.auth.updateUser({ data: { display_name: name } });
      if (error) throw error;
      progress.playerName = name;
      saveProgress();
      el.playerNameInput.value = name;
      updateAccountUI();
      setAccountStatus('Leaderboard name saved.', 'success');
    } catch (error) { setAccountStatus(error?.message || 'Could not save the name.', 'error'); }
  }

  async function signOutAccount() {
    try {
      await pushCloudProgress({ quiet: true });
      const client = await getSupabaseClient();
      const { error } = await client.auth.signOut();
      if (error) throw error;
      setAccountStatus('Signed out. This device keeps its local copy.', 'success');
    } catch (error) { setAccountStatus(error?.message || 'Could not sign out.', 'error'); }
  }

  function formatRaceTime(milliseconds) {
    const total = Math.max(0, Number(milliseconds) || 0);
    const minutes = Math.floor(total / 60000);
    const seconds = Math.floor((total % 60000) / 1000);
    const tenths = Math.floor((total % 1000) / 100);
    return `${minutes}:${String(seconds).padStart(2, '0')}.${tenths}`;
  }

  function sprintRecordFromRun(activeRun) {
    const elapsedMs = Math.max(1, Math.round(activeRun.finalDuration * 1000));
    const mistakes = Math.max(0, Number(activeRun.wrongGuesses || 0));
    return {
      sprintVersion: SPRINT_VERSION,
      mode: activeRun.config.mode,
      playerId: activePlayerId(),
      playerName: accountDisplayName(),
      elapsedMs,
      mistakes,
      officialMs: elapsedMs + mistakes * SPRINT_PENALTY_SECONDS * 1000,
      completedCount: countries.length,
      createdAt: new Date().toISOString()
    };
  }

  function saveLocalSprintRecord(record) {
    const existing = progress.sprintRecords[record.mode];
    progress.sprintRecords[record.mode] = betterSprintRecord(existing, record);
    progress.localSprintScores = Object.values(progress.sprintRecords).filter(Boolean);
    saveProgress();
    updateLeaderboardPersonalBest(record.mode);
    if (run?.config?.mode === record.mode && el.sprintBest) el.sprintBest.textContent = `· Best ${formatRaceTime(progress.sprintRecords[record.mode].officialMs)}`;
  }

  function setSprintSubmissionStatus(message, type = '') {
    if (!el.sprintSubmissionStatus) return;
    el.sprintSubmissionStatus.textContent = message;
    el.sprintSubmissionStatus.classList.toggle('is-error', type === 'error');
    el.sprintSubmissionStatus.classList.toggle('is-success', type === 'success');
  }

  async function submitSprintScore(activeRun) {
    if (!activeRun?.isSprint || activeRun.abandoned || activeRun.history.length !== countries.length) return;
    const record = sprintRecordFromRun(activeRun);
    saveLocalSprintRecord(record);
    if (!globalLeaderboardEnabled()) {
      setSprintSubmissionStatus('Best time saved on this device.', 'success');
      return;
    }
    setSprintSubmissionStatus('Submitting your competitive time…');
    try {
      const client = await getSupabaseClient();
      const { data, error } = await client.rpc('submit_atlas_sprint', {
        p_sprint_version: SPRINT_VERSION,
        p_mode: record.mode,
        p_player_id: record.playerId,
        p_player_name: record.playerName,
        p_elapsed_ms: record.elapsedMs,
        p_mistakes: record.mistakes,
        p_completed_count: record.completedCount
      });
      if (error) throw error;
      const result = Array.isArray(data) ? data[0] : data;
      const rankText = result?.world_rank ? ` Rank #${result.world_rank}.` : '';
      setSprintSubmissionStatus(`${result?.saved ? 'New personal best submitted.' : 'Your existing best time is faster.'}${rankText}`, 'success');
      if (el.leaderboardDialog.open && leaderboardMode === record.mode) loadLeaderboard(record.mode);
    } catch (error) {
      console.warn('Competitive-time submission failed:', error);
      setSprintSubmissionStatus('Saved on this device. The shared leaderboard could not be reached.', 'error');
    }
  }

  function localLeaderboardRows(mode) {
    return (progress.localSprintScores || []).filter(record => record.mode === mode).sort((a, b) => a.officialMs - b.officialMs).slice(0, 50);
  }

  function leaderboardDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.valueOf()) ? '—' : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  }

  function updateLeaderboardPersonalBest(mode) {
    const best = progress.sprintRecords?.[mode];
    if (!el.leaderboardBestTime || !el.leaderboardBestMeta) return;
    el.leaderboardBestTime.textContent = best ? formatRaceTime(best.officialMs) : '—';
    el.leaderboardBestMeta.textContent = best
      ? `${formatRaceTime(best.elapsedMs)} raw · ${best.mistakes} mistake${best.mistakes === 1 ? '' : 's'} · ${leaderboardDate(best.createdAt)}`
      : `Finish Competitive ${modeLabels[mode]} to set one.`;
    el.leaderboardPersonalBest?.classList.toggle('has-record', Boolean(best));
  }

  function renderLeaderboardRows(rows, local = false) {
    el.leaderboardScopeLabel.textContent = local ? 'Times on this device' : 'Worldwide times';
    if (!rows.length) {
      el.leaderboardRows.innerHTML = `<tr><td colspan="6"><div class="empty-board"><strong>No ${escapeHtml(modeLabels[leaderboardMode])} time yet.</strong><span>Complete this mode with Competitive enabled.</span></div></td></tr>`;
      return;
    }
    el.leaderboardRows.innerHTML = rows.map((row, index) => {
      const official = Number(row.official_ms ?? row.officialMs);
      const elapsed = Number(row.elapsed_ms ?? row.elapsedMs);
      const mistakes = Number(row.mistakes || 0);
      const name = sanitizePlayerName(row.player_name ?? row.playerName) || 'Explorer';
      const mine = String(row.player_id ?? row.playerId) === String(activePlayerId());
      return `<tr class="${mine ? 'is-player' : ''}"><td><strong>${index + 1}</strong></td><td>${escapeHtml(name)}${mine ? '<small>You</small>' : ''}</td><td><strong>${formatRaceTime(official)}</strong></td><td>${formatRaceTime(elapsed)}</td><td>${mistakes}</td><td>${leaderboardDate(row.created_at ?? row.createdAt)}</td></tr>`;
    }).join('');
  }

  async function loadLeaderboard(mode = leaderboardMode) {
    leaderboardMode = mode;
    updateLeaderboardPersonalBest(mode);
    $$('#leaderboardModeTabs [data-mode]').forEach(button => {
      const active = button.dataset.mode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    el.leaderboardStatus.textContent = globalLeaderboardEnabled() ? 'Loading worldwide times…' : 'Showing best times saved on this device.';
    el.startSprintButton.textContent = `Start Competitive ${modeLabels[mode]}`;
    if (leaderboardAbortController) leaderboardAbortController.abort();
    leaderboardAbortController = new AbortController();
    if (!globalLeaderboardEnabled()) {
      renderLeaderboardRows(localLeaderboardRows(mode), true);
      return;
    }
    try {
      const client = await getSupabaseClient();
      const { data, error } = await client.from('atlas_sprint_scores')
        .select('player_name,official_ms,elapsed_ms,mistakes,created_at')
        .eq('sprint_version', SPRINT_VERSION)
        .eq('mode', mode)
        .order('official_ms', { ascending: true })
        .order('mistakes', { ascending: true })
        .order('elapsed_ms', { ascending: true })
        .limit(100)
        .abortSignal(leaderboardAbortController.signal);
      if (error) throw error;
      renderLeaderboardRows(data || [], false);
      el.leaderboardStatus.textContent = `${(data || []).length} worldwide time${(data || []).length === 1 ? '' : 's'} shown.`;
    } catch (error) {
      if (error?.name === 'AbortError') return;
      console.warn('Leaderboard load failed:', error);
      renderLeaderboardRows(localLeaderboardRows(mode), true);
      el.leaderboardStatus.textContent = 'Worldwide times are unavailable right now. Showing this device instead.';
    }
  }

  function openLeaderboard(mode = leaderboardMode) {
    leaderboardMode = mode;
    el.playerNameInput.value = accountDisplayName();
    pauseForDialog();
    if (!el.leaderboardDialog.open) el.leaderboardDialog.showModal();
    loadLeaderboard(mode);
  }

  function savePlayerName() {
    const name = sanitizePlayerName(el.playerNameInput.value);
    if (name.length < 2) { toast('Use at least two characters for your leaderboard name.', 'error'); return; }
    progress.playerName = name;
    saveProgress();
    if (authSession?.user && supabaseClient) supabaseClient.auth.updateUser({ data: { display_name: name } }).catch(() => {});
    updateAccountUI();
    toast('Leaderboard name saved.');
  }

  function countryElements(iso2) {
    return $$(`[data-iso="${CSS.escape(iso2)}"]`).filter(node => node.closest('#worldMap'));
  }

  function setCountryClass(iso2, className, enabled = true) {
    countryElements(iso2).forEach(node => node.classList.toggle(className, enabled));
  }

  function clearMapStateClasses() {
    $$('#worldMap .country, #worldMap .country-marker').forEach(node => {
      node.classList.remove('is-dimmed', 'is-solved', 'is-correct', 'is-wrong', 'is-target', 'is-neighbor', 'is-selected-study', 'is-favorite-study');
    });
  }

  function renderMap() {
    const graticuleFragment = document.createDocumentFragment();
    DATA.graticule.forEach(pathData => {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('class', 'graticule');
      graticuleFragment.append(path);
    });
    el.graticuleLayer.append(graticuleFragment);

    const countriesFragment = document.createDocumentFragment();
    const territoriesFragment = document.createDocumentFragment();

    DATA.mapFeatures.forEach(feature => {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', feature.d);
      if (feature.iso2) {
        const country = byIso.get(feature.iso2);
        path.setAttribute('class', 'country');
        path.dataset.iso = feature.iso2;
        path.setAttribute('tabindex', '-1');
        path.setAttribute('role', 'button');
        path.setAttribute('aria-label', country?.name || feature.name);
        attachMapEvents(path, feature.iso2);
        countriesFragment.append(path);
      } else {
        path.setAttribute('class', 'territory');
        path.dataset.territory = feature.name;
        path.addEventListener('click', () => {
          if (performance.now() < mapState.suppressClickUntil) return;
          if (currentView === 'play' && run?.active) {
            if (run.currentMode === 'spelling') {
              setFeedback('Type country names in the box. The map only tracks your progress.', 'info');
              el.spellInput.focus();
            } else {
              registerMistake(`That is ${feature.name}, a territory or disputed area outside this quiz set.`);
            }
          }
        });
        path.addEventListener('pointerenter', event => showTerritoryTooltip(event, feature.name));
        path.addEventListener('pointermove', moveTooltip);
        path.addEventListener('pointerleave', hideTooltip);
        territoriesFragment.append(path);
      }
    });

    el.territoryLayer.append(territoriesFragment);
    el.countryLayer.append(countriesFragment);

    const markerFragment = document.createDocumentFragment();
    DATA.markers.forEach(marker => {
      const country = byIso.get(marker.iso2);
      const group = document.createElementNS(SVG_NS, 'g');
      group.setAttribute('class', 'country-marker');
      group.setAttribute('transform', `translate(${marker.x} ${marker.y})`);
      group.dataset.iso = marker.iso2;
      group.dataset.baseHit = marker.micro ? '9' : '7';
      group.dataset.baseDot = marker.micro ? '2.8' : '2.3';
      group.setAttribute('role', 'button');
      group.setAttribute('tabindex', '-1');
      group.setAttribute('aria-label', country.name);

      const hit = document.createElementNS(SVG_NS, 'circle');
      hit.setAttribute('class', 'marker-hit');
      hit.setAttribute('r', group.dataset.baseHit);
      const ring = document.createElementNS(SVG_NS, 'circle');
      ring.setAttribute('class', 'marker-ring');
      ring.setAttribute('r', '5.2');
      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('class', 'marker-dot');
      dot.setAttribute('r', group.dataset.baseDot);
      group.append(hit, ring, dot);
      attachMapEvents(group, marker.iso2);
      markerFragment.append(group);
    });
    el.markerLayer.append(markerFragment);

    updateMarkerScale();
    renderCountrySelectors();
  }

  function attachMapEvents(node, iso2) {
    node.addEventListener('click', event => {
      event.stopPropagation();
      if (performance.now() < mapState.suppressClickUntil) return;
      chooseCountry(iso2);
    });
    node.addEventListener('pointerenter', event => showCountryTooltip(event, iso2));
    node.addEventListener('pointermove', moveTooltip);
    node.addEventListener('pointerleave', hideTooltip);
    node.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        chooseCountry(iso2);
      }
    });
  }

  function renderCountrySelectors() {
    const sorted = [...countries].sort((a, b) => a.name.localeCompare(b.name));
    el.countryAnswerSelect.innerHTML = '<option value="">Choose a country…</option>' + sorted.map(country => `<option value="${country.iso2}">${escapeHtml(country.name)}</option>`).join('');
    el.countryDatalist.innerHTML = sorted.map(country => `<option value="${escapeHtml(country.name)}"></option>`).join('');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  }

  function showCountryTooltip(event, iso2) {
    // A live quiz never shows hover labels or a floating hover box. Besides
    // keeping the answer secret, this leaves the map visually clean after a
    // click. Country names remain available in Study mode.
    if (!precisePointer || (currentView === 'play' && run?.active)) {
      hideTooltip();
      return;
    }
    const country = byIso.get(iso2);
    if (!country) return;
    el.mapTooltip.textContent = country.name;
    el.mapTooltip.hidden = false;
    moveTooltip(event);
  }

  function showTerritoryTooltip(event, name) {
    if (currentView !== 'study' && run?.active) return;
    el.mapTooltip.textContent = `${name} · territory / dependency`;
    el.mapTooltip.hidden = false;
    moveTooltip(event);
  }

  function moveTooltip(event) {
    if (el.mapTooltip.hidden) return;
    const rect = el.mapStage.getBoundingClientRect();
    let left = event.clientX - rect.left;
    let top = event.clientY - rect.top;
    const tooltipWidth = el.mapTooltip.offsetWidth || 160;
    const tooltipHeight = el.mapTooltip.offsetHeight || 40;
    if (left + tooltipWidth + 20 > rect.width) left -= tooltipWidth + 20;
    if (top + tooltipHeight + 20 > rect.height) top -= tooltipHeight + 20;
    el.mapTooltip.style.left = `${Math.max(4, left)}px`;
    el.mapTooltip.style.top = `${Math.max(4, top)}px`;
  }

  function hideTooltip() {
    el.mapTooltip.hidden = true;
  }

  function chooseCountry(iso2) {
    if (currentView === 'study') {
      selectStudyCountry(iso2, false);
      return;
    }
    if (run?.active && run.ready === false) return;
    if (run?.active && run.currentMode === 'spelling') {
      setFeedback('Type the country name to fill it on the map.', 'info');
      el.spellInput.focus();
      return;
    }
    if (!run?.active || run.ready === false || !run.current || run.transitioning) {
      const country = byIso.get(iso2);
      showMapCallout(country);
      return;
    }
    if (run.currentMode === 'reverse') {
      setFeedback('The highlighted shape is the clue. Type its country name in the answer box.', 'info');
      el.reverseInput.focus();
      return;
    }
    handleMapAnswer(iso2);
  }

  function registerMistake(message, { clickedCountry = null, allowReveal = true } = {}) {
    if (!run?.active || run.ready === false) return;
    run.questionMistakes += 1;
    run.wrongGuesses += 1;
    run.streak = 0;
    if (!run.isSprint) run.score = Math.max(0, run.score - 75);
    if (run.current) run.missedCodes.add(run.current.iso2);
    if (clickedCountry) {
      setCountryClass(clickedCountry.iso2, 'is-wrong', true);
      window.setTimeout(() => setCountryClass(clickedCountry.iso2, 'is-wrong', false), 420);
    }
    setFeedback(message, 'wrong');
    playSound('wrong');
    updateRunUI();
    if (!run.isSprint && allowReveal && run.current && run.questionMistakes >= 3 && !run.transitioning) {
      run.transitioning = true;
      window.setTimeout(() => resolveQuestion(false, 'three-misses'), 520);
    }
  }

  function handleMapAnswer(iso2) {
    const clicked = byIso.get(iso2);
    const target = run.current;
    if (!clicked || !target) return;
    if (clicked.iso2 === target.iso2) {
      resolveQuestion(true, 'correct');
      return;
    }
    registerMistake(`That was ${clicked.name}. Look ${directionFrom(clicked, target)}.`, { clickedCountry: clicked });
  }

  function directionFrom(from, to) {
    const latDiff = to.lat - from.lat;
    let lngDiff = to.lng - from.lng;
    if (lngDiff > 180) lngDiff -= 360;
    if (lngDiff < -180) lngDiff += 360;
    const vertical = latDiff > 7 ? 'north' : latDiff < -7 ? 'south' : '';
    const horizontal = lngDiff > 10 ? 'east' : lngDiff < -10 ? 'west' : '';
    if (vertical && horizontal) return `${vertical}${horizontal}`;
    return vertical || horizontal || 'very close by';
  }

  function mapAcceptsPointerAnswer() {
    return Boolean(currentView === 'play' && run?.active && run.ready !== false && MAP_ANSWER_MODES.has(run.currentMode) && !run.transitioning);
  }

  function updateMapInteractionMode() {
    const targeting = mapAcceptsPointerAnswer();
    el.mapStage.classList.toggle('is-targeting', targeting);
    el.worldMap.classList.toggle('is-targeting', targeting);
    if (!targeting || !precisePointer) {
      el.mapReticle.hidden = true;
      mapState.reticlePoint = null;
    }
    $$('#worldMap .country, #worldMap .country-marker').forEach(node => {
      if (currentView === 'play' && run?.active) node.setAttribute('aria-label', 'Map location');
      else {
        const country = byIso.get(node.dataset.iso);
        node.setAttribute('aria-label', country?.name || 'Map location');
      }
    });
  }

  function moveMapReticle(clientX, clientY) {
    if (!precisePointer || !mapAcceptsPointerAnswer() || mapState.dragging || mapState.pinching) {
      el.mapReticle.hidden = true;
      return;
    }
    const stageRect = el.mapStage.getBoundingClientRect();
    const mapRect = el.worldMap.getBoundingClientRect();
    if (clientX < mapRect.left || clientX > mapRect.right || clientY < mapRect.top || clientY > mapRect.bottom) {
      el.mapReticle.hidden = true;
      return;
    }
    const left = clientX - stageRect.left;
    const top = clientY - stageRect.top;
    mapState.reticlePoint = { left, top };
    el.mapReticle.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    el.mapReticle.hidden = false;
  }

  function cancelMapInertia() {
    if (mapInertiaFrame) cancelAnimationFrame(mapInertiaFrame);
    mapInertiaFrame = 0;
    mapState.velocityX = 0;
    mapState.velocityY = 0;
  }

  function startMapInertia() {
    cancelMapInertia();
    if (reduceMotion || mapState.scale <= 1.001) return;
    let vx = mapState.velocityX;
    let vy = mapState.velocityY;
    if (Math.hypot(vx, vy) < 0.45) return;
    const step = () => {
      vx *= 0.89;
      vy *= 0.89;
      mapState.tx += vx;
      mapState.ty += vy;
      applyMapTransform();
      if (Math.hypot(vx, vy) > 0.16) mapInertiaFrame = requestAnimationFrame(step);
      else cancelMapInertia();
    };
    mapInertiaFrame = requestAnimationFrame(step);
  }

  function applyMapTransform() {
    clampMapTransform();
    if (mapTransformFrame) cancelAnimationFrame(mapTransformFrame);
    mapTransformFrame = requestAnimationFrame(() => {
      mapTransformFrame = 0;
      el.mapViewport.style.transform = `translate(${mapState.tx}px, ${mapState.ty}px) scale(${mapState.scale})`;
      updateMarkerScale();
      if (el.zoomReadout) el.zoomReadout.textContent = mapState.scale < 10 ? `${mapState.scale.toFixed(1)}×` : `${Math.round(mapState.scale)}×`;
    });
  }

  function clampMapTransform() {
    const overscroll = 90;
    const minX = 1200 - 1200 * mapState.scale - overscroll;
    const maxX = overscroll;
    const minY = 620 - 620 * mapState.scale - overscroll;
    const maxY = overscroll;
    mapState.tx = Math.min(maxX, Math.max(minX, mapState.tx));
    mapState.ty = Math.min(maxY, Math.max(minY, mapState.ty));
    if (mapState.scale <= 1.001) {
      mapState.tx = 0;
      mapState.ty = 0;
    }
  }

  function updateMarkerScale() {
    const inverse = 1 / mapState.scale;
    $$('#markerLayer .country-marker').forEach(group => {
      const hit = group.querySelector('.marker-hit');
      const dot = group.querySelector('.marker-dot');
      const ring = group.querySelector('.marker-ring');
      hit.setAttribute('r', String(Number(group.dataset.baseHit) * inverse));
      dot.setAttribute('r', String(Number(group.dataset.baseDot) * inverse));
      ring.setAttribute('r', String(5.2 * inverse));
      dot.style.strokeWidth = `${1.4 * inverse}`;
      ring.style.strokeWidth = `${1.2 * inverse}`;
    });
  }

  function zoomAt(point, factor) {
    cancelMapInertia();
    const oldScale = mapState.scale;
    const newScale = Math.min(MAX_MAP_SCALE, Math.max(1, oldScale * factor));
    if (Math.abs(newScale - oldScale) < 0.001) return;
    const ratio = newScale / oldScale;
    mapState.tx = point.x - (point.x - mapState.tx) * ratio;
    mapState.ty = point.y - (point.y - mapState.ty) * ratio;
    mapState.scale = newScale;
    applyMapTransform();
  }

  function clientToViewBox(clientX, clientY) {
    const matrix = el.worldMap.getScreenCTM();
    if (matrix && typeof DOMPoint === 'function') {
      const point = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
      return { x: point.x, y: point.y };
    }
    const rect = el.worldMap.getBoundingClientRect();
    return { x: (clientX - rect.left) * 1200 / rect.width, y: (clientY - rect.top) * 620 / rect.height };
  }

  function fitScope(scope = 'World') {
    const resolved = scopeViews[scope] || scopeViews.World;
    mapState.scale = resolved.scale;
    mapState.tx = 600 - resolved.x * resolved.scale;
    mapState.ty = 310 - resolved.y * resolved.scale;
    applyMapTransform();
  }

  function focusCountry(country, scale = null) {
    if (!country) return;
    cancelMapInertia();
    const targetScale = scale || (country.micro ? 5.2 : country.area > 1_000_000 ? 2.15 : 3.15);
    mapState.scale = Math.min(MAX_MAP_SCALE, Math.max(1, targetScale));
    mapState.tx = 600 - country.mapX * mapState.scale;
    mapState.ty = 310 - country.mapY * mapState.scale;
    applyMapTransform();
  }

  function panMapBy(dx, dy) {
    cancelMapInertia();
    mapState.tx += dx;
    mapState.ty += dy;
    applyMapTransform();
  }

  function initializeMapGestures() {
    el.worldMap.addEventListener('wheel', event => {
      event.preventDefault();
      cancelMapInertia();
      const point = clientToViewBox(event.clientX, event.clientY);
      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 18 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? 120 : 1;
      const delta = Math.max(-220, Math.min(220, event.deltaY * unit));
      const factor = Math.exp(-delta * 0.0022);
      zoomAt(point, factor);
      moveMapReticle(event.clientX, event.clientY);
    }, { passive: false });

    el.worldMap.addEventListener('dblclick', event => {
      const onAnswerTarget = event.target.closest?.('.country, .country-marker');
      if (run?.active && currentView === 'play' && onAnswerTarget) return;
      event.preventDefault();
      zoomAt(clientToViewBox(event.clientX, event.clientY), 1.65);
    });

    el.worldMap.addEventListener('pointerenter', event => moveMapReticle(event.clientX, event.clientY));
    el.worldMap.addEventListener('pointerleave', () => { el.mapReticle.hidden = true; });

    const capturePointer = pointerId => {
      try {
        if (!el.worldMap.hasPointerCapture(pointerId)) el.worldMap.setPointerCapture(pointerId);
      } catch { /* Pointer capture can disappear during rapid multi-touch changes. */ }
    };

    el.worldMap.addEventListener('pointerdown', event => {
      cancelMapInertia();
      el.mapReticle.classList.add('is-pressed');
      mapState.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (mapState.pointers.size === 1) {
        // Do not capture a simple tap. Capturing immediately retargets the click
        // to the SVG and makes country shapes impossible to choose in some browsers.
        mapState.dragging = false;
        mapState.pinching = false;
        mapState.lastPoint = { x: event.clientX, y: event.clientY };
        mapState.moved = 0;
        mapState.lastMoveAt = performance.now();
        mapState.velocityX = 0;
        mapState.velocityY = 0;
      } else if (mapState.pointers.size === 2) {
        mapState.pointers.forEach((_, pointerId) => capturePointer(pointerId));
        mapState.pinching = true;
        mapState.dragging = false;
        mapState.moved = 0;
        el.worldMap.classList.remove('is-dragging');
        el.worldMap.classList.add('is-pinching');
        const points = [...mapState.pointers.values()];
        mapState.pinchDistance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        mapState.pinchCenter = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
      }
    });

    el.worldMap.addEventListener('pointermove', event => {
      moveMapReticle(event.clientX, event.clientY);
      if (!mapState.pointers.has(event.pointerId)) return;
      mapState.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (mapState.pinching && mapState.pointers.size >= 2) {
        capturePointer(event.pointerId);
        const points = [...mapState.pointers.values()].slice(0, 2);
        const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        const center = { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
        if (mapState.pinchDistance > 0) {
          const factor = distance / mapState.pinchDistance;
          zoomAt(clientToViewBox(center.x, center.y), factor);
        }
        const dx = center.x - mapState.pinchCenter.x;
        const dy = center.y - mapState.pinchCenter.y;
        const rect = el.worldMap.getBoundingClientRect();
        mapState.tx += dx * 1200 / rect.width;
        mapState.ty += dy * 620 / rect.height;
        applyMapTransform();
        mapState.pinchDistance = distance;
        mapState.pinchCenter = center;
        mapState.moved += Math.abs(dx) + Math.abs(dy);
        return;
      }

      if (mapState.lastPoint) {
        const dx = event.clientX - mapState.lastPoint.x;
        const dy = event.clientY - mapState.lastPoint.y;
        mapState.moved += Math.abs(dx) + Math.abs(dy);
        if (!mapState.dragging && mapState.moved > 4) {
          mapState.dragging = true;
          capturePointer(event.pointerId);
          el.worldMap.classList.add('is-dragging');
        }
        if (mapState.dragging) {
          const rect = el.worldMap.getBoundingClientRect();
          const moveX = dx * 1200 / rect.width;
          const moveY = dy * 620 / rect.height;
          const now = performance.now();
          const frameFactor = Math.min(2.5, 16 / Math.max(5, now - mapState.lastMoveAt));
          mapState.tx += moveX;
          mapState.ty += moveY;
          mapState.velocityX = moveX * frameFactor;
          mapState.velocityY = moveY * frameFactor;
          mapState.lastMoveAt = now;
          applyMapTransform();
        }
        mapState.lastPoint = { x: event.clientX, y: event.clientY };
      }
    });

    const endPointer = event => {
      el.mapReticle.classList.remove('is-pressed');
      mapState.pointers.delete(event.pointerId);
      if (mapState.moved > 5) mapState.suppressClickUntil = performance.now() + 180;
      if (mapState.pointers.size < 2) {
        mapState.pinching = false;
        el.worldMap.classList.remove('is-pinching');
      }
      if (mapState.pointers.size === 1) {
        const [pointerId, remaining] = [...mapState.pointers.entries()][0];
        mapState.dragging = true;
        mapState.lastPoint = remaining;
        capturePointer(pointerId);
        el.worldMap.classList.add('is-dragging');
      } else if (mapState.pointers.size === 0) {
        const wasDragging = mapState.dragging;
        mapState.dragging = false;
        mapState.lastPoint = null;
        mapState.moved = 0;
        el.worldMap.classList.remove('is-dragging');
        if (wasDragging) startMapInertia();
        moveMapReticle(event.clientX, event.clientY);
      }
    };
    el.worldMap.addEventListener('pointerup', endPointer);
    el.worldMap.addEventListener('pointercancel', endPointer);

    el.zoomInButton.addEventListener('click', () => zoomAt({ x: 600, y: 310 }, 1.28));
    el.zoomOutButton.addEventListener('click', () => zoomAt({ x: 600, y: 310 }, 0.78));
    el.resetMapButton.addEventListener('click', () => fitScope(currentView === 'study' ? studyContinent : run?.config.scope || 'World'));
    el.fitScopeButton.addEventListener('click', () => fitScope(currentView === 'study' ? studyContinent : run?.config.scope || 'World'));
  }

  function buildPool(config) {
    let pool = [...countries];
    if (config.sprint || config.mode === 'spelling') return pool;
    if (config.customPoolCodes?.length) {
      const wanted = new Set(config.customPoolCodes);
      pool = pool.filter(country => wanted.has(country.iso2));
    } else if (config.scope === 'Weak') {
      pool = weakCountries().map(item => item.country);
      if (!pool.length) {
        toast('No weak spots yet. I used the full world pool instead.');
        pool = [...countries];
      }
    } else if (config.scope === 'Favorites') {
      const favorites = new Set(progress.favorites);
      pool = pool.filter(country => favorites.has(country.iso2));
      if (!pool.length) {
        toast('You have no favorites yet. Star countries in Study mode first.', 'error');
        pool = [...countries];
      }
    } else if (config.scope !== 'World') {
      pool = pool.filter(country => country.continent === config.scope);
    }
    if (!config.customPoolCodes?.length) pool = pool.filter(country => country.tier <= Number(config.difficulty));
    return pool;
  }

  function updateSetupModeUI({ changedMode = false } = {}) {
    const mode = el.setupForm.querySelector('[name="mode"]:checked')?.value || 'locate';
    const locked = el.sprintInput.checked || mode === 'spelling';
    ['scope', 'difficulty', 'length', 'pace'].forEach(name => {
      el.setupForm.querySelectorAll(`[name="${name}"]`).forEach(input => { input.disabled = locked; });
    });
    el.setupDialog.classList.toggle('has-locked-rules', locked);
    el.setupLockNote.hidden = !locked;
    if (locked) {
      el.setupLockNote.textContent = mode === 'spelling' && !el.sprintInput.checked
        ? 'Spell All always uses the full 197-country world set. Enable Competitive to add a time to its board.'
        : 'Competitive rules: World · all 197 · Cartographer · no hints or skips · two seconds per mistake.';
    }
    el.startGameButton.textContent = 'Start Game';
  }

  function configFromForm() {
    const formData = new FormData(el.setupForm);
    const mode = formData.get('mode') || 'locate';
    const sprint = formData.get('sprint') === 'true';
    const config = {
      mode,
      scope: formData.get('scope') || 'World',
      difficulty: Number(formData.get('difficulty') || 2),
      length: formData.get('length') || '10',
      pace: formData.get('pace') || 'relaxed',
      sprint
    };
    if (sprint || mode === 'spelling') {
      config.scope = 'World';
      config.difficulty = 3;
      config.length = 'all';
      config.pace = 'relaxed';
    }
    return config;
  }

  function requestGameFullscreen() {
    if (document.fullscreenElement || !document.documentElement.requestFullscreen) return;
    document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => { /* browser or user preference can block it */ });
  }

  function clearCompetitiveCountdown() {
    countdownHandles.forEach(handle => clearTimeout(handle));
    countdownHandles = [];
    el.countdownOverlay.hidden = true;
    el.body.classList.remove('is-counting-down');
    el.mapStage.classList.remove('is-counting-down');
  }

  function setAnswerControlsDisabled(disabled) {
    el.reverseInput.disabled = disabled;
    el.spellInput.disabled = disabled;
    el.countryAnswerSelect.disabled = disabled;
    el.countryAnswerButton.disabled = disabled;
  }

  function startCompetitiveCountdown() {
    if (!run?.isSprint || !run.active) return;
    clearCompetitiveCountdown();
    run.ready = false;
    setAnswerControlsDisabled(true);
    el.body.classList.add('is-counting-down');
    el.mapStage.classList.add('is-counting-down');
    el.countdownOverlay.hidden = false;
    updateMapInteractionMode();
    COMPETITIVE_COUNTDOWN_STEPS.forEach((step, index) => {
      const handle = window.setTimeout(() => {
        if (!run?.active || !run.isSprint) return;
        el.countdownValue.textContent = step;
        el.countdownLabel.textContent = step === 'GO' ? `${modeLabels[run.config.mode]} · timer started` : index === 0 ? 'Get ready' : 'Focus the map';
        el.countdownOverlay.classList.remove('is-pop');
        requestAnimationFrame(() => el.countdownOverlay.classList.add('is-pop'));
        playSound(step === 'GO' ? 'correct' : 'tick');
        if (step === 'GO') {
          const now = performance.now();
          run.gameStart = now;
          run.questionStart = now;
          run.ready = true;
          setAnswerControlsDisabled(false);
          updateMapInteractionMode();
          updateRunUI();
          if (run.currentMode === 'reverse') requestAnimationFrame(() => el.reverseInput.focus());
          if (run.currentMode === 'spelling' && run.ready !== false) requestAnimationFrame(() => el.spellInput.focus());
          countdownHandles.push(window.setTimeout(() => {
            clearCompetitiveCountdown();
            updateMapInteractionMode();
          }, 420));
        }
      }, index * 620);
      countdownHandles.push(handle);
    });
  }

  function startGame(config) {
    clearCompetitiveCountdown();
    clearTimeout(pendingAutoAdvance);
    pendingAutoAdvance = null;
    if (timerHandle) clearInterval(timerHandle);
    switchView('play', false);
    closeAllDialogs();
    requestGameFullscreen();

    const normalized = { ...config };
    if (normalized.sprint || normalized.mode === 'spelling') {
      normalized.scope = 'World';
      normalized.difficulty = 3;
      normalized.length = 'all';
      normalized.pace = 'relaxed';
    }
    const pool = buildPool(normalized);
    if (!pool.length) {
      toast('That setup produced an empty country pool. Try another scope or difficulty.', 'error');
      openSetup();
      return;
    }

    const rng = normalized.sprint
      ? seededRandom(hashString(`atlas-sprint-v${SPRINT_VERSION}-${normalized.mode}`))
      : normalized.seed ? seededRandom(normalized.seed) : Math.random;
    const shuffled = pool.length > 1 ? balancedCountryOrder(pool, rng) : [...pool];
    const requestedLength = normalized.pace === 'blitz' ? shuffled.length : normalized.length === 'all' ? shuffled.length : Number(normalized.length);
    const selected = shuffled.slice(0, Math.min(requestedLength, shuffled.length));
    const mixedModes = ['locate', 'capitals', 'flags', 'reverse'];
    const mixedModeDeck = normalized.mode === 'mixed'
      ? randomShuffle(selected.map((_, index) => mixedModes[index % mixedModes.length]), rng)
      : [];
    const questions = selected.map((country, index) => ({
      country,
      mode: normalized.mode === 'mixed' ? mixedModeDeck[index] : normalized.mode,
      order: index
    }));

    run = {
      active: true,
      ready: !normalized.sprint,
      completed: false,
      abandoned: false,
      submitted: false,
      isSprint: Boolean(normalized.sprint),
      config: normalized,
      questions,
      index: -1,
      current: null,
      currentMode: normalized.mode === 'spelling' ? 'spelling' : null,
      score: 0,
      streak: 0,
      bestStreak: 0,
      solved: 0,
      firstTry: 0,
      wrongGuesses: 0,
      questionMistakes: 0,
      questionHints: 0,
      solvedCodes: new Set(),
      missedCodes: new Set(),
      history: [],
      spellRecent: [],
      gameStart: performance.now(),
      questionStart: performance.now(),
      paused: false,
      transitioning: false,
      finalDuration: 0,
      officialDuration: 0,
      lastMode: null
    };
    lastConfig = { ...normalized };
    el.body.classList.add('has-active-game');
    el.body.classList.toggle('has-sprint-game', run.isSprint);
    el.body.classList.toggle('has-spelling-game', normalized.mode === 'spelling');
    setMissionPanelCollapsed(false);
    el.headerRunPill.hidden = false;
    el.sprintBadge.hidden = !run.isSprint;
    const existingBest = progress.sprintRecords?.[normalized.mode];
    if (el.sprintBest) el.sprintBest.textContent = existingBest ? `· Best ${formatRaceTime(existingBest.officialMs)}` : '· Best —';
    el.mapStatusDot.className = 'map-status-dot is-live';
    el.mapToolbarMeta.textContent = `Drag to pan · scroll or pinch to zoom up to ${MAX_MAP_SCALE}×`;
    el.mapCallout.hidden = true;
    el.lastCountryCard.hidden = true;
    el.mapTooltip.hidden = true;
    el.toastRegion.replaceChildren();
    fitScope(normalized.scope === 'Weak' || normalized.scope === 'Favorites' ? 'World' : normalized.scope);
    refreshMapClasses();
    timerHandle = window.setInterval(updateTimer, 100);
    if (normalized.mode === 'spelling') startSpellingRound();
    else nextQuestion();
    updateMapInteractionMode();
    if (run.isSprint) startCompetitiveCountdown();
    if (window.matchMedia('(max-width: 860px)').matches && run.currentMode !== 'reverse' && run.currentMode !== 'spelling') {
      requestAnimationFrame(() => setMissionPanelCollapsed(true));
    }
  }

  function startSpellingRound() {
    if (!run?.active) return;
    run.currentMode = 'spelling';
    run.current = null;
    run.questionStart = performance.now();
    el.modeChip.textContent = modeLabels.spelling;
    el.headerMode.textContent = modeLabels.spelling;
    el.flagPrompt.classList.remove('is-visible');
    el.flagPrompt.setAttribute('aria-hidden', 'true');
    el.reverseForm.hidden = true;
    el.spellForm.hidden = false;
    el.keyboardAnswer.hidden = true;
    el.hintBox.hidden = true;
    el.hintButton.closest('.mission-actions').hidden = true;
    el.promptLead.textContent = 'Name every country';
    el.promptText.textContent = 'How fast can you spell the world?';
    el.promptMeta.textContent = 'Enter countries in any order. Common alternate names are accepted, and every correct answer fills the map.';
    el.tinyCountryNote.hidden = true;
    el.mapToolbarTitle.textContent = 'World · Spell All';
    el.mapToolbarMeta.textContent = 'The map shows progress without revealing unnamed countries';
    el.spellInput.value = '';
    el.spellRecent.replaceChildren();
    updateMobilePrompt(null, 'spelling');
    setFeedback('Start anywhere. The first country that comes to mind is usually a good one.', 'info');
    updateRunUI();
    updateMapInteractionMode();
    if (run.ready !== false) requestAnimationFrame(() => el.spellInput.focus());
  }

  function nextQuestion() {
    if (!run?.active) return;
    clearTimeout(pendingAutoAdvance);
    pendingAutoAdvance = null;
    run.transitioning = false;
    run.lastMode = run.currentMode;
    run.index += 1;
    if (run.index >= run.questions.length) {
      finishGame('complete');
      return;
    }

    const entry = run.questions[run.index];
    run.current = entry.country;
    run.currentMode = entry.mode;
    run.questionMistakes = 0;
    run.questionHints = 0;
    run.questionStart = performance.now();

    refreshMapClasses();
    if (run.lastMode === 'reverse') fitScope(run.config.scope === 'Weak' || run.config.scope === 'Favorites' ? 'World' : run.config.scope);
    renderQuestion();
    updateRunUI();
    updateMapInteractionMode();
  }

  function renderQuestion() {
    const country = run.current;
    const mode = run.currentMode;
    el.modeChip.textContent = modeLabels[mode];
    el.headerMode.textContent = modeLabels[mode];
    el.flagPrompt.classList.remove('is-visible');
    el.flagPrompt.setAttribute('aria-hidden', 'true');
    el.flagPrompt.replaceChildren();
    el.reverseForm.hidden = true;
    el.spellForm.hidden = true;
    el.keyboardAnswer.hidden = mode === 'reverse' || run.isSprint;
    el.hintBox.hidden = true;
    el.hintButton.closest('.mission-actions').hidden = run.isSprint;
    el.hintButton.disabled = run.isSprint;
    el.hintCost.textContent = '−150';
    el.skipButton.disabled = run.isSprint;
    el.reverseInput.value = '';
    el.countryAnswerSelect.value = '';
    // The map legend already explains locator dots, so no floating notice is
    // placed over the map during a question.
    el.tinyCountryNote.hidden = true;

    if (mode === 'locate') {
      el.promptLead.textContent = 'Find this country';
      el.promptText.textContent = country.name;
      el.promptMeta.textContent = run.isSprint ? 'Click its location. The next country appears immediately after a correct answer.' : 'Click its location on the map. Wrong guesses get directional feedback.';
      setFeedback(run.isSprint ? 'Competitive timer running. Every mistake adds two seconds.' : 'First click, best click. No pressure. Well, a tasteful amount of pressure.', 'info');
    } else if (mode === 'capitals') {
      el.promptLead.textContent = 'Which country has this capital?';
      el.promptText.textContent = country.capital;
      el.promptMeta.textContent = 'Click the country governed from this capital city.';
      setFeedback(run.isSprint ? 'Read the capital, place the country, keep moving.' : 'Capitals train a different route through the same mental map.', 'info');
    } else if (mode === 'flags') {
      el.promptLead.textContent = 'Locate the flag';
      setFlag(el.flagPrompt, country);
      el.flagPrompt.classList.add('is-visible');
      el.flagPrompt.setAttribute('aria-hidden', 'false');
      el.promptText.textContent = 'Which country flies this flag?';
      el.promptMeta.textContent = 'Read the colors and symbols, then place it on the map.';
      setFeedback(run.isSprint ? 'Actual flag artwork. No abbreviations, no hover answers.' : 'The map is waiting for your best flag deduction.', 'info');
    } else if (mode === 'reverse') {
      if (window.matchMedia('(max-width: 860px)').matches) setMissionPanelCollapsed(false);
      el.promptLead.textContent = 'Read the highlighted map shape';
      el.promptText.textContent = 'What country is this?';
      el.promptMeta.textContent = 'Type the country name. Common alternate names and spellings are accepted.';
      el.reverseForm.hidden = false;
      setCountryClass(country.iso2, 'is-target', true);
      focusCountry(country, country.micro ? 7.5 : country.area > 1_000_000 ? 2.15 : 3.2);
      setFeedback(run.isSprint ? 'Type it and press Enter. Incorrect submissions add two seconds.' : 'Shape recognition is harder than it looks. That is why it works.', 'info');
      if (run.ready !== false) window.setTimeout(() => el.reverseInput.focus(), 50);
    }

    updateMobilePrompt(country, mode);
    el.mapToolbarTitle.textContent = `${run.isSprint ? 'Competitive' : run.config.scope} · ${modeLabels[mode]}`;
    updateMapInteractionMode();
  }

  function refreshMapClasses() {
    clearMapStateClasses();
    if (currentView === 'study') {
      const favorites = new Set(progress.favorites);
      countries.forEach(country => {
        if (studyContinent !== 'World' && country.continent !== studyContinent) setCountryClass(country.iso2, 'is-dimmed', true);
        if (favorites.has(country.iso2)) setCountryClass(country.iso2, 'is-favorite-study', true);
      });
      if (selectedStudyIso) setCountryClass(selectedStudyIso, 'is-selected-study', true);
      return;
    }

    if (run) {
      run.solvedCodes.forEach(code => setCountryClass(code, 'is-solved', true));
      if (run.active && run.currentMode === 'reverse' && run.current) setCountryClass(run.current.iso2, 'is-target', true);
    }
  }

  function submitReverseAnswer() {
    if (!run?.active || run.ready === false || run.currentMode !== 'reverse' || run.transitioning) return;
    const answer = normalizeName(el.reverseInput.value);
    if (!answer) {
      setFeedback('Type a country name first.', 'info');
      return;
    }
    const target = run.current;
    const accepted = new Set([target.name, target.iso2, target.iso3, ...(target.aliases || [])].map(normalizeName));
    if (accepted.has(answer)) {
      resolveQuestion(true, 'correct');
      return;
    }
    el.reverseInput.select();
    const nextMistake = run.questionMistakes + 1;
    const clue = run.isSprint
      ? 'Not quite. Try again — two seconds added.'
      : nextMistake === 1
        ? `Not quite. It is in ${target.subregion}.`
        : `Still not it. The answer starts with “${target.name[0]}” and has ${target.name.replace(/[^A-Za-z]/g, '').length} letters.`;
    registerMistake(clue);
  }

  function recordSpellingCountry(country, elapsed) {
    const record = progress.countries[country.iso2] || { seen: 0, solved: 0, firstTry: 0, misses: 0, fastest: null, modes: {} };
    record.seen += 1;
    record.solved += 1;
    record.firstTry += 1;
    if (!record.fastest || elapsed < record.fastest) record.fastest = Number(elapsed.toFixed(2));
    const modeRecord = record.modes.spelling || { seen: 0, solved: 0 };
    modeRecord.seen += 1;
    modeRecord.solved += 1;
    record.modes.spelling = modeRecord;
    progress.countries[country.iso2] = record;
    progress.totalQuestions += 1;
    progress.totalSolved += 1;
    progress.firstTry += 1;
    progress.continentWins[country.continent] = true;
    progress.modeSolved.spelling = (progress.modeSolved.spelling || 0) + 1;
    if (country.micro) progress.microCorrect += 1;
    saveProgress();
  }

  function renderSpellRecent() {
    el.spellRecent.innerHTML = run.spellRecent.slice(0, 8).map(country => `<span>${flagMarkup(country, 'flag-art-inline')} ${escapeHtml(country.name)}</span>`).join('');
  }

  function submitSpellingAnswer() {
    if (!run?.active || run.ready === false || run.currentMode !== 'spelling') return;
    const raw = el.spellInput.value;
    const answer = normalizeName(raw);
    if (!answer) return;
    const country = spellingIndex.get(answer);
    if (!country) {
      registerMistake('That name is not an unambiguous country in the 197-country set. Check the spelling and try again.', { allowReveal: false });
      el.spellInput.select();
      return;
    }
    if (run.solvedCodes.has(country.iso2)) {
      setFeedback(`${country.name} is already on your map.`, 'info');
      el.spellInput.select();
      return;
    }
    const elapsed = Math.max(0.01, (performance.now() - run.gameStart) / 1000);
    run.solvedCodes.add(country.iso2);
    run.solved += 1;
    run.firstTry += 1;
    run.streak += 1;
    run.bestStreak = Math.max(run.bestStreak, run.streak);
    run.history.push({ iso2: country.iso2, mode: 'spelling', solved: true, clean: true, elapsed, mistakes: 0, hints: 0, reason: 'typed', points: 0 });
    run.spellRecent.unshift(country);
    recordSpellingCountry(country, elapsed);
    setCountryClass(country.iso2, 'is-solved', true);
    setCountryClass(country.iso2, 'is-correct', true);
    window.setTimeout(() => setCountryClass(country.iso2, 'is-correct', false), 420);
    setFeedback(`${country.name} added. ${countries.length - run.solved} left.`, 'correct');
    playSound('correct');
    renderSpellRecent();
    el.spellInput.value = '';
    updateRunUI();
    checkAchievements();
    if (run.solved >= countries.length) {
      run.transitioning = true;
      window.setTimeout(() => finishGame('complete'), 260);
    }
  }

  function useHint() {
    if (!run?.active || run.ready === false || run.isSprint || run.currentMode === 'spelling' || !run.current || run.transitioning || run.questionHints >= 3) return;
    run.questionHints += 1;
    run.score = Math.max(0, run.score - 150);
    const country = run.current;
    let text = '';

    if (run.questionHints === 1) {
      text = `${country.subregion}, ${country.continent}. ${country.landlocked ? 'It is landlocked.' : 'It has a coastline or is an island.'}`;
    } else if (run.questionHints === 2) {
      if (run.currentMode === 'capitals') {
        text = country.borderNames.length ? `It borders ${country.borderNames.slice(0, 3).join(', ')}${country.borderNames.length > 3 ? ' and others' : ''}.` : 'It has no land borders.';
      } else if (run.currentMode === 'reverse') {
        const words = country.name.split(/\s+/);
        text = `${words.length} word${words.length === 1 ? '' : 's'} · starts with “${country.name[0]}” · capital: ${country.capital}.`;
      } else {
        text = `Its capital is ${country.capital}. ${country.borderNames.length ? `It borders ${country.borderNames.slice(0, 2).join(' and ')}.` : 'It has no land borders.'}`;
      }
      fitScope(country.continent);
    } else {
      text = run.currentMode === 'reverse'
        ? `The answer is ${maskCountryName(country.name)}.`
        : 'The target is pulsing on the map for a moment.';
      setCountryClass(country.iso2, 'is-target', true);
      focusCountry(country, country.micro ? 5.8 : 3.4);
      window.setTimeout(() => {
        if (run?.active && run.current?.iso2 === country.iso2 && run.currentMode !== 'reverse') setCountryClass(country.iso2, 'is-target', false);
      }, 1200);
      el.hintButton.disabled = true;
    }

    el.hintText.textContent = text;
    el.hintBox.hidden = false;
    el.hintCost.textContent = run.questionHints >= 3 ? 'used' : '−150';
    setFeedback('Hint logged. You can still solve it, but the clean-streak bonus is gone.', 'info');
    updateRunUI();
  }

  function maskCountryName(name) {
    return name.split('').map((char, index) => {
      if (!/[A-Za-zÀ-ž]/.test(char)) return char;
      if (index === 0 || /\s|-/.test(name[index - 1])) return char;
      return '•';
    }).join('');
  }

  function skipQuestion(reason = 'skip') {
    if (!run?.active || run.ready === false || run.isSprint || run.currentMode === 'spelling' || run.transitioning) return;
    resolveQuestion(false, reason);
  }

  function resolveQuestion(solved, reason) {
    if (!run?.active || !run.current) return;
    if (run.transitioning && reason === 'correct') return;
    clearTimeout(pendingAutoAdvance);
    run.transitioning = true;
    const country = run.current;
    const elapsed = Math.max(0.01, (performance.now() - run.questionStart) / 1000);
    const clean = solved && run.questionMistakes === 0 && run.questionHints === 0;
    let points = 0;

    if (solved) {
      if (clean) {
        run.streak += 1;
        run.firstTry += 1;
      } else {
        run.streak = 0;
      }
      run.bestStreak = Math.max(run.bestStreak, run.streak);
      const speedBonus = Math.max(0, Math.round(350 - elapsed * 18));
      points = 650 + speedBonus + (clean ? 150 : 0) + run.streak * 35;
      run.score += points;
      run.solved += 1;
      run.solvedCodes.add(country.iso2);
      setCountryClass(country.iso2, 'is-target', false);
      setCountryClass(country.iso2, 'is-correct', true);
      setFeedback(run.isSprint ? `${country.name}. Keep moving.` : `${clean ? 'Clean hit' : 'Solved'} — ${country.name}. +${formatNumber(points)} points.`, 'correct');
      playSound('correct');
      if (clean && elapsed < 3) unlockAchievement('lightning');
    } else {
      run.streak = 0;
      run.missedCodes.add(country.iso2);
      setCountryClass(country.iso2, 'is-target', true);
      focusCountry(country, country.micro ? 5.5 : 3.0);
      const reasonCopy = reason === 'timeout' ? 'Time.' : reason === 'skip' ? 'Skipped.' : 'Answer revealed.';
      setFeedback(`${reasonCopy} ${country.name} — capital: ${country.capital}.`, 'wrong');
      playSound('reveal');
    }

    recordQuestion(country, solved, clean, elapsed, reason);
    run.history.push({ iso2: country.iso2, mode: run.currentMode, solved, clean, elapsed, mistakes: run.questionMistakes, hints: run.questionHints, reason, points });
    updateRunUI();
    if (solved) {
      pulseElement(el.questionStat);
      pulseElement(run.isSprint ? el.timeStat : el.scoreStat);
      if (clean && !run.isSprint) pulseElement(el.streakStat);
    }
    checkAchievements();

    const delay = run.isSprint ? 90 : run.config.pace === 'blitz' ? 230 : solved ? 620 : 1150;
    pendingAutoAdvance = window.setTimeout(() => {
      setCountryClass(country.iso2, 'is-correct', false);
      setCountryClass(country.iso2, 'is-target', false);
      nextQuestion();
    }, delay);
  }

  function recordQuestion(country, solved, clean, elapsed, reason) {
    const record = progress.countries[country.iso2] || { seen: 0, solved: 0, firstTry: 0, misses: 0, fastest: null, modes: {} };
    record.seen += 1;
    if (solved) record.solved += 1;
    if (clean) record.firstTry += 1;
    record.misses += run.questionMistakes + (!solved ? 1 : 0);
    if (clean && (!record.fastest || elapsed < record.fastest)) record.fastest = Number(elapsed.toFixed(2));
    const modeRecord = record.modes[run.currentMode] || { seen: 0, solved: 0 };
    modeRecord.seen += 1;
    if (solved) modeRecord.solved += 1;
    record.modes[run.currentMode] = modeRecord;
    progress.countries[country.iso2] = record;
    progress.totalQuestions += 1;
    if (solved) progress.totalSolved += 1;
    if (clean) progress.firstTry += 1;
    progress.wrongGuesses += run.questionMistakes + (!solved ? 1 : 0);
    progress.bestStreak = Math.max(progress.bestStreak, run.bestStreak);
    if (solved) {
      progress.continentWins[country.continent] = true;
      progress.modeSolved[run.currentMode] = (progress.modeSolved[run.currentMode] || 0) + 1;
      if (country.micro) progress.microCorrect += 1;
    }
    saveProgress();
  }

  function showCountryCard(country) {
    setFlag(el.lastFlag, country);
    el.lastCountryName.textContent = country.name;
    el.lastCapital.textContent = country.capital;
    el.lastRegion.textContent = `${country.subregion}, ${country.continent}`;
    el.lastArea.textContent = formatArea(country.area);
    el.lastNeighbors.textContent = country.borderNames.length ? country.borderNames.slice(0, 4).join(', ') + (country.borderNames.length > 4 ? ` +${country.borderNames.length - 4}` : '') : 'No land borders';
    el.lastCapitalNote.hidden = !country.capitalNote;
    el.lastCapitalNote.textContent = country.capitalNote || '';
    el.lastCountryCard.hidden = false;
  }

  function currentRunElapsedMs() {
    if (!run || run.ready === false) return 0;
    return Math.max(0, performance.now() - run.gameStart);
  }

  function updateRunUI() {
    if (!run) return;
    const spelling = run.currentMode === 'spelling';
    const total = spelling ? countries.length : run.questions.length;
    const answered = run.history.length;
    const currentNumber = spelling ? run.solved : Math.min(total, run.index + 1);
    const runAccuracy = answered || run.wrongGuesses
      ? Math.round(run.firstTry / Math.max(1, answered + (spelling ? run.wrongGuesses : 0)) * 100)
      : null;
    const penaltySeconds = run.wrongGuesses * SPRINT_PENALTY_SECONDS;

    if (spelling) {
      el.questionLabel.textContent = 'Named';
      el.scoreLabel.textContent = 'Mistakes';
      el.streakLabel.textContent = 'Penalty';
      el.questionStat.textContent = `${run.solved} / ${total}`;
      el.scoreStat.textContent = String(run.wrongGuesses);
      el.streakStat.textContent = `+${penaltySeconds}s`;
      el.spellCount.textContent = `${run.solved} of ${total} named`;
      el.spellRemaining.textContent = `${Math.max(0, total - run.solved)} left`;
      el.spellMeter.style.width = `${run.solved / total * 100}%`;
      if (el.mobilePromptText) el.mobilePromptText.textContent = `${run.solved} / ${total} named`;
    } else if (run.isSprint) {
      el.questionLabel.textContent = 'Country';
      el.scoreLabel.textContent = 'Mistakes';
      el.streakLabel.textContent = 'Penalty';
      el.questionStat.textContent = `${currentNumber} / ${total}`;
      el.scoreStat.textContent = String(run.wrongGuesses);
      el.streakStat.textContent = `+${penaltySeconds}s`;
    } else {
      el.questionLabel.textContent = 'Question';
      el.scoreLabel.textContent = 'Score';
      el.streakLabel.textContent = 'Streak';
      el.questionStat.textContent = `${currentNumber} / ${total}`;
      el.scoreStat.textContent = formatNumber(run.score);
      el.streakStat.textContent = String(run.streak);
    }

    const officialMs = currentRunElapsedMs() + (run.isSprint ? penaltySeconds * 1000 : 0);
    el.headerScore.textContent = run.isSprint ? formatRaceTime(officialMs) : spelling ? `${run.solved}/${total}` : formatNumber(run.score);
    el.accuracyStat.textContent = runAccuracy === null ? '—' : `${runAccuracy}%`;
    el.accuracyMeter.style.width = `${runAccuracy ?? 0}%`;
    el.roundProgress.style.width = `${total ? answered / total * 100 : 0}%`;
    el.footerProgressText.textContent = spelling
      ? `${run.solved} named · ${Math.max(0, total - run.solved)} remaining`
      : `${answered} solved or reviewed · ${Math.max(0, total - answered)} remaining`;
  }

  function progressPercent(value, total) {
    return total ? Math.round(value / total * 100) : 0;
  }

  function updateTimer() {
    if (!run?.active || run.paused) return;
    if (run.ready === false) {
      el.timeLabel.textContent = run.isSprint ? 'Starts in' : 'Time';
      el.timeStat.textContent = run.isSprint ? 'Ready' : '0:00';
      if (run.isSprint) el.headerScore.textContent = '0:00.0';
      return;
    }
    const now = performance.now();
    const totalElapsed = (now - run.gameStart) / 1000;
    const questionElapsed = (now - run.questionStart) / 1000;

    if (run.isSprint) {
      const officialMs = (now - run.gameStart) + run.wrongGuesses * SPRINT_PENALTY_SECONDS * 1000;
      el.timeLabel.textContent = 'Final';
      el.timeStat.textContent = formatRaceTime(officialMs);
      el.headerScore.textContent = formatRaceTime(officialMs);
      return;
    }
    if (run.currentMode === 'spelling') {
      el.timeLabel.textContent = 'Time';
      el.timeStat.textContent = formatTime(totalElapsed);
      return;
    }
    if (run.transitioning) return;

    if (run.config.pace === 'blitz') {
      const remaining = Math.max(0, 60 - totalElapsed);
      el.timeLabel.textContent = 'Blitz';
      el.timeStat.textContent = `${remaining.toFixed(1)}s`;
      if (remaining <= 0.01) finishGame('blitz');
    } else if (run.config.pace === '10' || run.config.pace === '20') {
      const limit = Number(run.config.pace);
      const remaining = Math.max(0, limit - questionElapsed);
      el.timeLabel.textContent = 'Left';
      el.timeStat.textContent = `${remaining.toFixed(1)}s`;
      if (remaining <= 0.01) resolveQuestion(false, 'timeout');
    } else {
      el.timeLabel.textContent = 'Time';
      el.timeStat.textContent = formatTime(totalElapsed);
    }
  }

  function recordRunSummary(reason) {
    if (!run) return;
    const mode = run.config.mode;
    const spelling = mode === 'spelling';
    const attempts = spelling ? run.solved + run.wrongGuesses : run.history.length;
    const accuracy = Math.round(run.firstTry / Math.max(1, attempts) * 100);
    const current = modeStat(mode);
    progress.modeStats[mode] = {
      runs: current.runs + 1,
      competitiveRuns: current.competitiveRuns + (run.isSprint ? 1 : 0),
      questions: current.questions + attempts,
      solved: current.solved + run.solved,
      firstTry: current.firstTry + run.firstTry,
      mistakes: current.mistakes + run.wrongGuesses,
      bestScore: Math.max(current.bestScore, Number(run.score) || 0),
      bestAccuracy: Math.max(current.bestAccuracy, accuracy),
      bestStreak: Math.max(current.bestStreak, run.bestStreak),
      lastPlayed: new Date().toISOString()
    };
    const completedAt = new Date().toISOString();
    const summary = {
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      mode,
      competitive: Boolean(run.isSprint),
      scope: run.config.scope,
      reason,
      questions: attempts,
      solved: run.solved,
      accuracy,
      score: run.score,
      mistakes: run.wrongGuesses,
      bestStreak: run.bestStreak,
      durationMs: Math.round(run.finalDuration * 1000),
      officialMs: Math.round(run.officialDuration * 1000),
      completedAt
    };
    progress.recentRuns = [summary, ...(progress.recentRuns || [])].slice(0, 12);
  }

  function finishGame(reason) {
    if (!run?.active) return;
    clearCompetitiveCountdown();
    clearTimeout(pendingAutoAdvance);
    pendingAutoAdvance = null;
    if (timerHandle) clearInterval(timerHandle);
    timerHandle = null;
    run.active = false;
    run.completed = true;
    run.finalDuration = Math.max(0, (performance.now() - run.gameStart) / 1000);
    run.officialDuration = run.finalDuration + (run.isSprint ? run.wrongGuesses * SPRINT_PENALTY_SECONDS : 0);
    recordRunSummary(reason);
    progress.games += 1;
    progress.bestStreak = Math.max(progress.bestStreak, run.bestStreak);
    if (run.history.length >= 10 && run.firstTry === run.history.length) unlockAchievement('clean_sweep');
    checkAchievements();
    saveProgress();
    el.body.classList.remove('has-active-game', 'has-sprint-game', 'has-spelling-game');
    el.headerRunPill.hidden = true;
    el.sprintBadge.hidden = true;
    el.mapStatusDot.className = 'map-status-dot';
    updateMapInteractionMode();
    el.roundProgress.style.width = '100%';
    el.footerProgressText.textContent = reason === 'blitz' ? 'Blitz complete' : 'Round complete';
    renderResults(reason);
    if (run.isSprint && reason === 'complete' && run.history.length === countries.length) submitSprintScore(run);
  }

  function renderResults(reason) {
    const answered = run.history.length;
    const spelling = run.config.mode === 'spelling';
    const firstTryAccuracy = spelling
      ? Math.round(run.solved / Math.max(1, run.solved + run.wrongGuesses) * 100)
      : answered ? Math.round(run.firstTry / answered * 100) : 0;
    const missed = [...run.missedCodes].map(code => byIso.get(code)).filter(Boolean);
    const rank = run.isSprint
      ? ['Competitive Complete', run.wrongGuesses ? `${run.wrongGuesses} mistake${run.wrongGuesses === 1 ? '' : 's'} added ${run.wrongGuesses * SPRINT_PENALTY_SECONDS} seconds to the clock.` : 'A clean run with no penalty time.']
      : firstTryAccuracy === 100 && answered >= 10
        ? ['Atlas Legend', 'No wrong guesses. The map has filed a formal complaint.']
        : firstTryAccuracy >= 90
          ? ['Cartographer', 'Very little daylight between you and a frighteningly good mental map.']
          : firstTryAccuracy >= 75
            ? ['Navigator', 'Strong bearings. Your weak spots are now specific enough to train.']
            : firstTryAccuracy >= 50
              ? ['Pathfinder', 'The broad shape is there. Repetition will fill in the awkward corners.']
              : ['Explorer', 'You found the edge of your map. That is useful information, honestly.'];

    el.resultsEyebrow.textContent = run.isSprint ? `${modeLabels[run.config.mode]} · Competitive` : reason === 'blitz' ? 'Sixty seconds up' : 'Expedition complete';
    el.resultsTitle.textContent = run.isSprint ? 'All 197. Clock stopped.' : spelling ? 'You named the world.' : firstTryAccuracy >= 80 ? 'That map is starting to stick.' : 'Good. Now we know what to practice.';
    el.viewLeaderboardButton.hidden = !run.isSprint;
    el.viewLeaderboardButton.textContent = `View ${modeLabels[run.config.mode]} Times`;
    el.resultsSummary.textContent = run.isSprint
      ? `You completed all 197 countries in ${modeLabels[run.config.mode]}. Your final time includes the two-second mistake penalty.`
      : spelling
        ? `You named ${run.solved} of ${countries.length} countries in ${formatTime(run.finalDuration)}.`
        : `You reviewed ${answered} countr${answered === 1 ? 'y' : 'ies'} across ${modeLabels[run.config.mode] || 'mixed play'}. ${missed.length ? `${missed.length} need another pass.` : 'Nothing landed on the review pile.'}`;

    if (run.isSprint) {
      el.resultScoreLabel.textContent = 'Final time';
      el.resultAccuracyLabel.textContent = 'Accuracy';
      el.resultStreakLabel.textContent = 'Mistakes';
      el.resultTimeLabel.textContent = 'Raw time';
      el.resultScore.textContent = formatRaceTime(run.officialDuration * 1000);
      el.resultAccuracy.textContent = `${firstTryAccuracy}%`;
      el.resultStreak.textContent = String(run.wrongGuesses);
      el.resultTime.textContent = formatRaceTime(run.finalDuration * 1000);
      el.sprintResultCard.hidden = false;
      el.sprintOfficialTime.textContent = formatRaceTime(run.officialDuration * 1000);
      el.sprintRawTime.textContent = formatRaceTime(run.finalDuration * 1000);
      el.sprintMistakes.textContent = String(run.wrongGuesses);
      el.sprintPenalty.textContent = `+${run.wrongGuesses * SPRINT_PENALTY_SECONDS}s`;
      el.sprintResultMode.textContent = modeLabels[run.config.mode];
      setSprintSubmissionStatus(globalLeaderboardEnabled() ? 'Preparing your submission…' : 'Saving your best time on this device…');
    } else {
      el.resultScoreLabel.textContent = spelling ? 'Countries' : 'Score';
      el.resultAccuracyLabel.textContent = spelling ? 'Entry accuracy' : 'First-try accuracy';
      el.resultStreakLabel.textContent = spelling ? 'Mistakes' : 'Best streak';
      el.resultTimeLabel.textContent = 'Time';
      el.resultScore.textContent = spelling ? `${run.solved} / ${countries.length}` : formatNumber(run.score);
      el.resultAccuracy.textContent = `${firstTryAccuracy}%`;
      el.resultStreak.textContent = spelling ? String(run.wrongGuesses) : String(run.bestStreak);
      el.resultTime.textContent = formatTime(run.finalDuration);
      el.sprintResultCard.hidden = true;
    }
    el.resultRank.textContent = rank[0];
    el.resultRankCopy.textContent = rank[1];
    el.missedSection.hidden = missed.length === 0;
    el.missedCount.textContent = `${missed.length} countr${missed.length === 1 ? 'y' : 'ies'}`;
    el.missedList.innerHTML = missed.slice(0, 18).map(country => `<button type="button" data-study-iso="${country.iso2}">${flagMarkup(country, 'flag-art-inline')} ${escapeHtml(country.name)}</button>`).join('');
    el.practiceMissedButton.disabled = missed.length === 0;
    el.resultsDialog.showModal();
    if (run.isSprint || firstTryAccuracy >= 80) burstConfetti(run.isSprint && run.wrongGuesses === 0 ? 160 : firstTryAccuracy === 100 ? 140 : 80);
  }

  function pulseElement(node) {
    if (!node || reduceMotion) return;
    node.classList.remove('is-pulsing');
    requestAnimationFrame(() => node.classList.add('is-pulsing'));
    window.setTimeout(() => node.classList.remove('is-pulsing'), 420);
  }

  function setFeedback(message, type = 'info') {
    el.feedback.classList.remove('is-correct', 'is-wrong', 'is-info');
    el.feedback.classList.add(`is-${type}`);
    el.feedbackText.textContent = message;
    if (el.mobilePromptMeta && run?.active) el.mobilePromptMeta.textContent = message;
  }

  function showMapCallout(country) {
    if (!country || (run?.active && currentView === 'play')) {
      if (el.mapCallout) el.mapCallout.hidden = true;
      return;
    }
    setFlag(el.calloutFlag, country, { decorative: true });
    el.calloutName.textContent = country.name;
    el.calloutMeta.textContent = `${country.capital} · ${country.subregion}`;
    el.mapCallout.hidden = false;
    clearTimeout(showMapCallout.timer);
    showMapCallout.timer = setTimeout(() => { el.mapCallout.hidden = true; }, 2400);
  }

  function openSetup(preset = null) {
    if (preset) applySetupPreset(preset);
    updateSetupModeUI();
    el.setupDialog.classList.toggle('can-close', Boolean(run));
    pauseForDialog();
    if (!el.setupDialog.open) el.setupDialog.showModal();
  }

  function applySetupPreset(preset) {
    Object.entries(preset).forEach(([name, value]) => {
      const input = el.setupForm.querySelector(`[name="${name}"][value="${CSS.escape(String(value))}"]`);
      if (input) input.checked = true;
    });
  }

  function closeAllDialogs() {
    [el.setupDialog, el.resultsDialog, el.leaderboardDialog, el.accountDialog, el.statsDialog, el.helpDialog].forEach(dialog => {
      if (dialog?.open) dialog.close();
    });
    dialogPauseDepth = 0;
    resumeAfterDialog();
  }

  function pauseForDialog() {
    dialogPauseDepth += 1;
    if (run?.isSprint) return;
    if (dialogPauseDepth === 1 && run?.active && !run.paused) {
      run.paused = true;
      pauseStarted = performance.now();
    }
  }

  function resumeAfterDialog() {
    if (dialogPauseDepth > 0) dialogPauseDepth -= 1;
    if (dialogPauseDepth === 0 && run?.active && run.paused) {
      const pausedFor = performance.now() - pauseStarted;
      run.gameStart += pausedFor;
      run.questionStart += pausedFor;
      run.paused = false;
    }
  }

  function switchView(view, autoSetup = true) {
    if (view === 'study' && run?.active && run.isSprint) {
      toast('The competitive timer is still running. Finish the game or start a new one first.', 'error');
      return;
    }
    currentView = view;
    const isStudy = view === 'study';
    el.body.classList.toggle('is-study', isStudy);
    el.gamePanel.hidden = isStudy;
    el.studyPanel.hidden = !isStudy;
    el.playNav.classList.toggle('is-active', !isStudy);
    el.studyNav.classList.toggle('is-active', isStudy);
    el.mapStatusDot.className = `map-status-dot ${isStudy ? 'is-study' : run?.active ? 'is-live' : ''}`;

    if (isStudy) {
      if (run?.active && !run.paused) {
        run.paused = true;
        pauseStarted = performance.now();
      }
      el.mapToolbarTitle.textContent = `${studyContinent} · Study map`;
      el.mapToolbarMeta.textContent = 'Hover or tap a country to open its field guide';
      el.footerProgressText.textContent = `${countries.filter(country => studyContinent === 'World' || country.continent === studyContinent).length} quiz entries in view`;
      el.roundProgress.style.width = `${worldMastery()}%`;
      fitScope(studyContinent);
    } else {
      if (run?.active && run.paused && dialogPauseDepth === 0) {
        const pausedFor = performance.now() - pauseStarted;
        run.gameStart += pausedFor;
        run.questionStart += pausedFor;
        run.paused = false;
      }
      if (run?.active) {
        el.mapToolbarTitle.textContent = `${run.isSprint ? 'Competitive' : run.config.scope} · ${modeLabels[run.currentMode]}`;
        updateRunUI();
        if (run.currentMode === 'reverse') focusCountry(run.current, run.current.micro ? 7.5 : 3.2);
        if (run.currentMode === 'spelling' && run.ready !== false) requestAnimationFrame(() => el.spellInput.focus());
      } else {
        el.mapToolbarTitle.textContent = 'World map';
        el.footerProgressText.textContent = 'No active round';
        el.roundProgress.style.width = '0%';
        fitScope('World');
        if (autoSetup) openSetup();
      }
    }
    refreshMapClasses();
    updateMapInteractionMode();
  }

  function selectStudyCountry(iso2, focus = false) {
    const country = byIso.get(iso2);
    if (!country) return;
    selectedStudyIso = iso2;
    el.studyPlaceholder.hidden = true;
    el.studyDetails.hidden = false;
    setFlag(el.studyFlag, country);
    el.studySubregion.textContent = `${country.subregion} · ${country.continent}`;
    el.studyName.textContent = country.name;
    el.studyCapital.textContent = country.capital;
    el.studyArea.textContent = formatArea(country.area);
    el.studyGeography.textContent = country.landlocked ? 'Landlocked' : country.borderNames.length ? 'Coastal country' : 'Island / no land borders';
    el.studyBorders.textContent = country.borderNames.length ? country.borderNames.join(', ') : 'No land borders';
    el.studyCapitalNote.hidden = !country.capitalNote;
    el.studyCapitalNote.textContent = country.capitalNote || '';
    const mastery = countryMastery(country.iso2);
    const record = progress.countries[country.iso2];
    el.studyMasteryLabel.textContent = masteryLabel(mastery, record);
    el.studyMasteryMeter.style.width = `${mastery}%`;
    el.studyMasteryText.textContent = record
      ? `${record.firstTry} first-try hit${record.firstTry === 1 ? '' : 's'} in ${record.seen} appearance${record.seen === 1 ? '' : 's'}${record.fastest ? ` · fastest ${record.fastest.toFixed(1)}s` : ''}.`
      : 'Play a quiz to start building a memory record for this country.';
    const favorite = progress.favorites.includes(country.iso2);
    el.favoriteButton.classList.toggle('is-favorite', favorite);
    el.favoriteButton.textContent = favorite ? '★' : '☆';
    el.favoriteButton.setAttribute('aria-label', favorite ? `Remove ${country.name} from favorites` : `Add ${country.name} to favorites`);
    el.practiceRegionButton.dataset.continent = country.continent;
    el.focusCountryButton.dataset.iso = country.iso2;
    refreshMapClasses();
    showMapCallout(country);
    if (focus) focusCountry(country);
  }

  function masteryLabel(score, record) {
    if (!record) return 'Unseen';
    if (score >= 80 && record.seen >= 3) return 'Mastered';
    if (score >= 60) return 'Strong';
    if (score >= 35) return 'Developing';
    return 'Needs review';
  }

  function countryMastery(iso2) {
    const record = progress.countries[iso2];
    if (!record?.seen) return 0;
    const solvedRate = record.solved / record.seen;
    const cleanRate = record.firstTry / record.seen;
    const exposure = 0.55 + 0.45 * Math.min(1, record.seen / 3);
    return Math.round((solvedRate * 0.4 + cleanRate * 0.6) * 100 * exposure);
  }

  function worldMastery() {
    return Math.round(countries.reduce((sum, country) => sum + countryMastery(country.iso2), 0) / countries.length);
  }

  function weakCountries() {
    return countries
      .map(country => ({ country, mastery: countryMastery(country.iso2), record: progress.countries[country.iso2] }))
      .filter(item => item.record?.seen && (item.mastery < 75 || item.record.misses > 0))
      .sort((a, b) => a.mastery - b.mastery || b.record.misses - a.record.misses || a.country.name.localeCompare(b.country.name));
  }

  function renderStats() {
    const seen = countries.filter(country => progress.countries[country.iso2]?.seen).length;
    const mastered = countries.filter(country => {
      const record = progress.countries[country.iso2];
      return record?.seen >= 3 && countryMastery(country.iso2) >= 80;
    }).length;
    const overallAccuracy = progress.totalQuestions ? Math.round(progress.firstTry / progress.totalQuestions * 100) : null;
    const mastery = worldMastery();
    el.statsGames.textContent = formatNumber(progress.games);
    el.statsSolved.textContent = formatNumber(progress.totalSolved);
    el.statsAccuracy.textContent = overallAccuracy === null ? '—' : `${overallAccuracy}%`;
    el.statsBestStreak.textContent = String(progress.bestStreak);
    el.statsSeen.textContent = `${seen} / ${countries.length}`;
    el.statsMastered.textContent = String(mastered);
    el.worldMasteryLabel.textContent = `${mastery}%`;
    el.worldMasteryMeter.style.width = `${mastery}%`;
    el.worldMasteryCopy.textContent = seen
      ? `${seen} countries have appeared. Mastery rewards repeated first-try recall, not a single lucky click.`
      : 'Start a round and the map will learn where you need repetition.';

    const modeOrder = ['locate', 'capitals', 'flags', 'reverse', 'mixed', 'spelling'];
    if (el.modeProgressGrid) {
      el.modeProgressGrid.innerHTML = modeOrder.map(mode => {
        const stat = modeStat(mode);
        const accuracy = stat.questions ? Math.round(stat.firstTry / stat.questions * 100) : null;
        const best = progress.sprintRecords?.[mode];
        return `<article class="mode-progress-card"><div class="mode-progress-head"><strong>${escapeHtml(modeLabels[mode])}</strong><button type="button" data-mode-practice="${mode}">Play</button></div><div class="mode-progress-values"><span><b>${formatNumber(stat.runs)}</b><small>games</small></span><span><b>${accuracy === null ? '—' : `${accuracy}%`}</b><small>accuracy</small></span><span><b>${best ? formatRaceTime(best.officialMs) : '—'}</b><small>best time</small></span></div></article>`;
      }).join('');
    }

    if (el.recentRuns) {
      const recent = Array.isArray(progress.recentRuns) ? progress.recentRuns.slice(0, 8) : [];
      el.recentRuns.innerHTML = recent.length ? recent.map(item => {
        const when = new Date(item.completedAt);
        const date = Number.isNaN(when.valueOf()) ? '' : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(when);
        const headline = item.competitive ? formatRaceTime(item.officialMs) : item.mode === 'spelling' ? `${item.solved}/${countries.length}` : `${item.accuracy}%`;
        const detail = item.competitive ? `${item.mistakes} mistake${item.mistakes === 1 ? '' : 's'}` : `${item.solved} solved · ${formatTime(item.durationMs / 1000)}`;
        return `<div class="recent-run"><span class="recent-run-mode">${escapeHtml(modeLabels[item.mode] || item.mode)}</span><div><strong>${headline}</strong><small>${escapeHtml(detail)}</small></div><time datetime="${escapeHtml(item.completedAt || '')}">${escapeHtml(date)}</time></div>`;
      }).join('') : '<div class="empty-state">Your latest completed games will appear here.</div>';
    }

    const weak = weakCountries().slice(0, 8);
    el.weakList.innerHTML = weak.length
      ? weak.map(item => `<div class="weak-item"><span class="flag">${flagMarkup(item.country, 'flag-art-inline')}</span><div><strong>${escapeHtml(item.country.name)}</strong><small>${item.mastery}% mastery · ${item.record.misses} miss${item.record.misses === 1 ? '' : 'es'}</small></div><button type="button" data-practice-iso="${item.country.iso2}">Practice</button></div>`).join('')
      : '<div class="empty-state">No weak spots yet. That either means you are terrifyingly good, or you have not played. The data refuses to speculate.</div>';
    el.practiceWeakButton.disabled = weak.length === 0;

    const unlockedCount = achievements.filter(item => progress.unlocked[item.id]).length;
    el.achievementCount.textContent = `${unlockedCount} / ${achievements.length}`;
    el.achievementGrid.innerHTML = achievements.map(item => `<div class="achievement ${progress.unlocked[item.id] ? 'is-unlocked' : ''}"><span class="achievement-icon">${item.icon}</span><div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.copy)}</small></div></div>`).join('');
  }

  function openStats() {
    renderStats();
    pauseForDialog();
    el.statsDialog.showModal();
  }

  function unlockAchievement(id) {
    if (progress.unlocked[id]) return;
    progress.unlocked[id] = Date.now();
    const achievement = achievements.find(item => item.id === id);
    if (achievement) {
      // Achievements are recorded immediately, but a live geography question
      // never gets covered by a notification rectangle. They remain visible
      // in Progress and can still be announced outside active play.
      if (!(run?.active && currentView === 'play')) toast(`Achievement unlocked: ${achievement.name}`, 'achievement');
      playSound('achievement');
    }
    saveProgress();
  }

  function checkAchievements() {
    if (progress.totalSolved >= 1) unlockAchievement('first_step');
    if (progress.bestStreak >= 10) unlockAchievement('streak_10');
    if (Object.keys(progress.continentWins).length >= 5) unlockAchievement('globe_trotter');
    if (progress.microCorrect >= 10) unlockAchievement('micro_master');
  }

  function toggleFavorite() {
    if (!selectedStudyIso) return;
    const country = byIso.get(selectedStudyIso);
    const index = progress.favorites.indexOf(selectedStudyIso);
    if (index >= 0) {
      progress.favorites.splice(index, 1);
      toast(`${country.name} removed from favorites.`);
    } else {
      progress.favorites.push(selectedStudyIso);
      toast(`${country.name} added to favorites.`);
    }
    saveProgress();
    selectStudyCountry(selectedStudyIso, false);
  }

  function setStudyFilter(continent) {
    studyContinent = continent;
    $$('#studyFilters button').forEach(button => button.classList.toggle('is-active', button.dataset.continent === continent));
    el.mapToolbarTitle.textContent = `${continent} · Study map`;
    const count = countries.filter(country => continent === 'World' || country.continent === continent).length;
    el.footerProgressText.textContent = `${count} quiz entries in view`;
    fitScope(continent);
    refreshMapClasses();
  }

  function findStudyCountry(value) {
    const normalized = normalizeName(value);
    let country = searchIndex.get(normalized);
    if (!country && normalized.length >= 3) {
      country = countries.find(item => normalizeName(item.name).startsWith(normalized));
    }
    if (!country) {
      toast(`I could not match “${value}” to a quiz country.`, 'error');
      return;
    }
    if (studyContinent !== 'World' && country.continent !== studyContinent) setStudyFilter('World');
    selectStudyCountry(country.iso2, true);
    el.studySearch.value = country.name;
  }

  function playSound(type) {
    if (settings.muted) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      const now = audioContext.currentTime;
      const patterns = {
        correct: [[523.25, 0, .08], [659.25, .08, .11]],
        wrong: [[180, 0, .13]],
        reveal: [[260, 0, .07], [220, .07, .1]],
        achievement: [[523.25, 0, .08], [659.25, .08, .08], [783.99, .16, .14]],
        tick: [[392, 0, .055]]
      };
      (patterns[type] || patterns.correct).forEach(([frequency, offset, duration]) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = type === 'wrong' ? 'sawtooth' : 'sine';
        oscillator.frequency.setValueAtTime(frequency, now + offset);
        gain.gain.setValueAtTime(0.0001, now + offset);
        gain.gain.exponentialRampToValueAtTime(type === 'wrong' ? 0.035 : 0.055, now + offset + .015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(now + offset);
        oscillator.stop(now + offset + duration + .02);
      });
    } catch { /* browsers can block audio until interaction */ }
  }

  function toggleSound() {
    settings.muted = !settings.muted;
    el.body.classList.toggle('is-muted', settings.muted);
    el.soundToggle.setAttribute('aria-label', settings.muted ? 'Turn sound on' : 'Mute sound');
    saveSettings();
    if (!settings.muted) playSound('correct');
  }

  function toggleTheme() {
    settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
    el.html.dataset.theme = settings.theme;
    el.themeToggle.setAttribute('aria-label', settings.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = settings.theme === 'dark' ? '#08111f' : '#eef5f7';
    saveSettings();
  }

  function toast(message, type = 'default') {
    const node = document.createElement('div');
    node.className = `toast ${type === 'achievement' ? 'is-achievement' : type === 'error' ? 'is-error' : ''}`;
    node.textContent = message;
    el.toastRegion.append(node);
    setTimeout(() => {
      node.classList.add('is-leaving');
      setTimeout(() => node.remove(), 240);
    }, type === 'achievement' ? 4200 : 3000);
  }

  function burstConfetti(count = 90) {
    if (reduceMotion) return;
    const canvas = el.confettiCanvas;
    const context = canvas.getContext('2d');
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = innerWidth * ratio;
    canvas.height = innerHeight * ratio;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const palette = ['#67e8f9', '#64e6a4', '#f8d66d', '#b4a0ff', '#ff7a8a'];
    const particles = Array.from({ length: count }, () => ({
      x: innerWidth / 2 + (Math.random() - .5) * 180,
      y: innerHeight * .35,
      vx: (Math.random() - .5) * 10,
      vy: -Math.random() * 8 - 4,
      gravity: .17 + Math.random() * .08,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - .5) * .24,
      size: 4 + Math.random() * 6,
      color: palette[Math.floor(Math.random() * palette.length)],
      life: 1
    }));
    const started = performance.now();
    function frame(now) {
      context.clearRect(0, 0, innerWidth, innerHeight);
      particles.forEach(particle => {
        particle.vy += particle.gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.spin;
        particle.life = Math.max(0, 1 - (now - started) / 2200);
        context.save();
        context.globalAlpha = particle.life;
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.fillStyle = particle.color;
        context.fillRect(-particle.size / 2, -particle.size / 3, particle.size, particle.size * .66);
        context.restore();
      });
      if (now - started < 2200) requestAnimationFrame(frame);
      else context.clearRect(0, 0, innerWidth, innerHeight);
    }
    requestAnimationFrame(frame);
  }

  function exportProgress() {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: 'Atlas Arcade',
      version: 3,
      progress
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `atlas-arcade-progress-${localDateKey()}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Progress export created.');
  }

  function resetProgress() {
    if (!window.confirm('Reset all Atlas Arcade progress, favorites and achievements in this browser?')) return;
    progress = defaultProgress();
    saveProgress();
    selectedStudyIso = null;
    el.studyPlaceholder.hidden = false;
    el.studyDetails.hidden = true;
    renderStats();
    refreshMapClasses();
    toast('Progress reset. The map has selective amnesia now.');
  }

  function copyResult() {
    if (!run) return;
    const answered = run.history.length;
    const accuracy = run.config.mode === 'spelling'
      ? Math.round(run.solved / Math.max(1, run.solved + run.wrongGuesses) * 100)
      : answered ? Math.round(run.firstTry / answered * 100) : 0;
    const text = run.isSprint
      ? `Atlas Arcade ${modeLabels[run.config.mode]} Competitive — ${formatRaceTime(run.officialDuration * 1000)} final · ${formatRaceTime(run.finalDuration * 1000)} raw · ${run.wrongGuesses} mistake${run.wrongGuesses === 1 ? '' : 's'}`
      : run.config.mode === 'spelling'
        ? `Atlas Arcade Spell All — ${run.solved}/${countries.length} countries · ${accuracy}% entry accuracy · ${formatTime(run.finalDuration)}`
        : `Atlas Arcade ${modeLabels[run.config.mode]} — ${formatNumber(run.score)} points · ${accuracy}% first-try · ${run.bestStreak} streak · ${formatTime(run.finalDuration)}`;
    navigator.clipboard?.writeText(text).then(() => toast('Result copied.')).catch(() => toast(text));
  }

  function setMissionPanelCollapsed(collapsed) {
    const isCollapsed = Boolean(collapsed);
    el.missionPanel.classList.toggle('is-collapsed', isCollapsed);
    el.missionCollapseButton.textContent = isCollapsed ? '›' : '‹';
    el.missionCollapseButton.setAttribute('aria-label', isCollapsed ? 'Expand game panel' : 'Collapse game panel');
    el.missionCollapseButton.setAttribute('aria-expanded', String(!isCollapsed));
    el.mobilePromptButton?.setAttribute('aria-expanded', String(!isCollapsed));
  }

  function updateMobilePrompt(country = null, mode = run?.currentMode) {
    if (!el.mobilePromptButton) return;
    el.mobilePromptFlag.hidden = mode !== 'flags' || !country;
    el.mobilePromptFlag.replaceChildren();
    if (mode === 'flags' && country) setFlag(el.mobilePromptFlag, country, { decorative: true });

    if (mode === 'locate' && country) {
      el.mobilePromptLead.textContent = 'Find this country';
      el.mobilePromptText.textContent = country.name;
    } else if (mode === 'capitals' && country) {
      el.mobilePromptLead.textContent = 'Find the country with';
      el.mobilePromptText.textContent = country.capital;
    } else if (mode === 'flags' && country) {
      el.mobilePromptLead.textContent = 'Locate this flag';
      el.mobilePromptText.textContent = 'Flag challenge';
    } else if (mode === 'reverse') {
      el.mobilePromptLead.textContent = 'Name the highlighted country';
      el.mobilePromptText.textContent = 'Map → Name';
    } else if (mode === 'spelling') {
      el.mobilePromptLead.textContent = 'Spell All';
      el.mobilePromptText.textContent = `${run?.solved || 0} / ${countries.length} named`;
    } else {
      el.mobilePromptLead.textContent = 'Current question';
      el.mobilePromptText.textContent = modeLabels[mode] || 'Atlas Arcade';
    }
    el.mobilePromptMeta.textContent = 'Tap this card to open the controls.';
  }

  function confirmNewGame() {
    if (run?.active && run.isSprint && !window.confirm('Leave this competitive game? The time will not be submitted.')) return;
    if (run?.active) run.abandoned = true;
    openSetup();
  }

  function initializeEvents() {
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && el.setupDialog.open && !run) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
    el.setupForm.addEventListener('submit', event => {
      event.preventDefault();
      if (event.submitter?.classList.contains('modal-close')) {
        el.setupDialog.close();
        return;
      }
      startGame(configFromForm());
    });
    el.setupForm.addEventListener('change', event => {
      updateSetupModeUI({ changedMode: event.target?.name === 'mode' });
    });
    el.setupDialog.addEventListener('close', resumeAfterDialog);
    el.setupDialog.addEventListener('cancel', event => {
      if (!run) event.preventDefault();
    });
    el.newGameButton.addEventListener('click', confirmNewGame);
    el.brandButton.addEventListener('click', confirmNewGame);
    el.playNav.addEventListener('click', () => switchView('play'));
    el.studyNav.addEventListener('click', () => switchView('study'));
    el.leaderboardNav.addEventListener('click', () => openLeaderboard());
    el.statsNav.addEventListener('click', openStats);
    el.missionCollapseButton.addEventListener('click', () => {
      setMissionPanelCollapsed(!el.missionPanel.classList.contains('is-collapsed'));
    });
    el.mobilePromptButton.addEventListener('click', () => setMissionPanelCollapsed(false));

    el.reverseForm.addEventListener('submit', event => { event.preventDefault(); submitReverseAnswer(); });
    el.spellForm.addEventListener('submit', event => { event.preventDefault(); submitSpellingAnswer(); });
    el.countryAnswerButton.addEventListener('click', () => {
      const iso2 = el.countryAnswerSelect.value;
      if (iso2) chooseCountry(iso2);
    });
    el.hintButton.addEventListener('click', useHint);
    el.skipButton.addEventListener('click', () => skipQuestion('skip'));
    el.soundToggle.addEventListener('click', toggleSound);
    el.themeToggle.addEventListener('click', toggleTheme);
    el.helpButton.addEventListener('click', () => { pauseForDialog(); el.helpDialog.showModal(); });
    el.helpClose.addEventListener('click', () => el.helpDialog.close());
    el.helpDialog.addEventListener('close', resumeAfterDialog);
    el.statsClose.addEventListener('click', () => el.statsDialog.close());
    el.statsDialog.addEventListener('close', resumeAfterDialog);

    el.leaderboardClose.addEventListener('click', () => el.leaderboardDialog.close());
    el.leaderboardDialog.addEventListener('close', resumeAfterDialog);
    el.leaderboardModeTabs.addEventListener('click', event => {
      const button = event.target.closest('[data-mode]');
      if (button) loadLeaderboard(button.dataset.mode);
    });
    el.savePlayerNameButton.addEventListener('click', savePlayerName);
    el.playerNameInput.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); savePlayerName(); } });
    el.startSprintButton.addEventListener('click', () => startGame({ mode: leaderboardMode, scope: 'World', difficulty: 3, length: 'all', pace: 'relaxed', sprint: true }));
    el.refreshLeaderboardButton.addEventListener('click', () => loadLeaderboard(leaderboardMode));

    el.accountButton.addEventListener('click', openAccountDialog);
    el.accountClose.addEventListener('click', () => el.accountDialog.close());
    el.accountDialog.addEventListener('close', resumeAfterDialog);
    el.accountTabs.addEventListener('click', event => {
      const button = event.target.closest('[data-account-tab]');
      if (button) switchAccountTab(button.dataset.accountTab);
    });
    el.accountSignInForm.addEventListener('submit', signInAccount);
    el.accountCreateForm.addEventListener('submit', createAccount);
    el.accountForgotButton.addEventListener('click', sendPasswordReset);
    el.accountSaveNameButton.addEventListener('click', saveAccountDisplayName);
    el.accountSyncButton.addEventListener('click', () => pushCloudProgress());
    el.accountSignOutButton.addEventListener('click', signOutAccount);
    el.accountRecoveryForm.addEventListener('submit', updateRecoveredPassword);

    el.resultsClose.addEventListener('click', () => el.resultsDialog.close());
    el.playAgainButton.addEventListener('click', () => startGame(lastConfig || configFromForm()));
    el.practiceMissedButton.addEventListener('click', () => {
      const codes = [...(run?.missedCodes || [])];
      if (!codes.length) return;
      startGame({ mode: 'mixed', scope: 'World', difficulty: 3, length: String(Math.min(25, codes.length)), pace: 'relaxed', sprint: false, customPoolCodes: codes });
    });
    el.viewLeaderboardButton.addEventListener('click', () => {
      const mode = run?.config?.mode || leaderboardMode;
      if (el.resultsDialog.open) el.resultsDialog.close();
      openLeaderboard(mode);
    });
    el.shareResultButton.addEventListener('click', copyResult);
    el.studyResultsButton.addEventListener('click', () => { el.resultsDialog.close(); switchView('study'); });
    el.missedList.addEventListener('click', event => {
      const button = event.target.closest('[data-study-iso]');
      if (!button) return;
      el.resultsDialog.close();
      switchView('study');
      selectStudyCountry(button.dataset.studyIso, true);
    });
    el.practiceWeakButton.addEventListener('click', () => {
      const codes = weakCountries().map(item => item.country.iso2).slice(0, 25);
      if (!codes.length) return;
      startGame({ mode: 'mixed', scope: 'World', difficulty: 3, length: String(codes.length), pace: 'relaxed', sprint: false, customPoolCodes: codes });
    });
    el.weakList.addEventListener('click', event => {
      const button = event.target.closest('[data-practice-iso]');
      if (!button) return;
      startGame({ mode: 'mixed', scope: 'World', difficulty: 3, length: '10', pace: 'relaxed', sprint: false, customPoolCodes: [button.dataset.practiceIso] });
    });
    el.modeProgressGrid?.addEventListener('click', event => {
      const button = event.target.closest('[data-mode-practice]');
      if (!button) return;
      if (el.statsDialog.open) el.statsDialog.close();
      openSetup({ mode: button.dataset.modePractice });
    });
    el.exportStatsButton.addEventListener('click', exportProgress);
    el.resetStatsButton.addEventListener('click', resetProgress);
    el.studySearchForm.addEventListener('submit', event => { event.preventDefault(); findStudyCountry(el.studySearch.value); });
    el.studyFilters.addEventListener('click', event => {
      const button = event.target.closest('[data-continent]');
      if (button) setStudyFilter(button.dataset.continent);
    });
    el.randomCountryButton.addEventListener('click', () => {
      const pool = countries.filter(country => studyContinent === 'World' || country.continent === studyContinent);
      selectStudyCountry(pool[Math.floor(Math.random() * pool.length)].iso2, true);
    });
    el.favoriteButton.addEventListener('click', toggleFavorite);
    el.practiceRegionButton.addEventListener('click', () => {
      const continent = el.practiceRegionButton.dataset.continent || 'World';
      switchView('play', false);
      openSetup({ scope: continent, mode: 'locate' });
    });
    el.focusCountryButton.addEventListener('click', () => focusCountry(byIso.get(el.focusCountryButton.dataset.iso)));
    el.fullscreenToggle?.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
        else await document.exitFullscreen();
      } catch { toast('Fullscreen is not available in this browser.', 'error'); }
    });

    document.addEventListener('keydown', event => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(event.target.tagName);
      if (event.key === '?' && !typing) {
        event.preventDefault();
        if (!el.helpDialog.open) { pauseForDialog(); el.helpDialog.showModal(); }
      } else if ((event.key === '+' || event.key === '=') && !typing) {
        event.preventDefault();
        zoomAt({ x: 600, y: 310 }, 1.25);
      } else if ((event.key === '-' || event.key === '_') && !typing) {
        event.preventDefault();
        zoomAt({ x: 600, y: 310 }, .8);
      } else if (event.key === '0' && !typing) {
        event.preventDefault();
        fitScope(currentView === 'study' ? studyContinent : run?.config.scope || 'World');
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key) && !typing) {
        event.preventDefault();
        const amount = event.shiftKey ? 96 : 48;
        if (event.key === 'ArrowUp') panMapBy(0, amount);
        if (event.key === 'ArrowDown') panMapBy(0, -amount);
        if (event.key === 'ArrowLeft') panMapBy(amount, 0);
        if (event.key === 'ArrowRight') panMapBy(-amount, 0);
      } else if (event.key.toLowerCase() === 'm' && !typing) {
        event.preventDefault();
        toggleSound();
      } else if (event.key.toLowerCase() === 'h' && !typing) {
        event.preventDefault();
        useHint();
      } else if (event.key.toLowerCase() === 's' && !typing) {
        event.preventDefault();
        skipQuestion('skip');
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (run?.isSprint) return;
      if (document.hidden && run?.active && !run.paused) {
        run.paused = true;
        pauseStarted = performance.now();
      } else if (!document.hidden && run?.active && run.paused && dialogPauseDepth === 0 && currentView === 'play') {
        const pausedFor = performance.now() - pauseStarted;
        run.gameStart += pausedFor;
        run.questionStart += pausedFor;
        run.paused = false;
      }
    });
  }

  function initializeAppearance() {
    el.html.dataset.theme = settings.theme;
    el.body.classList.toggle('is-muted', settings.muted);
    el.soundToggle.setAttribute('aria-label', settings.muted ? 'Turn sound on' : 'Mute sound');
    el.themeToggle.setAttribute('aria-label', settings.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    el.playerNameInput.value = accountDisplayName();
    updateSetupModeUI();
    updateAccountUI();
  }

  function initializeInstallPrompt() {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (standalone) return;
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      deferredInstallPrompt = event;
      el.installButton.hidden = false;
    });
    el.installButton?.addEventListener('click', async () => {
      if (!deferredInstallPrompt) {
        toast('Use your browser menu and choose “Install app” or “Add to Home Screen.”');
        return;
      }
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice.catch(() => null);
      deferredInstallPrompt = null;
      el.installButton.hidden = true;
    });
    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      el.installButton.hidden = true;
      toast('Atlas Arcade installed. It now opens like an app.');
    });
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return;
    navigator.serviceWorker.register('./service-worker.js').then(registration => {
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller && !(run?.active && currentView === 'play')) {
            toast('A newer Atlas Arcade build is ready. Reload whenever you are finished.');
          }
        });
      });
    }).catch(() => { /* local servers can block SW */ });
  }

  renderMap();
  initializeMapGestures();
  initializeEvents();
  initializeAppearance();
  initializeInstallPrompt();
  refreshMapClasses();
  fitScope('World');
  registerServiceWorker();
  initializeAccounts();
  window.setTimeout(() => openSetup(), 120);
})();
