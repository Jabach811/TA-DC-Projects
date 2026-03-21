(function () {
  const STORAGE_KEYS = {
    settings: 'amexDashPearl.settings.v3',
    imported: 'amexDashPearl.imported.v3',
  };

  const CATEGORY_STYLES = {
    Groceries: { icon: '🥬', color: '#34c759' },
    Restaurants: { icon: '🍽️', color: '#ff9f0a' },
    Education: { icon: '🎓', color: '#5856d6' },
    'Gas & Auto': { icon: '⛽', color: '#32ade6' },
    Shopping: { icon: '🛍️', color: '#af52de' },
    Other: { icon: '📦', color: '#8e8e93' },
  };

  const DEFAULT_SETTINGS = {
    name: 'Pearl Budget HQ',
    cardholder: 'Margaret',
    folder: '',
    totalBudget: 3800,
    catBudgets: {
      Groceries: { enabled: true, amount: 650 },
      Restaurants: { enabled: true, amount: 900 },
      Education: { enabled: true, amount: 250 },
      'Gas & Auto': { enabled: true, amount: 500 },
      Shopping: { enabled: true, amount: 850 },
      Other: { enabled: true, amount: 650 },
    },
  };

  const DEFAULT_SAMPLE_TRANSACTIONS = [
    { date: '09/01/2022', desc: "MCDONALD'S F32054 00TRACY CA", amount: 17.19, category: 'Restaurants', rawCategory: 'Restaurant-Bar & Cafe', merchant: "MCDONALD'S F32054 00TRACY CA", cardMember: 'MARGARET O GERODIAS', reference: '320222450093159396' },
    { date: '09/01/2022', desc: 'AMAZON.COM*DP5581R13AMZN.COM/BILL WA', amount: 51.41, category: 'Shopping', rawCategory: 'Merchandise & Supplies-Internet Purchase', merchant: 'AMAZON.COM*DP5581R13AMZN.COM/BILL WA', cardMember: 'MARGARET O GERODIAS', reference: '320222440086879196' },
    { date: '09/01/2022', desc: 'AplPay CHEVRON 02081TRACY CA', amount: 1.43, category: 'Gas & Auto', rawCategory: 'Transportation-Fuel', merchant: 'AplPay CHEVRON 02081TRACY CA', cardMember: 'MARGARET O GERODIAS', reference: '320222440071842933' },
    { date: '09/02/2022', desc: 'MEIKO SUSHI RESTAURAPLEASANTON CA', amount: 110.0, category: 'Restaurants', rawCategory: 'Restaurant-Restaurant', merchant: 'MEIKO SUSHI RESTAURAPLEASANTON CA', cardMember: 'MARGARET O GERODIAS', reference: '320222460129644872' },
    { date: '09/02/2022', desc: 'AMAZON MARKEPLACE NA PA', amount: 63.82, category: 'Shopping', rawCategory: 'Merchandise & Supplies-Internet Purchase', merchant: 'AMAZON MARKEPLACE NA PA', cardMember: 'MARVIN O GERODIAS', reference: '320222460128800853' },
    { date: '09/03/2022', desc: 'SP AERA STORE MILWAUKEE WI', amount: 313.4, category: 'Shopping', rawCategory: 'Merchandise & Supplies-Clothing Stores', merchant: 'SP AERA STORE MILWAUKEE WI', cardMember: 'MARVIN O GERODIAS', reference: '320222470149616521' },
    { date: '09/03/2022', desc: 'TRACY HONDA 00-08035TRACY CA', amount: 60.08, category: 'Gas & Auto', rawCategory: 'Transportation-Vehicle Leasing & Purchase', merchant: 'TRACY HONDA 00-08035TRACY CA', cardMember: 'MARGARET O GERODIAS', reference: '320222470144030769' },
    { date: '09/03/2022', desc: "RALEY'S TRACY CA", amount: 29.05, category: 'Groceries', rawCategory: 'Merchandise & Supplies-Groceries', merchant: "RALEY'S TRACY CA", cardMember: 'MARGARET O GERODIAS', reference: '320222470145219313' },
    { date: '09/03/2022', desc: 'BT*DD *DOORDASH LLHASAN FRANCISCO CA', amount: 115.43, category: 'Restaurants', rawCategory: 'Restaurant-Restaurant', merchant: 'BT*DD *DOORDASH LLHASAN FRANCISCO CA', cardMember: 'MARVIN O GERODIAS', reference: '320222460122433166' },
    { date: '09/04/2022', desc: 'TOMMYKATSU LIVERMORE CA', amount: 120.84, category: 'Restaurants', rawCategory: 'Restaurant-Restaurant', merchant: 'TOMMYKATSU LIVERMORE CA', cardMember: 'MARVIN O GERODIAS', reference: '320222480175945080' },
    { date: '09/04/2022', desc: "RALEY'S TRACY CA", amount: 115.61, category: 'Groceries', rawCategory: 'Merchandise & Supplies-Groceries', merchant: "RALEY'S TRACY CA", cardMember: 'MARGARET O GERODIAS', reference: '320222480164634200' },
    { date: '09/04/2022', desc: 'ARCO#83333PACIFICWESTRACY CA', amount: 64.17, category: 'Gas & Auto', rawCategory: 'Transportation-Fuel', merchant: 'ARCO#83333PACIFICWESTRACY CA', cardMember: 'MARGARET O GERODIAS', reference: '320222480160922583' },
    { date: '09/05/2022', desc: 'UNIQLO STONERIDGE PLEASANTON CA', amount: 99.11, category: 'Shopping', rawCategory: 'Merchandise & Supplies-Clothing Stores', merchant: 'UNIQLO STONERIDGE PLEASANTON CA', cardMember: 'MARVIN O GERODIAS', reference: '320222480166498691' },
    { date: '09/05/2022', desc: 'CHICK-FIL-A #04047 0MANTECA CA', amount: 36.62, category: 'Restaurants', rawCategory: 'Restaurant-Bar & Cafe', merchant: 'CHICK-FIL-A #04047 0MANTECA CA', cardMember: 'MARGARET O GERODIAS', reference: '320222490179252445' },
    { date: '09/06/2022', desc: 'SAFEWAY #2600 2600 TRACY CA', amount: 73.77, category: 'Groceries', rawCategory: 'Merchandise & Supplies-Groceries', merchant: 'SAFEWAY #2600 2600 TRACY CA', cardMember: 'MARGARET O GERODIAS', reference: '320222500202790148' },
    { date: '09/06/2022', desc: 'PY *NEXT GENERATION MANTECA CA', amount: 150.0, category: 'Other', rawCategory: 'Business Services-Other Services', merchant: 'PY *NEXT GENERATION MANTECA CA', cardMember: 'MARGARET O GERODIAS', reference: '320222500214732396' },
    { date: '09/07/2022', desc: 'SAVE MART #781.TRACYTRACY CA', amount: 71.37, category: 'Groceries', rawCategory: 'Merchandise & Supplies-Groceries', merchant: 'SAVE MART #781.TRACYTRACY CA', cardMember: 'MARGARET O GERODIAS', reference: '320222510223430548' },
    { date: '09/08/2022', desc: 'BT*DD *DOORDASH ELPOSAN FRANCISCO CA', amount: 50.56, category: 'Restaurants', rawCategory: 'Restaurant-Restaurant', merchant: 'BT*DD *DOORDASH ELPOSAN FRANCISCO CA', cardMember: 'MARVIN O GERODIAS', reference: '320222520248590648' },
    { date: '09/10/2022', desc: 'TRACY HONDA 00-08035TRACY CA', amount: 233.08, category: 'Gas & Auto', rawCategory: 'Transportation-Vehicle Leasing & Purchase', merchant: 'TRACY HONDA 00-08035TRACY CA', cardMember: 'MARGARET O GERODIAS', reference: '320222540295640403' },
    { date: '09/10/2022', desc: 'TARGET 018192ANTIOCH CA', amount: 83.76, category: 'Shopping', rawCategory: 'Merchandise & Supplies-Wholesale Stores', merchant: 'TARGET 018192ANTIOCH CA', cardMember: 'MARGARET O GERODIAS', reference: '320222540294793533' },
    { date: '09/11/2022', desc: 'SP HATS IN THE BEL MILLERSVILLE MD', amount: 233.95, category: 'Shopping', rawCategory: 'Merchandise & Supplies-Clothing Stores', merchant: 'SP HATS IN THE BEL MILLERSVILLE MD', cardMember: 'MARVIN O GERODIAS', reference: '320222540292672360' },
    { date: '09/12/2022', desc: 'SAVE MART #781.TRACYTRACY CA', amount: 38.82, category: 'Groceries', rawCategory: 'Merchandise & Supplies-Groceries', merchant: 'SAVE MART #781.TRACYTRACY CA', cardMember: 'MARGARET O GERODIAS', reference: '320222560333252985' },
    { date: '09/13/2022', desc: 'AMAZON.COM*1F9QZ1D42AMZN.COM/BILL WA', amount: 108.1, category: 'Shopping', rawCategory: 'Merchandise & Supplies-Internet Purchase', merchant: 'AMAZON.COM*1F9QZ1D42AMZN.COM/BILL WA', cardMember: 'MARVIN O GERODIAS', reference: '320222570353163836' },
    { date: '09/14/2022', desc: 'SAFEWAY #2600 2600 TRACY CA', amount: 41.71, category: 'Groceries', rawCategory: 'Merchandise & Supplies-Groceries', merchant: 'SAFEWAY #2600 2600 TRACY CA', cardMember: 'MARGARET O GERODIAS', reference: '320222580380496604' },
    { date: '09/14/2022', desc: 'ARCO#83333PACIFICWESTRACY CA', amount: 51.72, category: 'Gas & Auto', rawCategory: 'Transportation-Fuel', merchant: 'ARCO#83333PACIFICWESTRACY CA', cardMember: 'MARGARET O GERODIAS', reference: '320222580380781436' },
  ];

  const DEFAULT_HISTORY = {
    monthly: [
      { key: '2022-01', total: 5227.84, txCount: 75 },
      { key: '2022-02', total: 3004.25, txCount: 69 },
      { key: '2022-03', total: 4017.63, txCount: 69 },
      { key: '2022-04', total: 4511.90, txCount: 80 },
      { key: '2022-05', total: 5277.54, txCount: 106 },
      { key: '2022-06', total: 5244.51, txCount: 113 },
      { key: '2022-07', total: 5613.81, txCount: 130 },
      { key: '2022-08', total: 5250.18, txCount: 110 },
      { key: '2022-09', total: 3252.48, txCount: 52 },
    ],
    bestWeeks: [
      { key: '2022-02-07/2022-02-13', total: 341.14, txCount: 6 },
      { key: '2022-09-12/2022-09-18', total: 358.16, txCount: 9 },
      { key: '2022-02-14/2022-02-20', total: 390.62, txCount: 14 },
      { key: '2022-01-10/2022-01-16', total: 401.66, txCount: 9 },
    ],
    worstWeeks: [
      { key: '2022-01-24/2022-01-30', total: 2789.14, txCount: 27 },
      { key: '2022-06-27/2022-07-03', total: 2469.86, txCount: 38 },
      { key: '2022-08-29/2022-09-04', total: 2155.03, txCount: 36 },
      { key: '2022-07-25/2022-07-31', total: 1522.88, txCount: 32 },
    ],
    topMerchants: [
      { name: 'SAVE MART #781.TRACYTRACY CA', amount: 3614.35, count: 90, icon: '🛒' },
      { name: 'SAFEWAY #2600 2600 TRACY CA', amount: 3242.62, count: 52, icon: '🥬' },
      { name: 'MEIKO SUSHI RESTAURAPLEASANTON CA', amount: 2101.82, count: 13, icon: '🍣' },
      { name: 'FASTRAK CSC TOLLS OAKLAND CA', amount: 1765.00, count: 9, icon: '🚗' },
    ],
  };

  const DEFAULT_IMPORT_META = {
    folderLabel: 'Built-in Amex sample',
    filesProcessed: 0,
    rawRows: DEFAULT_SAMPLE_TRANSACTIONS.length,
    uniqueRows: DEFAULT_SAMPLE_TRANSACTIONS.length,
    duplicatesRemoved: 0,
    monthRange: 'September 2022',
    importedAt: '',
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const fmt = (value) => '$' + Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtK = (value) => Number(value || 0) >= 1000 ? '$' + (Number(value || 0) / 1000).toFixed(1) + 'k' : fmt(value);
  const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();

  function parseDate(value) {
    if (!value) return null;
    if (value instanceof Date) return value;
    const parts = String(value).split('/');
    if (parts.length === 3) return new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]));
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function formatDate(value) {
    const date = parseDate(value);
    if (!date) return '';
    return String(date.getMonth() + 1).padStart(2, '0') + '/' + String(date.getDate()).padStart(2, '0') + '/' + date.getFullYear();
  }

  function monthKey(dateValue) {
    const date = parseDate(dateValue);
    return date ? date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') : '';
  }

  function monthLabel(key) {
    const [year, month] = String(key || '').split('-').map(Number);
    return key ? new Date(year, month - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Unknown';
  }

  function weekLabel(key) {
    const [start, end] = String(key || '').split('/');
    return start && end ? new Date(start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' to ' + new Date(end).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : key;
  }

  function dashboardCategory(raw) {
    const value = clean(raw).toLowerCase();
    if (value.includes('grocer')) return 'Groceries';
    if (value.includes('restaurant') || value.includes('cafe') || value.includes('bar')) return 'Restaurants';
    if (value.includes('education')) return 'Education';
    if (value.includes('fuel') || value.includes('transport') || value.includes('auto') || value.includes('toll')) return 'Gas & Auto';
    if (value.includes('internet purchase') || value.includes('clothing') || value.includes('merchandise') || value.includes('wholesale')) return 'Shopping';
    return 'Other';
  }

  function sum(values) {
    return values.reduce((acc, value) => acc + Number(value || 0), 0);
  }

  function loadSettings() {
    try {
      return { ...clone(DEFAULT_SETTINGS), ...JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{}') };
    } catch (error) {
      return clone(DEFAULT_SETTINGS);
    }
  }

  function saveSettingsState(settings) {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }

  function loadImportedState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.imported) || 'null');
    } catch (error) {
      return null;
    }
  }

  function saveImportedState(payload) {
    localStorage.setItem(STORAGE_KEYS.imported, JSON.stringify(payload));
  }

  function buildDashboard(transactions) {
    const tx = clone(transactions).map((item) => ({
      ...item,
      date: formatDate(item.date),
      desc: clean(item.desc),
      merchant: clean(item.merchant || item.desc),
      category: CATEGORY_STYLES[item.category] ? item.category : dashboardCategory(item.rawCategory || item.category),
      rawCategory: clean(item.rawCategory || item.category),
      cardMember: clean(item.cardMember),
      reference: clean(item.reference),
      amount: Number(item.amount || 0),
    })).filter((item) => item.amount > 0 && parseDate(item.date));

    tx.sort((a, b) => parseDate(a.date) - parseDate(b.date));
    const latestMonth = tx.length ? monthKey(tx[tx.length - 1].date) : '';
    const current = tx.filter((item) => monthKey(item.date) === latestMonth);
    const latestDate = current.length ? parseDate(current[current.length - 1].date) : new Date();
    const daysInMonth = new Date(latestDate.getFullYear(), latestDate.getMonth() + 1, 0).getDate();
    const daily = Array.from({ length: daysInMonth }, () => 0);
    current.forEach((item) => { daily[parseDate(item.date).getDate() - 1] += item.amount; });

    const monthly = Object.entries(tx.reduce((acc, item) => {
      const key = monthKey(item.date);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {})).sort(([a], [b]) => a.localeCompare(b)).map(([key, items]) => ({
      key,
      total: sum(items.map((item) => item.amount)),
      txCount: items.length,
    }));

    const weekly = Object.entries(tx.reduce((acc, item) => {
      const date = parseDate(item.date);
      const offset = (date.getDay() + 6) % 7;
      const start = new Date(date);
      start.setDate(date.getDate() - offset);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const key = start.toISOString().slice(0, 10) + '/' + end.toISOString().slice(0, 10);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {})).map(([key, items]) => ({
      key,
      total: sum(items.map((item) => item.amount)),
      txCount: items.length,
    })).sort((a, b) => a.total - b.total);

    const categories = Object.keys(CATEGORY_STYLES).map((name) => ({
      name,
      amount: sum(current.filter((item) => item.category === name).map((item) => item.amount)),
      icon: CATEGORY_STYLES[name].icon,
      color: CATEGORY_STYLES[name].color,
    })).sort((a, b) => b.amount - a.amount);

    const merchantMap = {};
    const allMerchantMap = {};
    current.forEach((item) => {
      if (!merchantMap[item.merchant]) merchantMap[item.merchant] = { name: item.merchant, amount: 0, count: 0, icon: '🏪' };
      merchantMap[item.merchant].amount += item.amount;
      merchantMap[item.merchant].count += 1;
    });
    tx.forEach((item) => {
      if (!allMerchantMap[item.merchant]) allMerchantMap[item.merchant] = { name: item.merchant, amount: 0, count: 0, icon: '🏪' };
      allMerchantMap[item.merchant].amount += item.amount;
      allMerchantMap[item.merchant].count += 1;
    });

    const monthTotal = sum(current.map((item) => item.amount));
    const daysElapsed = current.length ? parseDate(current[current.length - 1].date).getDate() : 0;
    const dailyAvg = daysElapsed ? monthTotal / daysElapsed : 0;

    return {
      month: {
        key: latestMonth,
        label: monthLabel(latestMonth),
        total: monthTotal,
        txCount: current.length,
        daysInMonth,
        daysElapsed,
        dailyAvg,
        projected: dailyAvg * daysInMonth,
      },
      daily,
      categories,
      merchants: Object.values(merchantMap).sort((a, b) => b.amount - a.amount).slice(0, 8),
      transactions: current.slice().sort((a, b) => parseDate(b.date) - parseDate(a.date)),
      allTransactions: tx,
      history: {
        monthly,
        bestWeeks: weekly.slice(0, 6),
        worstWeeks: weekly.slice(-6).sort((a, b) => b.total - a.total),
        topMerchants: Object.values(allMerchantMap).sort((a, b) => b.amount - a.amount).slice(0, 8),
      },
    };
  }

  function monthlyStreak(history, budget) {
    const months = clone(history.monthly || []).sort((a, b) => a.key.localeCompare(b.key));
    let streak = 0;
    for (let index = months.length - 1; index >= 0; index -= 1) {
      if (months[index].total <= budget) streak += 1;
      else break;
    }
    return streak;
  }

  function weeklyStreak(history, budget) {
    const weeks = clone(history.worstWeeks || []).sort((a, b) => a.key.localeCompare(b.key));
    const weeklyLimit = (budget * 12) / 52;
    let streak = 0;
    for (let index = weeks.length - 1; index >= 0; index -= 1) {
      if (weeks[index].total <= weeklyLimit) streak += 1;
      else break;
    }
    return streak;
  }

  function achievementList() {
    const settings = window.SETTINGS;
    const data = window.DATA;
    const history = window.HISTORY;
    const grocery = data.categories.find((item) => item.name === 'Groceries')?.amount || 0;
    const dining = data.categories.find((item) => item.name === 'Restaurants')?.amount || 0;
    const gas = data.categories.find((item) => item.name === 'Gas & Auto')?.amount || 0;
    const shopping = data.categories.find((item) => item.name === 'Shopping')?.amount || 0;
    const noSpend = data.daily.slice(0, data.month.daysElapsed).filter((value) => value === 0).length;
    const topMerchant = history.topMerchants[0];
    return [
      { name: 'On Budget', icon: '✅', hit: data.month.total <= settings.totalBudget, desc: 'Finished under the monthly budget.' },
      { name: 'Budget Boss', icon: '👑', hit: data.month.total <= settings.totalBudget * 0.9, desc: 'Finished 10% or more under target.' },
      { name: 'Bullseye', icon: '🎯', hit: data.month.total <= settings.totalBudget && data.month.total >= settings.totalBudget * 0.95, desc: 'Landed within 5% of budget.' },
      { name: 'Weekly Warrior', icon: '🔥', hit: weeklyStreak(history, settings.totalBudget) >= 2, desc: 'Two or more strong weeks in a row.' },
      { name: 'Weekly Wall', icon: '🧱', hit: weeklyStreak(history, settings.totalBudget) >= 4, desc: 'Four-week low-spend wall achieved.' },
      { name: 'Monthly Streak', icon: '🗓️', hit: monthlyStreak(history, settings.totalBudget) >= 2, desc: 'Two months under budget in a row.' },
      { name: 'Monthly Streak Master', icon: '🏆', hit: monthlyStreak(history, settings.totalBudget) >= 3, desc: 'Three months under budget in a row.' },
      { name: 'Grocery Guardian', icon: '🥬', hit: grocery <= (settings.catBudgets.Groceries?.amount || 0), desc: 'Groceries stayed inside the lane.' },
      { name: 'Dining Disciplined', icon: '🍽️', hit: dining <= (settings.catBudgets.Restaurants?.amount || 0), desc: 'Restaurant spending stayed in check.' },
      { name: 'Fuel Saver', icon: '⛽', hit: gas <= (settings.catBudgets['Gas & Auto']?.amount || 0), desc: 'Gas and auto stayed on pace.' },
      { name: 'Shopping Sheriff', icon: '🛍️', hit: shopping <= (settings.catBudgets.Shopping?.amount || 0), desc: 'Shopping stayed under cap.' },
      { name: 'Merchant MVP', icon: '🏪', hit: Boolean(topMerchant && topMerchant.count >= 20), desc: 'One merchant became a serious recurring character.' },
      { name: 'Coffee Regular', icon: '☕', hit: data.transactions.filter((item) => /coffee|starbucks|peet/i.test(item.desc)).length >= 2, desc: 'The coffee streak is alive.' },
      { name: 'Card Champion', icon: '💳', hit: data.month.txCount >= 40, desc: 'Big swipe volume month.' },
      { name: 'Category Pro', icon: '🎪', hit: data.categories.filter((item) => item.amount > 0).length >= 5, desc: 'Used five or more categories.' },
      { name: 'High Roller', icon: '💸', hit: data.allTransactions.some((item) => item.amount >= 500), desc: 'One charge hit $500 or more.' },
      { name: 'Penny Pincher', icon: '🪙', hit: data.allTransactions.some((item) => item.amount < 3), desc: 'Tiny spend spotted.' },
      { name: 'Donut Day', icon: '🍩', hit: noSpend >= 1, desc: 'At least one zero-spend day happened.' },
      { name: 'Featherweight Week', icon: '🪶', hit: Boolean(history.bestWeeks[0] && history.bestWeeks[0].total < 400), desc: 'A week came in under $400.' },
      { name: 'Lean Month Legend', icon: '🌙', hit: Boolean(history.monthly.slice().sort((a, b) => a.total - b.total)[0]?.total < 3100), desc: 'Best month finished under $3,100.' },
    ];
  }

  function renderStatusCard() {
    const meta = window.IMPORT_META || clone(DEFAULT_IMPORT_META);
    document.getElementById('importStatusCard').innerHTML = `
      <div class="import-stat"><div class="import-stat-label">Source</div><div class="import-stat-value">${meta.folderLabel}</div></div>
      <div class="import-stat"><div class="import-stat-label">Files</div><div class="import-stat-value">${meta.filesProcessed}</div></div>
      <div class="import-stat"><div class="import-stat-label">Unique Rows</div><div class="import-stat-value">${meta.uniqueRows}</div></div>
      <div class="import-stat"><div class="import-stat-label">Dupes Cut</div><div class="import-stat-value">${meta.duplicatesRemoved}</div></div>
      <div class="import-note">${meta.monthRange}${meta.importedAt ? ' · Last import ' + meta.importedAt : ' · Folder import ready'}</div>
    `;
  }

  function renderOverview() {
    const settings = window.SETTINGS;
    const data = window.DATA;
    const diff = settings.totalBudget - data.month.total;
    document.getElementById('sidebarName').textContent = settings.name;
    document.getElementById('sidebarPeriod').textContent = data.month.label;
    document.getElementById('footerPeriod').textContent = data.month.label;
    document.getElementById('footerTxCount').textContent = data.month.txCount;
    document.getElementById('footerBudget').textContent = fmt(settings.totalBudget);
    document.getElementById('overviewTitle').textContent = settings.name;
    document.getElementById('overviewSubtitle').textContent = data.month.label + ' snapshot for ' + settings.cardholder;
    document.getElementById('statTotal').textContent = fmt(data.month.total);
    document.getElementById('statTotalSub').textContent = data.month.txCount + ' charges this month';
    document.getElementById('statVsBudget').textContent = (diff >= 0 ? '+' : '-') + fmt(Math.abs(diff));
    document.getElementById('statVsBudget').className = 'stat-value ' + (diff >= 0 ? 'green' : 'red');
    document.getElementById('statVsBudgetSub').textContent = diff >= 0 ? 'under budget' : 'over budget';
    document.getElementById('budgetStatCard').className = 'stat-card ' + (diff >= 0 ? 'green' : 'red');
    document.getElementById('statAvg').textContent = fmt(data.month.dailyAvg);
    document.getElementById('statTx').textContent = data.month.txCount;
    document.getElementById('chartTitle').textContent = (window.chartMode === 'trend' ? 'Monthly Trend' : 'Daily Spending') + ' — ' + data.month.label;
    document.getElementById('chartSub').textContent = window.chartMode === 'trend' ? 'Imported workbook history, deduped and rolled up.' : 'Day ' + data.month.daysElapsed + ' of ' + data.month.daysInMonth + ' · daily goal ' + fmt(settings.totalBudget / data.month.daysInMonth);
  }

  function renderCharts() {
    const monthlyCanvas = document.getElementById('monthlyChart');
    const donutCanvas = document.getElementById('donutChart');
    if (window.monthlyChart) window.monthlyChart.destroy();
    if (window.donutChart) window.donutChart.destroy();
    const data = window.DATA;
    const settings = window.SETTINGS;
    if (window.chartMode === 'trend') {
      window.monthlyChart = new Chart(monthlyCanvas, {
        type: 'line',
        data: {
          labels: window.HISTORY.monthly.map((item) => monthLabel(item.key)),
          datasets: [{ data: window.HISTORY.monthly.map((item) => item.total), borderColor: '#5856d6', backgroundColor: 'rgba(88,86,214,0.12)', fill: true, tension: 0.35 }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
      });
    } else {
      window.monthlyChart = new Chart(monthlyCanvas, {
        type: 'bar',
        data: {
          labels: data.daily.map((_, index) => index + 1),
          datasets: [
            { data: data.daily, backgroundColor: '#007aff', borderRadius: 7 },
            { type: 'line', data: data.daily.map(() => settings.totalBudget / data.month.daysInMonth), borderColor: '#ff9f0a', borderDash: [6, 5], pointRadius: 0, borderWidth: 2 },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
      });
    }

    const categories = data.categories.filter((item) => item.amount > 0);
    window.donutChart = new Chart(donutCanvas, {
      type: 'doughnut',
      data: {
        labels: categories.map((item) => item.name),
        datasets: [{ data: categories.map((item) => item.amount), backgroundColor: categories.map((item) => item.color), borderWidth: 0 }],
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false } } },
    });

    const total = sum(categories.map((item) => item.amount));
    document.getElementById('donutLegend').innerHTML = categories.map((item) => `
      <div class="donut-legend-item">
        <span class="donut-legend-swatch" style="background:${item.color}"></span>
        <span class="donut-legend-name">${item.icon} ${item.name}</span>
        <span class="donut-legend-pct">${total ? Math.round(item.amount / total * 100) : 0}%</span>
        <span class="donut-legend-amt">${fmt(item.amount)}</span>
      </div>
    `).join('');
  }

  function renderMerchants() {
    const merchants = window.DATA.merchants;
    const top = merchants[0]?.amount || 1;
    document.getElementById('merchantList').innerHTML = merchants.map((merchant, index) => `
      <div class="merchant-row">
        <div class="merchant-rank">${index + 1}</div>
        <div class="merchant-avatar">${merchant.icon || '🏪'}</div>
        <div class="merchant-info">
          <div class="merchant-name">${merchant.name}</div>
          <div class="merchant-count">${merchant.count} visits</div>
        </div>
        <div class="merchant-bar-wrap"><div class="merchant-bar-fill" style="width:${merchant.amount / top * 100}%"></div></div>
        <div class="merchant-amount">${fmtK(merchant.amount)}</div>
      </div>
    `).join('');
  }

  function renderTransactions() {
    const pills = ['All'].concat(window.DATA.categories.filter((item) => item.amount > 0).map((item) => item.name));
    document.getElementById('catPills').innerHTML = pills.map((name, index) => `<div class="pill ${index === 0 ? 'active' : ''}" data-cat="${name}">${name === 'All' ? 'All Categories' : CATEGORY_STYLES[name].icon + ' ' + name}</div>`).join('');
    document.querySelectorAll('#catPills .pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#catPills .pill').forEach((node) => node.classList.remove('active'));
        pill.classList.add('active');
        window.activeCat = pill.dataset.cat;
        window.filterTx();
      });
    });
    document.getElementById('txSubtitle').textContent = window.DATA.month.label + ' · ' + window.DATA.transactions.length + ' charges';
    window.filterTx();
  }

  window.filterTx = function filterTx() {
    const search = clean(document.getElementById('txSearch')?.value || '').toLowerCase();
    const activeCat = window.activeCat || 'All';
    const rows = window.DATA.transactions.filter((item) => {
      const byCat = activeCat === 'All' || item.category === activeCat;
      const bySearch = !search || [item.desc, item.category, item.date, item.cardMember].join(' ').toLowerCase().includes(search);
      return byCat && bySearch;
    });
    document.getElementById('txBody').innerHTML = rows.map((item) => `
      <tr>
        <td class="td-date">${item.date}</td>
        <td class="td-desc">${item.desc}</td>
        <td>${item.cardMember || '—'}</td>
        <td><span class="cat-badge">${CATEGORY_STYLES[item.category]?.icon || '📦'} ${item.category}</span></td>
        <td class="td-amount">${fmt(item.amount)}</td>
      </tr>
    `).join('');
    document.getElementById('noResults').style.display = rows.length ? 'none' : 'block';
  };

  function renderBudget() {
    const settings = window.SETTINGS;
    const data = window.DATA;
    const diff = settings.totalBudget - data.month.total;
    const over = diff < 0;
    const near = !over && diff < settings.totalBudget * 0.1;
    document.getElementById('bannerAvg').textContent = fmt(data.month.total);
    document.getElementById('bannerAvg').className = 'bsb-val ' + (over ? 'red' : 'green');
    document.getElementById('bannerSub').textContent = 'vs ' + fmt(settings.totalBudget) + ' goal · Day ' + data.month.daysElapsed + ' of ' + data.month.daysInMonth;
    document.getElementById('bannerStatusPill').className = 'bsb-status-pill ' + (over ? 'red' : near ? 'orange' : 'green');
    document.getElementById('bannerStatusPill').textContent = over ? '⚠ ' + fmt(Math.abs(diff)) + ' over budget' : near ? '⚡ Getting close' : '✓ ' + fmt(diff) + ' under budget';
    document.getElementById('bannerTrack').textContent = 'Projected finish: ' + fmt(data.month.projected);

    const cards = [{ name: 'Monthly Total', icon: '💳', goal: settings.totalBudget, actual: data.month.total }]
      .concat(Object.entries(settings.catBudgets).filter(([, cfg]) => cfg.enabled).map(([name, cfg]) => ({
        name,
        icon: CATEGORY_STYLES[name].icon,
        goal: cfg.amount,
        actual: data.categories.find((item) => item.name === name)?.amount || 0,
      })));
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    document.getElementById('budgetGrid').innerHTML = cards.map((card) => {
      const pct = card.goal ? Math.round(card.actual / card.goal * 100) : 0;
      const fill = Math.min(card.actual / card.goal, 1);
      const offset = circumference - fill * circumference;
      const state = card.actual > card.goal ? 'over' : pct >= 88 ? 'warn' : 'ok';
      const color = state === 'over' ? 'var(--red)' : state === 'warn' ? 'var(--orange)' : 'var(--green)';
      return `
        <div class="budget-card ${state}">
          <div class="budget-icon">${card.icon}</div>
          <div class="ring-wrap">
            <svg class="ring-svg" viewBox="0 0 120 120">
              <circle class="ring-bg" cx="60" cy="60" r="${radius}"></circle>
              <circle class="ring-fill" cx="60" cy="60" r="${radius}" stroke="${color}" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" data-target="${offset}"></circle>
            </svg>
            <div class="ring-center"><div class="ring-pct" style="color:${color}">${pct}%</div><div class="ring-label-sm">used</div></div>
          </div>
          <div class="budget-name">${card.name}</div>
          <div class="budget-amounts">
            <div class="budget-row"><span>Budget</span><span>${fmt(card.goal)}</span></div>
            <div class="budget-row"><span>This Month</span><span>${fmt(card.actual)}</span></div>
            <div class="budget-row"><span>Remaining</span><span>${card.goal >= card.actual ? fmt(card.goal - card.actual) : '-' + fmt(card.actual - card.goal)}</span></div>
          </div>
          <div class="budget-status ${state === 'over' ? 'status-over' : state === 'warn' ? 'status-warn' : 'status-ok'}">${state === 'over' ? 'Over Budget' : state === 'warn' ? 'Near Limit' : 'On Track'}</div>
        </div>
      `;
    }).join('');

    setTimeout(() => {
      document.querySelectorAll('.ring-fill').forEach((node) => { node.style.strokeDashoffset = node.dataset.target; });
    }, 80);

    const txs = data.transactions;
    const biggest = txs.reduce((max, item) => item.amount > max.amount ? item : max, txs[0]);
    const smallest = txs.reduce((min, item) => item.amount < min.amount ? item : min, txs[0]);
    const favorite = data.merchants[0];
    const dayCounts = {};
    txs.forEach((item) => { dayCounts[item.date] = (dayCounts[item.date] || 0) + 1; });
    const busiest = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('funStatsBar').innerHTML = `
      <div class="fun-stat"><div class="fun-stat-label">Biggest Charge</div><div class="fun-stat-val">${fmt(biggest.amount)}</div><div class="fun-stat-sub">${biggest.desc}</div></div>
      <div class="fun-stat"><div class="fun-stat-label">Smallest Charge</div><div class="fun-stat-val">${fmt(smallest.amount)}</div><div class="fun-stat-sub">${smallest.desc}</div></div>
      <div class="fun-stat"><div class="fun-stat-label">Favorite Merchant</div><div class="fun-stat-val">${favorite?.name || '—'}</div><div class="fun-stat-sub">${favorite?.count || 0} visits</div></div>
      <div class="fun-stat"><div class="fun-stat-label">Busiest Day</div><div class="fun-stat-val">${busiest ? busiest[0] : '—'}</div><div class="fun-stat-sub">${busiest ? busiest[1] + ' charges' : 'No activity'}</div></div>
      <div class="fun-stat"><div class="fun-stat-label">Daily Average</div><div class="fun-stat-val">${fmt(data.month.dailyAvg)}</div><div class="fun-stat-sub">Goal pace ${fmt(settings.totalBudget / data.month.daysInMonth)}</div></div>
    `;

    const achievements = achievementList();
    document.getElementById('achieveCount').textContent = achievements.filter((item) => item.hit).length + ' / ' + achievements.length + ' earned';
    document.getElementById('achievementGrid').innerHTML = achievements.map((item) => `
      <div class="achievement-card ${item.hit ? 'unlocked' : 'locked'}">
        <div class="achievement-icon-wrap" style="background:${item.hit ? 'rgba(52,199,89,0.12)' : 'rgba(142,142,147,0.12)'}">${item.icon}</div>
        <div class="achievement-name">${item.name}</div>
        <div class="achievement-desc">${item.desc}</div>
        <div class="achievement-badge ${item.hit ? 'earned' : 'locked'}">${item.hit ? 'Earned' : 'Locked'}</div>
      </div>
    `).join('');
  }

  function renderTrophies() {
    const history = window.HISTORY;
    const settings = window.SETTINGS;
    const bestMonth = history.monthly.slice().sort((a, b) => a.total - b.total)[0];
    const worstMonth = history.monthly.slice().sort((a, b) => b.total - a.total)[0];
    const bestWeek = history.bestWeeks[0];
    const worstWeek = history.worstWeeks[0];
    const topMerchant = history.topMerchants[0];
    const earned = achievementList().filter((item) => item.hit).length;
    document.getElementById('trophyHeroSub').textContent = 'Real wins from the Amex history: lean months, sharp weeks, favorite merchants, and the little budget battles you actually won.';
    document.getElementById('trophyHeroPill').textContent = '🏆 ' + earned + ' live achievements · ' + monthlyStreak(history, settings.totalBudget) + ' month streak';
    document.getElementById('trophyEarnedCount').textContent = earned + ' earned right now';
    document.getElementById('trophyMetaGrid').innerHTML = `
      <div class="trophy-meta-card"><div class="trophy-meta-label">Best Month</div><div class="trophy-meta-value">${fmt(bestMonth.total)}</div><div class="trophy-meta-sub">${monthLabel(bestMonth.key)}</div></div>
      <div class="trophy-meta-card"><div class="trophy-meta-label">Best Week</div><div class="trophy-meta-value">${fmt(bestWeek.total)}</div><div class="trophy-meta-sub">${weekLabel(bestWeek.key)}</div></div>
      <div class="trophy-meta-card"><div class="trophy-meta-label">Top Merchant</div><div class="trophy-meta-value">${topMerchant.name.split(' ').slice(0, 2).join(' ')}</div><div class="trophy-meta-sub">${fmt(topMerchant.amount)} across ${topMerchant.count} visits</div></div>
      <div class="trophy-meta-card"><div class="trophy-meta-label">Best Streak</div><div class="trophy-meta-value">${monthlyStreak(history, settings.totalBudget)}</div><div class="trophy-meta-sub">months under ${fmt(settings.totalBudget)}</div></div>
    `;
    document.getElementById('trophyGrid').innerHTML = [
      { icon: '🌙', name: 'Lean Month Legend', type: 'Monthly', value: fmt(bestMonth.total), desc: monthLabel(bestMonth.key) + ' came in as the cheapest month on record.' },
      { icon: '📈', name: 'Peak Spend Season', type: 'Monthly', value: fmt(worstMonth.total), desc: monthLabel(worstMonth.key) + ' was the heavyweight month.' },
      { icon: '🪶', name: 'Featherweight Week', type: 'Weekly', value: fmt(bestWeek.total), desc: weekLabel(bestWeek.key) + ' stayed unbelievably light.' },
      { icon: '⚡', name: 'Storm Week', type: 'Weekly', value: fmt(worstWeek.total), desc: weekLabel(worstWeek.key) + ' was a full-throttle week.' },
      { icon: topMerchant.icon || '🏪', name: 'Merchant MVP', type: 'Merchant', value: fmt(topMerchant.amount), desc: topMerchant.name + ' became the recurring champion.' },
      { icon: '💳', name: 'Charge Factory', type: 'Volume', value: worstMonth.txCount + ' charges', desc: monthLabel(worstMonth.key) + ' also carried the highest volume.' },
    ].map((item) => `
      <div class="trophy-card">
        <div class="trophy-card-header"><div class="trophy-card-icon">${item.icon}</div><div><div class="trophy-card-name">${item.name}</div><div class="trophy-card-type">${item.type}</div></div></div>
        <div class="trophy-card-value">${item.value}</div>
        <div class="trophy-card-desc">${item.desc}</div>
        <div class="trophy-card-tag">Historical Win</div>
      </div>
    `).join('');
    document.getElementById('trophyTimeline').innerHTML = [
      { icon: '🚀', title: 'January came in swinging', sub: 'The history opened at ' + fmt(history.monthly[0].total) + ' in charges.' },
      { icon: '🌙', title: 'February found the calm lane', sub: monthLabel(bestMonth.key) + ' landed the lightest month at ' + fmt(bestMonth.total) + '.' },
      { icon: '💯', title: 'Triple-digit volume took over', sub: 'May, June, July, and August each crossed 100+ charges.' },
      { icon: '📈', title: 'July hit max intensity', sub: monthLabel(worstMonth.key) + ' delivered the highest spend and highest count.' },
      { icon: '🪶', title: 'September cleaned things up', sub: 'The final month cooled down and also produced one of the best weeks.' },
    ].map((item) => `
      <div class="timeline-item"><div class="timeline-dot">${item.icon}</div><div><div class="timeline-title">${item.title}</div><div class="timeline-sub">${item.sub}</div></div></div>
    `).join('');
  }

  function populateSettings() {
    const settings = window.SETTINGS;
    document.getElementById('settingName').value = settings.name;
    document.getElementById('settingCardholder').value = settings.cardholder;
    document.getElementById('settingFolder').value = window.IMPORT_META.folderLabel || settings.folder || '';
    document.getElementById('settingTotalBudget').value = settings.totalBudget;
    document.getElementById('catBudgetRows').innerHTML = Object.keys(CATEGORY_STYLES).map((category) => {
      const cfg = settings.catBudgets[category] || { enabled: false, amount: 0 };
      return `
        <div class="cat-budget-row" data-cat="${category}">
          <label class="cat-toggle">
            <input type="checkbox" ${cfg.enabled ? 'checked' : ''} onchange="toggleCatInput(this)">
            <span class="cat-toggle-slider"></span>
          </label>
          <div class="cat-budget-icon">${CATEGORY_STYLES[category].icon}</div>
          <div class="cat-budget-name">${category}</div>
          <input class="cat-budget-input" type="number" value="${cfg.amount}" min="0" step="25" ${cfg.enabled ? '' : 'disabled'}>
        </div>
      `;
    }).join('');
    renderStatusCard();
  }

  window.toggleCatInput = function toggleCatInput(checkbox) {
    const input = checkbox.closest('.cat-budget-row').querySelector('.cat-budget-input');
    input.disabled = !checkbox.checked;
  };

  window.saveSettings = function saveSettings() {
    const next = clone(window.SETTINGS);
    next.name = clean(document.getElementById('settingName').value) || DEFAULT_SETTINGS.name;
    next.cardholder = clean(document.getElementById('settingCardholder').value) || DEFAULT_SETTINGS.cardholder;
    next.folder = clean(document.getElementById('settingFolder').value);
    next.totalBudget = Number(document.getElementById('settingTotalBudget').value || DEFAULT_SETTINGS.totalBudget);
    document.querySelectorAll('.cat-budget-row').forEach((row) => {
      next.catBudgets[row.dataset.cat] = {
        enabled: row.querySelector('input[type="checkbox"]').checked,
        amount: Number(row.querySelector('.cat-budget-input').value || 0),
      };
    });
    window.SETTINGS = next;
    saveSettingsState(next);
    rerender();
    const toast = document.getElementById('saveToast');
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 1400);
  };

  window.goTo = function goTo(page) {
    document.querySelectorAll('.page').forEach((node) => node.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach((node) => node.classList.remove('active'));
    document.getElementById('page-' + page)?.classList.add('active');
    document.querySelector('.nav-item[data-page="' + page + '"]')?.classList.add('active');
  };

  function fileHeaderRow(rows) {
    return rows.findIndex((row) => {
      const values = row.map((cell) => clean(cell).toLowerCase());
      return values.includes('date') && values.includes('description') && values.includes('amount');
    });
  }

  function parseWorkbook(workbook) {
    const sheetName = workbook.SheetNames.find((name) => /transaction details/i.test(name)) || workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return [];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
    const headerIndex = fileHeaderRow(rows);
    if (headerIndex < 0) return [];
    const header = rows[headerIndex].map((cell) => clean(cell).toLowerCase());
    const dateIndex = header.indexOf('date');
    const descIndex = header.indexOf('description');
    const amountIndex = header.indexOf('amount');
    const memberIndex = header.indexOf('card member');
    const categoryIndex = header.indexOf('category');
    const referenceIndex = header.indexOf('reference');
    return rows.slice(headerIndex + 1).map((row) => {
      const amount = Number(String(row[amountIndex] || '').replace(/[^0-9.-]/g, ''));
      const date = parseDate(row[dateIndex]);
      if (!date || !amount || amount <= 0) return null;
      const rawCategory = clean(row[categoryIndex]);
      const desc = clean(row[descIndex]);
      return {
        date: formatDate(date),
        desc,
        amount: Number(amount.toFixed(2)),
        category: dashboardCategory(rawCategory),
        rawCategory,
        merchant: desc,
        cardMember: clean(row[memberIndex]),
        reference: clean(row[referenceIndex]),
      };
    }).filter(Boolean);
  }

  async function parseFile(file) {
    const buffer = await file.arrayBuffer();
    return parseWorkbook(XLSX.read(buffer, { type: 'array' }));
  }

  function dedupeRows(rows) {
    const seen = new Set();
    const unique = [];
    let duplicatesRemoved = 0;
    rows.forEach((row) => {
      const key = row.reference ? 'ref:' + row.reference : [row.date, row.desc.toLowerCase(), row.amount.toFixed(2), row.cardMember.toLowerCase(), row.rawCategory.toLowerCase()].join('|');
      if (seen.has(key)) duplicatesRemoved += 1;
      else {
        seen.add(key);
        unique.push(row);
      }
    });
    return { unique, duplicatesRemoved };
  }

  function monthRange(rows) {
    if (!rows.length) return 'No charge data found';
    const sorted = clone(rows).sort((a, b) => parseDate(a.date) - parseDate(b.date));
    const first = monthLabel(monthKey(sorted[0].date));
    const last = monthLabel(monthKey(sorted[sorted.length - 1].date));
    return first === last ? first : first + ' to ' + last;
  }

  window.triggerFolderPicker = function triggerFolderPicker() {
    document.getElementById('folderPicker')?.click();
  };

  window.clearImportedData = function clearImportedData() {
    localStorage.removeItem(STORAGE_KEYS.imported);
    window.IMPORT_META = clone(DEFAULT_IMPORT_META);
    window.DATA = buildDashboard(DEFAULT_SAMPLE_TRANSACTIONS);
    window.SETTINGS = loadSettings();
    rerender();
    goTo('overview');
  };

  async function handleFolderSelection(event) {
    const files = Array.from(event.target.files || []).filter((file) => /\.(xlsx|xls)$/i.test(file.name));
    if (!files.length) return;
    const allRows = [];
    for (const file of files) {
      allRows.push(...await parseFile(file));
    }
    const { unique, duplicatesRemoved } = dedupeRows(allRows);
    window.DATA = buildDashboard(unique);
    window.IMPORT_META = {
      folderLabel: files[0].webkitRelativePath ? files[0].webkitRelativePath.split('/')[0] : 'Imported Folder',
      filesProcessed: files.length,
      rawRows: allRows.length,
      uniqueRows: unique.length,
      duplicatesRemoved,
      monthRange: monthRange(unique),
      importedAt: new Date().toLocaleString(),
    };
    window.SETTINGS = { ...loadSettings(), folder: window.IMPORT_META.folderLabel };
    saveSettingsState(window.SETTINGS);
    saveImportedState({ transactions: unique, importMeta: window.IMPORT_META });
    rerender();
    goTo('overview');
    event.target.value = '';
  }

  function rerender() {
    window.HISTORY = window.DATA.history;
    renderOverview();
    renderCharts();
    renderMerchants();
    renderTransactions();
    renderBudget();
    renderTrophies();
    populateSettings();
  }

  function bindEvents() {
    document.getElementById('folderPicker')?.addEventListener('change', handleFolderSelection);
    document.querySelectorAll('.nav-item[data-page]').forEach((item) => item.addEventListener('click', () => goTo(item.dataset.page)));
    document.querySelector('.trophy-teaser')?.addEventListener('click', () => goTo('trophies'));
  }

  window.switchChart = function switchChart(mode) {
    window.chartMode = mode;
    document.getElementById('toggleDaily').classList.toggle('active', mode === 'daily');
    document.getElementById('toggleTrend').classList.toggle('active', mode === 'trend');
    renderOverview();
    renderCharts();
  };

  function init() {
    const imported = loadImportedState();
    window.SETTINGS = loadSettings();
    window.IMPORT_META = imported?.importMeta || clone(DEFAULT_IMPORT_META);
    window.DATA = buildDashboard(imported?.transactions?.length ? imported.transactions : DEFAULT_SAMPLE_TRANSACTIONS);
    window.HISTORY = window.DATA.history || clone(DEFAULT_HISTORY);
    window.chartMode = 'daily';
    window.activeCat = 'All';
    bindEvents();
    rerender();
    goTo('overview');
  }

  init();
})();
