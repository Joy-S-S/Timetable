(function () {
  'use strict';
  const CHK = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  // Schedule: prayer items use offset from API adhan time. Fixed items use time/end directly.
  // Fajr sunnah = AFTER adhan at home. Then walk 5 min to mosque.
  const SCHEDULE = [
    { id: 'suhoor', time: '04:00', end: '04:30', title: 'السحور والنية', desc: 'وجبة السحور + نية الصيام + شرب ماء كافٍ', cat: 'islamic', prayer: 'Fajr', offset: -70, endOff: -40, fastOnly: true },
    { id: 'qiyam', time: '04:24', end: '04:54', title: 'قيام الليل', desc: '30 دقيقة — ركعتين أو أكثر قبل أذان الفجر', cat: 'islamic', prayer: 'Fajr', offset: -30, endOff: 0 },
    { id: 'fajr_sunnah', time: '04:54', end: '04:59', title: 'سنة الفجر في البيت', desc: '5 دقائق — ركعتين سنة بعد الأذان في البيت', cat: 'islamic', prayer: 'Fajr', offset: 0, endOff: 5 },
    { id: 'fajr', time: '04:59', end: '05:24', title: 'صلاة الفجر في المسجد', desc: '25 دقيقة — مشي 5 دق + إقامة + صلاة + عودة', cat: 'islamic', prayer: 'Fajr', offset: 5, endOff: 30 },
    { id: 'adhkar_gen', time: '05:24', end: '05:49', title: 'أذكار عامة وتسبيح', desc: '25 دقيقة — استغفار + تسبيح + تهليل + دعاء', cat: 'islamic', prayer: 'Fajr', offset: 30, endOff: 55 },
    { id: 'quran', time: '05:49', end: '06:21', title: 'قراءة القرآن', desc: '~30 دقيقة — جزء يومياً حتى الشروق (ختمة شهرية)', cat: 'islamic', prayer: 'Fajr', offset: 55, endOff: 87 },
    { id: 'duha', time: '06:41', end: '06:56', title: 'صلاة الضحى', desc: '15 دقيقة — بعد الشروق بـ 20 دقيقة', cat: 'islamic', prayer: 'Sunrise', offset: 20, endOff: 35 },
    { id: 'workout', time: '07:00', end: '08:00', title: 'تمارين الصباح', desc: '60 دقيقة — تمرين مكثف حسب جدول اليوم', cat: 'athletic' },
    { id: 'breakfast', time: '08:00', end: '08:20', title: 'إفطار صحي', desc: '20 دقيقة — بروتين + كارب معقد + فواكه', cat: 'athletic' },
    { id: 'study1', time: '08:20', end: '10:20', title: 'جلسة دراسة أولى', desc: '120 دقيقة — دراسة أكاديمية مركزة (AI / ML)', cat: 'student' },
    { id: 'break1', time: '10:20', end: '10:35', title: 'استراحة', desc: '15 دقيقة — راحة + سناك صحي', cat: 'student' },
    { id: 'code1', time: '10:35', end: '11:55', title: 'جلسة برمجة أولى', desc: '80 دقيقة — مشروع عملي (Python / Web Dev)', cat: 'student' },
    { id: 'dhuhr', time: '12:02', end: '12:37', title: 'صلاة الظهر في المسجد', desc: '35 دقيقة — مشي + 4 سنة قبلية + فرض + 2 بعدية + عودة', cat: 'islamic', prayer: 'Dhuhr', offset: -5, endOff: 30 },
    { id: 'lunch', time: '12:40', end: '13:10', title: 'وجبة الغداء', desc: '30 دقيقة — بروتين + خضار + كارب', cat: 'athletic' },
    { id: 'study2', time: '13:10', end: '15:05', title: 'جلسة دراسة ثانية', desc: '115 دقيقة — كورسات أونلاين أو قراءة تقنية', cat: 'student' },
    { id: 'asr', time: '15:19', end: '15:44', title: 'صلاة العصر في المسجد', desc: '25 دقيقة — مشي + فرض + تسبيح + عودة', cat: 'islamic', prayer: 'Asr', offset: -5, endOff: 20 },
    { id: 'snack', time: '15:45', end: '15:55', title: 'سناك صحي', desc: '10 دقائق — فاكهة أو مكسرات', cat: 'athletic' },
    { id: 'cardio', time: '15:55', end: '16:25', title: 'مشي أو كارديو خفيف', desc: '30 دقيقة — مشي سريع أو تمارين إطالة', cat: 'athletic' },
    { id: 'problems', time: '16:25', end: '17:05', title: 'حل مسائل برمجية', desc: '40 دقيقة — LeetCode / HackerRank', cat: 'student' },
    { id: 'code2', time: '17:05', end: '17:44', title: 'جلسة برمجة ثانية', desc: '39 دقيقة — مشروع شخصي أو Open Source', cat: 'student' },
    { id: 'iftar', time: '18:00', end: '18:15', title: 'الإفطار', desc: 'تمر + ماء + دعاء الإفطار + وجبة خفيفة', cat: 'islamic', prayer: 'Maghrib', offset: 0, endOff: 15, fastOnly: true },
    { id: 'maghrib', time: '17:49', end: '18:09', title: 'صلاة المغرب في المسجد', desc: '20 دقيقة — مشي + فرض + 2 بعدية + عودة', cat: 'islamic', prayer: 'Maghrib', offset: -5, endOff: 15 },
    { id: 'adhkar_pm', time: '18:09', end: '18:29', title: 'أذكار المساء', desc: '20 دقيقة — الأذكار كاملة', cat: 'islamic', prayer: 'Maghrib', offset: 15, endOff: 35 },
    { id: 'code3', time: '18:30', end: '19:05', title: 'برمجة أو مطالعة حرة', desc: '35 دقيقة — استكمال مشروع أو قراءة حرة', cat: 'student' },
    { id: 'isha', time: '19:06', end: '19:41', title: 'صلاة العشاء + الوتر', desc: '35 دقيقة — مشي + فرض + 2 بعدية + وتر + عودة', cat: 'islamic', prayer: 'Isha', offset: -5, endOff: 30 },
    { id: 'dinner', time: '19:45', end: '20:10', title: 'عشاء خفيف', desc: '25 دقيقة — بروتين + خضار فقط', cat: 'athletic' },
    { id: 'reading', time: '20:10', end: '20:45', title: 'قراءة تقنية', desc: '35 دقيقة — كتب أو مقالات أو توثيق رسمي', cat: 'student' },
    { id: 'adhkar_sleep', time: '20:45', end: '21:00', title: 'أذكار النوم', desc: '15 دقيقة — أذكار ما قبل النوم', cat: 'islamic' },
    { id: 'sleep', time: '21:00', end: '04:24', title: 'النوم', desc: '~7.5 ساعات نوم عميق', cat: 'athletic' },
  ];

  const WORKOUTS = { 0: 'ظهر + بايسبس', 1: 'أرجل + بطن', 2: 'أكتاف + بطن', 3: 'كارديو مكثف', 4: 'Full Body خفيف', 5: 'راحة أو مشي خفيف', 6: 'صدر + ترايسبس' };
  const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const WEEKLY = [
    { id: 'w1', text: 'صيام الإثنين' }, { id: 'w2', text: 'صيام الخميس' }, { id: 'w3', text: 'التبكير لصلاة الجمعة' },
    { id: 'w4', text: 'مراجعة حفظ القرآن' }, { id: 'w5', text: 'تسجيل الوزن الأسبوعي' }, { id: 'w6', text: 'إنجاز مشروع برمجي' },
    { id: 'w7', text: 'حل 7 مسائل LeetCode' }, { id: 'w8', text: 'كتابة مقال تقني' },
  ];
  const QUOTES = [
    { t: '«إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ»', s: 'سورة الرعد — 11' },
    { t: '«وَمَن جَاهَدَ فَإِنَّمَا يُجَاهِدُ لِنَفْسِهِ»', s: 'سورة العنكبوت — 6' },
    { t: '«الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ»', s: 'صحيح مسلم' },
    { t: '«إِنَّ مَعَ الْعُسْرِ يُسْرًا»', s: 'سورة الشرح — 6' },
    { t: '«وَقُل رَّبِّ زِدْنِي عِلْمًا»', s: 'سورة طه — 114' },
    { t: '«خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»', s: 'صحيح البخاري' },
    { t: '«لا يكلف الله نفساً إلا وسعها»', s: 'سورة البقرة — 286' },
  ];
  const KEYS = { tasks: 'dt_tasks', weekly: 'dt_weekly', water: 'dt_water', date: 'dt_date', notif: 'dt_notif', streak: 'dt_streak', streakLast: 'dt_streak_last' };
  let done = {}, weeklyDone = {}, water = 0, filter = 'all', notifOn = false, prayerTimings = null, currentStreak = 0;

  const isFastingDay = (d) => [1, 4].includes(d); // 1: Mon, 4: Thu
  function getIsFasting() {
    const now = new Date();
    const today = now.getDay();
    const manual = localStorage.getItem('dt_fasting');
    // Priority: 1. Manual ON, 2. Manual OFF, 3. Automatic Day
    if (manual === '1') return true;
    if (manual === '0') return false;
    return isFastingDay(today);
  }
  function isSunUp() {
    if (!prayerTimings) return false;
    const now = new Date();
    const m = now.getHours() * 60 + now.getMinutes();
    const fajr = toMin(prayerTimings.Fajr);
    const maghrib = toMin(prayerTimings.Maghrib);
    return m >= fajr && m < maghrib;
  }

  // ── Audio ──
  // ضع الملفين في مجلد TimeTable:
  //   adhan.mp3       ← أذان عادي (لجميع الصلوات)
  //   adhan-fajr.mp3  ← أذان الفجر (يختلف بـ "الصلاة خير من النوم")
  //   task-done.mp3   ← صوت عند إتمام مهمة (ding أو success)
  //   notification.mp3← صوت تنبيه المهام (رنين خفيف)
  const SFX = {
    adhan: new Audio('adhan.mp3'),
    adhanFajr: new Audio('adhan-fajr.mp3'),
    done: new Audio('task-done.mp3'),
    notif: new Audio('notification.mp3'),
    alarm: new Audio('alarm.mp3'),
  };
  Object.values(SFX).forEach(a => { a.preload = 'none'; });
  let lastAdhanMinute = -1, lastCheckMin = -1;

  function toMin(t) { if (!t) return 0; const [h, m] = t.split(':').map(Number); return h * 60 + m; }
  function fromMin(m) { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
  function to12h(t) { if (!t) return '--:--'; const [h, m] = t.split(':').map(Number); return (h === 0 ? 12 : h > 12 ? h - 12 : h) + ':' + String(m).padStart(2, '0') + ' ' + (h >= 12 ? 'م' : 'ص'); }
  function todayKey() { const d = new Date(); return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); }

  // Prayer API
  async function fetchPrayers() {
    try {
      const r = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5');
      const j = await r.json();
      if (j.code === 200) {
        prayerTimings = {};
        ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(k => { prayerTimings[k] = j.data.timings[k].substring(0, 5); });
        // ── Hijri date ──
        const h = j.data?.date?.hijri;
        if (h) {
          const el = document.getElementById('hijriDate');
          if (el) el.textContent = h.day + ' ' + h.month.ar + ' ' + h.year + ' هـ';
        }
        applyPrayerTimes(); renderPrayerBar(); renderSchedule(); highlightCurrent();
        checkNotifs();
      }
    } catch (e) { console.warn('Prayer API:', e); }
  }

  function applyPrayerTimes() {
    if (!prayerTimings) return;
    // Helper to find task by id
    const T = id => SCHEDULE.find(t => t.id === id);

    // ── Step 1: prayer-offset tasks (adhan-relative) ──
    SCHEDULE.forEach(t => {
      if (t.prayer && prayerTimings[t.prayer]) {
        const base = toMin(prayerTimings[t.prayer]);
        t.time = fromMin(base + (t.offset || 0));
        t.end = fromMin(base + (t.endOff || 15));
      }
    });

    // ── Step 2: Morning cascade (Sunrise → Dhuhr) ──
    const sunrise = toMin(prayerTimings.Sunrise);
    // Quran ends exactly at Sunrise
    T('quran').end = prayerTimings.Sunrise;
    // Workout: Sunrise+40 (after duha Sunrise+35, +5 buffer), 60 min
    const wStart = sunrise + 40;
    T('workout').time = fromMin(wStart);
    T('workout').end = fromMin(wStart + 60);
    // Breakfast: after workout, 20 min
    const bfStart = wStart + 60;
    T('breakfast').time = fromMin(bfStart);
    T('breakfast').end = fromMin(bfStart + 20);
    // Total available window from breakfast-end → Dhuhr-10
    // Fixed: study1(120) + break1(15) + code1(min 20) = 155 min needed
    const dhuhrMin = toMin(prayerTimings.Dhuhr);
    const windowEnd = dhuhrMin - 10;     // latest code1 can end
    const windowStart = bfStart + 20;     // earliest study1 can start
    const available = windowEnd - windowStart; // how many min we have
    const MIN_CODE1 = 20;
    // If enough room → normal; else → compress study1/break1 proportionally
    let study1Dur, break1Dur;
    if (available >= 155) {
      study1Dur = 120; break1Dur = 15;
    } else if (available >= MIN_CODE1 + 15) {
      // distribute: give break1 its 15 min, rest to study1, code1 gets MIN_CODE1
      break1Dur = 15;
      study1Dur = Math.max(30, available - break1Dur - MIN_CODE1);
    } else {
      // extreme case: just squeeze what we have
      study1Dur = Math.max(0, available - MIN_CODE1);
      break1Dur = 0;
    }
    const s1Start = windowStart;
    T('study1').time = fromMin(s1Start);
    T('study1').end = fromMin(s1Start + study1Dur);
    const br1Start = s1Start + study1Dur;
    T('break1').time = fromMin(br1Start);
    T('break1').end = fromMin(br1Start + break1Dur);
    // Code1: starts after break1, ends 10 min before Dhuhr
    T('code1').time = fromMin(br1Start + break1Dur);
    T('code1').end = fromMin(dhuhrMin - 10);


    // ── Step 3: Afternoon cascade (Dhuhr → Asr) ──
    const dhuhrEnd = dhuhrMin + 30; // dhuhr offset endOff=30
    // Lunch: after Dhuhr prayer, 30 min
    T('lunch').time = fromMin(dhuhrEnd);
    T('lunch').end = fromMin(dhuhrEnd + 30);
    // Study2: after lunch, ends 10 min before Asr
    const asrMin = toMin(prayerTimings.Asr);
    T('study2').time = fromMin(dhuhrEnd + 30);
    T('study2').end = fromMin(asrMin - 10);

    // ── Step 4: Evening cascade (Asr → Maghrib) ──
    const asrEnd = asrMin + 20; // asr endOff=20
    // Snack: after Asr, 10 min
    T('snack').time = fromMin(asrEnd);
    T('snack').end = fromMin(asrEnd + 10);
    // Cardio: after snack, 30 min
    T('cardio').time = fromMin(asrEnd + 10);
    T('cardio').end = fromMin(asrEnd + 40);
    // Problems: after cardio, 40 min
    T('problems').time = fromMin(asrEnd + 40);
    T('problems').end = fromMin(asrEnd + 80);
    // Code2: after problems, ends 10 min before Maghrib
    const maghribMin = toMin(prayerTimings.Maghrib);
    T('code2').time = fromMin(asrEnd + 80);
    T('code2').end = fromMin(maghribMin - 10);

    // ── Step 5: Night cascade (Maghrib → Sleep) ──
    // Code3: after adhkar_pm (Maghrib+35), ends 10 min before Isha
    const ishaMin = toMin(prayerTimings.Isha);
    const adhkarPmEnd = maghribMin + 35;
    T('code3').time = fromMin(adhkarPmEnd);
    T('code3').end = fromMin(ishaMin - 10);
    // Isha already set by prayer offset (Isha-5 → Isha+30)
    const ishaEnd = ishaMin + 30;
    // Dinner: after Isha, 25 min
    T('dinner').time = fromMin(ishaEnd);
    T('dinner').end = fromMin(ishaEnd + 25);
    // Reading: after dinner, 35 min
    T('reading').time = fromMin(ishaEnd + 25);
    T('reading').end = fromMin(ishaEnd + 60);
    // Adhkar sleep: after reading, 15 min → sleep time
    T('adhkar_sleep').time = fromMin(ishaEnd + 60);
    T('adhkar_sleep').end = fromMin(ishaEnd + 75);
    // Sleep: after adhkar, ends when qiyam starts
    T('sleep').time = fromMin(ishaEnd + 75);
    T('sleep').end = T('qiyam').time;
    renderSleepHours();
  }

  function renderSleepHours() {
    const el = document.getElementById('sleepHours');
    const stat = document.getElementById('sleepStat');
    if (!el) return;
    const sleep = SCHEDULE.find(t => t.id === 'sleep');
    const qiyam = SCHEDULE.find(t => t.id === 'qiyam');
    if (!sleep || !qiyam) return;
    const sleepStart = toMin(sleep.time);
    const sleepEnd = toMin(qiyam.time); // qiyam.time = Fajr - 30
    // sleep crosses midnight: duration = (1440 - sleepStart) + sleepEnd
    let mins = sleepEnd + 1440 - sleepStart;
    if (mins > 1440) mins -= 1440;
    const h = Math.floor(mins / 60), m = mins % 60;
    el.textContent = h + (m > 0 ? '.' + Math.round(m / 6) : '') + ' س';
    // warn if less than 6 hours
    const isLow = mins < 360;
    stat.classList.toggle('stat--sleep-warn', isLow);
    stat.title = isLow
      ? `⚠️ ${h} ساعة ${m} دقيقة — أقل من الحد الأدنى (6 ساعات)! يُنصح بالنوم مبكراً.`
      : `${h} ساعة ${m} دقيقة نوم ✓`;
  }


  function renderPrayerBar() {
    if (!prayerTimings) return;
    const now = new Date().getHours() * 60 + new Date().getMinutes();
    const ps = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const ids = ['pFajr', 'pSunrise', 'pDhuhr', 'pAsr', 'pMaghrib', 'pIsha'];
    let nf = false;
    ps.forEach((p, i) => {
      const el = document.getElementById(ids[i]); if (!el) return;
      el.textContent = to12h(prayerTimings[p]);
      const item = el.closest('.prayer-item'); item.classList.remove('next');
      if (!nf && toMin(prayerTimings[p]) > now) { item.classList.add('next'); nf = true; }
    });
    if (!nf) document.querySelector('[data-prayer="Fajr"]')?.classList.add('next');
  }

  // ── Streak ──
  function loadStreak() { currentStreak = parseInt(localStorage.getItem(KEYS.streak)) || 0; }
  function saveStreak() { localStorage.setItem(KEYS.streak, currentStreak); }
  function updateStreak(completedToday) {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yk = yesterday.getFullYear() + '-' + yesterday.getMonth() + '-' + yesterday.getDate();
    const lastActive = localStorage.getItem(KEYS.streakLast);
    if (!completedToday) return renderStreakBadge();
    if (lastActive === todayKey()) return; // already counted today
    localStorage.setItem(KEYS.streakLast, todayKey());
    if (lastActive === yk) currentStreak++; // consecutive day
    else currentStreak = 1;                 // streak broken, restart
    saveStreak();
    renderStreakBadge();
    checkStreakMilestones();
  }
  function checkStreakMilestones() {
    const milestones = [7, 30, 100, 365];
    if (milestones.includes(currentStreak)) {
      if (Notification.permission === 'granted') {
        new Notification('🌟 إنجاز رائع!', {
          body: `تهانينا! لقد أكملت ${currentStreak} يوماً متتالياً من الالتزام. استمر في التقدم!`,
          icon: 'https://cdn-icons-png.flaticon.com/512/11103/11103730.png'
        });
      }
    }
  }
  function renderStreakBadge() {
    const el = document.getElementById('streakVal');
    if (el) el.textContent = currentStreak;
    const badge = document.getElementById('streakBadge');
    if (badge) badge.title = currentStreak + ' يوم متتالي';
  }

  function checkReset() {
    const t = todayKey();
    if (localStorage.getItem(KEYS.date) !== t) {
      // Check if yesterday tasks were ≥80% done → update streak
      const prev = JSON.parse(localStorage.getItem(KEYS.tasks)) || {};
      const pctDone = SCHEDULE.length ? Object.keys(prev).length / SCHEDULE.length : 0;
      if (pctDone >= 0.8) updateStreak(true);
      else { currentStreak = 0; saveStreak(); }
      localStorage.removeItem(KEYS.tasks); localStorage.removeItem(KEYS.water);
      localStorage.setItem(KEYS.date, t);
      if (new Date().getDay() === 6) localStorage.removeItem(KEYS.weekly);
    }
  }
  function loadState() {
    try { done = JSON.parse(localStorage.getItem(KEYS.tasks)) || {}; weeklyDone = JSON.parse(localStorage.getItem(KEYS.weekly)) || {}; water = parseInt(localStorage.getItem(KEYS.water)) || 0; notifOn = localStorage.getItem(KEYS.notif) === '1'; }
    catch { done = {}; weeklyDone = {}; water = 0; }
  }
  function save() { localStorage.setItem(KEYS.tasks, JSON.stringify(done)); localStorage.setItem(KEYS.weekly, JSON.stringify(weeklyDone)); localStorage.setItem(KEYS.water, String(water)); }

  // ── Countdown ──
  function getNextTask() {
    const m = new Date().getHours() * 60 + new Date().getMinutes();
    const isFasting = getIsFasting();

    // Find the soonest upcoming undone task (wraps around midnight)
    let bestTask = null, bestDiff = Infinity;
    for (const t of SCHEDULE) {
      if (done[t.id]) continue;

      const isMeal = ['breakfast', 'lunch', 'dinner', 'snack'].includes(t.id);
      const isFastOnly = t.fastOnly;

      if (isFasting && isMeal) continue; // Skip meals if fasting
      if (!isFasting && isFastOnly) continue; // Skip Suhoor/Iftar if not fasting

      const s = toMin(t.time);
      let diff = s - m;
      if (diff <= 0) diff += 1440; // wrap midnight
      if (diff < bestDiff) { bestDiff = diff; bestTask = t; }
    }
    return bestTask ? { task: bestTask, diff: bestDiff } : null;
  }
  function renderCountdown() {
    const el = document.getElementById('countdownBar');
    if (!el) return;
    const next = getNextTask();
    if (!next) { el.style.display = 'none'; return; }
    el.style.display = 'flex';
    const h = Math.floor(next.diff / 60), mins = next.diff % 60;
    const timeStr = h > 0 ? `${h} س ${mins} د` : `${mins} دقيقة`;
    document.getElementById('countdownText').textContent = `${next.task.title} — بعد ${timeStr}`;
    el.classList.toggle('countdown--urgent', next.diff <= 10);
  }

  function startClock() {
    const tick = () => {
      const n = new Date();
      document.getElementById('liveTime').textContent = to12h(String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0'));
      renderCountdown();
    };
    tick();
    setInterval(tick, 1000); // every second for live clock + countdown
    setInterval(() => { highlightCurrent(); renderPrayerBar(); }, 60000);
  }
  function renderDate() { document.getElementById('currentDate').textContent = new Intl.DateTimeFormat('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()); }
  function renderDayInfo() { const d = new Date().getDay(); document.getElementById('dayName').textContent = DAY_NAMES[d]; document.getElementById('dayWorkout').textContent = 'تمرين اليوم: ' + WORKOUTS[d]; }
  function renderQuote() { const q = QUOTES[Math.floor(Math.random() * QUOTES.length)]; document.getElementById('quoteText').textContent = q.t; document.getElementById('quoteSrc').textContent = '— ' + q.s; }

  function renderSchedule() {
    const isFasting = getIsFasting();
    const now = new Date();
    const today = now.getDay();
    const tomorrow = (today + 1) % 7;
    const isEveOfFast = isFastingDay(tomorrow) && now.getHours() >= 20; // After 8 PM on eve

    document.getElementById('schedule').innerHTML = SCHEDULE.map(t => {
      const isMeal = ['breakfast', 'lunch', 'dinner', 'snack'].includes(t.id);
      const isSuhoorRel = t.id === 'suhoor';
      const isIftarRel = t.id === 'iftar';

      let isHidden = (filter !== 'all' && t.cat !== filter);

      if (isFasting) {
        if (isMeal) isHidden = true;
      } else {
        if (isIftarRel) isHidden = true;
        // Only show Suhoor if it's the eve of a fasting day or manual fasting
        if (isSuhoorRel && !isEveOfFast) isHidden = true;
      }
      const timeVal = t.time || '00:00';
      const endVal = t.end || '00:00';
      return `
      <div class="schedule-item${done[t.id] ? ' done' : ''}${isHidden ? ' hidden' : ''}" data-id="${t.id}" data-cat="${t.cat}" data-time="${timeVal}" data-end="${endVal}">
        <div class="sched-check">${CHK}</div>
        <div class="sched-body">
          <div class="sched-top"><span class="sched-time">${to12h(t.time)}</span><span class="sched-title">${t.title}<span class="now-badge">الآن</span></span></div>
          <div class="sched-desc">${t.desc}</div>
          <div class="task-progress"><div class="task-progress-bar" style="width:0%"></div></div>
        </div>
      </div>`;
    }).join('');
  }

  function highlightCurrent() {
    const m = new Date().getHours() * 60 + new Date().getMinutes();
    document.querySelectorAll('.schedule-item').forEach(el => {
      el.classList.remove('is-now');
      const s = toMin(el.dataset.time), e = toMin(el.dataset.end);
      const isNow = e < s ? m >= s || m < e : m >= s && m < e;
      if (isNow) {
        el.classList.add('is-now');
        // ── Progress bar: how far through this task ──
        let total = e < s ? (1440 - s + e) : (e - s);
        let elapsed = m >= s ? (m - s) : (1440 - s + m);
        const pct = total > 0 ? Math.min(100, Math.round(elapsed / total * 100)) : 0;
        const bar = el.querySelector('.task-progress-bar');
        if (bar) bar.style.width = pct + '%';
      }
    });
    const c = document.querySelector('.schedule-item.is-now:not(.hidden)');
    if (c) setTimeout(() => c.scrollIntoView({ behavior: 'smooth', block: 'center' }), 600);
  }

  function updateProgress() {
    const c = { islamic: [0, 0], athletic: [0, 0], student: [0, 0] };
    const isFasting = getIsFasting();
    SCHEDULE.forEach(t => {
      const isMeal = ['breakfast', 'lunch', 'dinner', 'snack'].includes(t.id);
      const isFastOnly = t.fastOnly;
      if (isFasting) {
        if (isMeal) return;
      } else {
        if (isFastOnly) return;
      }
      c[t.cat][1]++;
      if (done[t.id]) c[t.cat][0]++;
    });
    const p = (a, b) => b ? Math.round(a / b * 100) : 0;
    document.getElementById('pctIslamic').textContent = p(c.islamic[0], c.islamic[1]) + '%';
    document.getElementById('pctAthletic').textContent = p(c.athletic[0], c.athletic[1]) + '%';
    document.getElementById('pctStudent').textContent = p(c.student[0], c.student[1]) + '%';
    const tot = c.islamic[0] + c.athletic[0] + c.student[0], all = c.islamic[1] + c.athletic[1] + c.student[1], op = p(tot, all);
    document.getElementById('overallPct').textContent = op;
    document.getElementById('ringFill').style.strokeDashoffset = 276.46 - (op / 100) * 276.46;
    // ── Remaining tasks counter ──
    const remaining = all - tot;
    const remEl = document.getElementById('remainingCount');
    if (remEl) remEl.textContent = remaining > 0 ? remaining + ' مهمة متبقية' : '✓ أنجزت كل شيء!';
    saveHistory(op); renderCalendar(); updateStreak(op >= 80);
  }

  function renderWater() {
    const el = document.getElementById('waterDots'); el.innerHTML = '';
    for (let i = 0; i < 12; i++) { const d = document.createElement('div'); d.className = 'water-dot' + (i < water ? ' filled' : ''); d.dataset.i = i; el.appendChild(d); }
    document.getElementById('waterCount').textContent = water + '/12';
  }

  function renderWeekly() {
    document.getElementById('weeklyGrid').innerHTML = WEEKLY.map(g => `<div class="weekly-item${weeklyDone[g.id] ? ' done' : ''}" data-id="${g.id}"><div class="weekly-check">${CHK}</div><span class="weekly-text">${g.text}</span></div>`).join('');
  }

  // ── Monthly Calendar ──
  const HIST_PREFIX = 'dt_hist_';
  let lastCalKey = '';
  function saveHistory(pct) {
    localStorage.setItem(HIST_PREFIX + todayKey(), String(pct));
  }
  function renderCalendar() {
    const el = document.getElementById('calendarGrid'); if (!el) return;
    const now = new Date();
    const year = now.getFullYear(), month = now.getMonth();
    const calKey = year + '-' + month;
    // Only fully re-render on day/month change
    if (calKey === lastCalKey) {
      // light update: just refresh today's cell color
      updateTodayCell(now.getDate(), year, month);
      return;
    }
    lastCalKey = calKey;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    let html = `<div class="cal-month">${monthNames[month]} ${year}</div><div class="cal-days">`;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = HIST_PREFIX + year + '-' + month + '-' + d;
      const val = parseInt(localStorage.getItem(key)) || 0;
      const isToday = d === now.getDate();
      html += `<div class="${calCellClass(isToday, val)}" id="calDay${d}" title="${d} — ${val}%">${d}</div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }
  function calCellClass(isToday, val) {
    let cls = 'cal-day';
    if (isToday) cls += ' cal-day--today';
    if (val >= 80) cls += ' cal-day--high';
    else if (val >= 50) cls += ' cal-day--mid';
    else if (val > 0) cls += ' cal-day--low';
    return cls;
  }
  function updateTodayCell(day, year, month) {
    const cell = document.getElementById('calDay' + day); if (!cell) return;
    const val = parseInt(localStorage.getItem(HIST_PREFIX + year + '-' + month + '-' + day)) || 0;
    cell.className = calCellClass(true, val);
    cell.title = day + ' — ' + val + '%';
  }

  function openFocus(t) { document.getElementById('focusTitle').textContent = t.title; document.getElementById('focusDesc').textContent = t.desc; document.getElementById('focusTime').textContent = to12h(t.time) + ' — ' + to12h(t.end); document.getElementById('focusOverlay').classList.add('active'); }
  function closeFocus() { document.getElementById('focusOverlay').classList.remove('active'); }

  function setupNotif() {
    const btn = document.getElementById('notifToggle');
    if (notifOn) { btn.classList.add('active'); document.getElementById('notifLabel').textContent = 'مفعّلة'; }
    btn.addEventListener('click', async () => {
      if (!('Notification' in window)) { alert('المتصفح لا يدعم الإشعارات'); return; }
      if (!notifOn) { const p = await Notification.requestPermission(); if (p === 'granted') { notifOn = true; localStorage.setItem(KEYS.notif, '1'); btn.classList.add('active'); document.getElementById('notifLabel').textContent = 'مفعّلة'; new Notification('تم تفعيل الإشعارات', { body: 'سيتم تنبيهك قبل كل مهمة بـ 5 دقائق' }); } }
      else { notifOn = false; localStorage.setItem(KEYS.notif, '0'); btn.classList.remove('active'); document.getElementById('notifLabel').textContent = 'إشعارات'; }
    });
  }
  function checkNotifs() {
    if (!prayerTimings) return;
    const now = new Date();
    const m = now.getHours() * 60 + now.getMinutes();
    if (m === lastCheckMin) return;
    lastCheckMin = m;

    // ── Notification icon ──
    const ICON = 'icon-192.png';
    const TASK_ICON = 'icon-192.png';
    const WATER_ICON = 'icon-192.png';

    // ── Morning Welcome Notification (Reset Notification) ──
    const resetHour = 5, resetMin = 30; // 5:30 AM
    if (m === resetHour * 60 + resetMin && lastAdhanMinute !== m) {
      lastAdhanMinute = m;
      new Notification('صباح الخير ☀️', {
        body: 'جدولك اليومي جاهز. ابدأ يومك بنشاط وتوكل على الله!',
        icon: TASK_ICON,
        tag: 'daily_welcome'
      });
    }

    // ── Adhan sounds + prayer popup ──
    if (m !== lastAdhanMinute) {
      const prayerNames = { Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
      const prayerMap = {
        Fajr: { min: toMin(prayerTimings.Fajr), fajr: true },
        Dhuhr: { min: toMin(prayerTimings.Dhuhr), fajr: false },
        Asr: { min: toMin(prayerTimings.Asr), fajr: false },
        Maghrib: { min: toMin(prayerTimings.Maghrib), fajr: false },
        Isha: { min: toMin(prayerTimings.Isha), fajr: false },
      };
      for (const [name, { min, fajr }] of Object.entries(prayerMap)) {
        if (min === m) {
          lastAdhanMinute = m;
          const audio = fajr ? SFX.adhanFajr : SFX.adhan;
          audio.currentTime = 0;
          audio.play().catch(() => { });
          // prayer popup notification
          if (Notification.permission === 'granted') {
            new Notification('حان وقت صلاة ' + prayerNames[name], {
              body: 'اللهم اجعلنا من المحافظين على الصلوات',
              tag: 'prayer_' + name,
              icon: ICON,
              requireInteraction: false,
            });
          }
          break;
        }
      }
    }

    // ── Browser notifications for tasks ──
    if (!notifOn || Notification.permission !== 'granted') return;

    SCHEDULE.forEach(t => {
      const tm = toMin(t.time);
      const te = toMin(t.end);

      // Skip meal notifications ONLY if the sun is currently up (actual fasting hours)
      const isMeal = ['breakfast', 'lunch', 'dinner', 'snack'].includes(t.id);
      if (getIsFasting() && isSunUp() && isMeal) return;

      // Leave for Mosque (5 min before prayer-related tasks if they are in the mosque)
      const isMosqueTask = t.title.includes('في المسجد');
      if (isMosqueTask && tm - m === 10 && !done[t.id]) {
        new Notification('تنبيه: "غادر للمسجد الآن"', { body: `موعد صلاة ${t.prayer} يقترب. وقت المشي 5 دقائق.`, tag: t.id + '_mosque', icon: ICON });
      }

      // 5 min before start
      if (tm - m === 5 && !done[t.id]) {
        new Notification(t.title, { body: t.desc + ' — بعد 5 دقائق', tag: t.id + '_pre', icon: TASK_ICON });
        SFX.notif.cloneNode().play().catch(() => { });
      }
      // at start
      if (tm === m && !done[t.id]) {
        const isWakeUp = ['qiyam', 'suhoor'].includes(t.id);
        const title = isWakeUp ? '⏰ استيقظ: ' + t.title : 'حان الوقت: ' + t.title;

        new Notification(title, {
          body: t.desc,
          tag: t.id + '_now',
          icon: TASK_ICON,
          requireInteraction: isWakeUp // Stay on screen until dismissed for wake-up tasks
        });

        // Play sound
        const playSfx = () => {
          const audio = isWakeUp ? SFX.alarm : SFX.notif;
          audio.cloneNode().play().catch(() => { });
        };

        playSfx();
        if (isWakeUp) {
          // Repeat alarm sound to ensure the user wakes up
          setTimeout(playSfx, 3000);
          setTimeout(playSfx, 6000);
          if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
        }
      }
      // at end (End of task notification)
      if (te === m) {
        new Notification('انتهى وقت: ' + t.title, {
          body: done[t.id] ? 'أحسنت! المهمة اكتملت بنجاح.' : 'هل أنهيت هذه المهمة؟ سجل إنجازك الآن.',
          tag: t.id + '_end',
          icon: TASK_ICON
        });
        if (!done[t.id]) SFX.notif.cloneNode().play().catch(() => { });
      }
    });

    // ── Water reminder logic ──
    const h = now.getHours();
    const isFastDay = getIsFasting();
    const sunUp = isSunUp();

    let shouldRemindWater = false;
    if (isFastDay) {
      if (!sunUp) {
        // Night time of a fasting day (Mon/Thu): Remind every hour at the top of the hour
        if (now.getMinutes() === 0) shouldRemindWater = true;
      }
      // If fasting (sun is up): no reminders.
    } else {
      // Normal Day: 8 AM to 10 PM, every 2 hours
      if (h >= 8 && h <= 22 && now.getMinutes() === 0 && h % 2 === 0) {
        shouldRemindWater = true;
      }
    }

    if (shouldRemindWater && water < 12) {
      new Notification('💧 تذكير الماء', {
        body: isFastDay ? 'أنت في وقت الفطر الآن. اشرب كوباً لتعويض صيامك!' : 'حافظ على ترطيب جسمك — شربت ' + water + ' من 12 كوب اليوم.',
        tag: 'water_reminder',
        icon: WATER_ICON,
      });
    }
  }


  function bindEvents() {
    document.getElementById('schedule').addEventListener('click', e => {
      const item = e.target.closest('.schedule-item'); if (!item) return;
      const id = item.dataset.id;
      if (done[id]) {
        delete done[id]; item.classList.remove('done');
        if (navigator.vibrate) navigator.vibrate([30, 50, 30]); // soft double-tap = undo
      } else {
        done[id] = true; item.classList.add('done');
        item.style.transform = 'scale(1.02)'; setTimeout(() => item.style.transform = '', 200);
        if (navigator.vibrate) navigator.vibrate(50); // success tap
        SFX.done.cloneNode().play().catch(() => { });
      }
      save(); updateProgress();
    });
    document.getElementById('schedule').addEventListener('dblclick', e => { const item = e.target.closest('.schedule-item'); if (!item) return; const t = SCHEDULE.find(x => x.id === item.dataset.id); if (t) openFocus(t); });
    document.querySelectorAll('.tab').forEach(tab => { tab.addEventListener('click', () => { document.querySelectorAll('.tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); filter = tab.dataset.filter; document.querySelectorAll('.schedule-item').forEach(el => { el.classList.toggle('hidden', filter !== 'all' && el.dataset.cat !== filter); }); }); });
    document.getElementById('waterDots').addEventListener('click', e => { const dot = e.target.closest('.water-dot'); if (!dot) return; const i = parseInt(dot.dataset.i); water = (i + 1 === water) ? i : i + 1; save(); renderWater(); });
    document.getElementById('weeklyGrid').addEventListener('click', e => { const item = e.target.closest('.weekly-item'); if (!item) return; const id = item.dataset.id; if (weeklyDone[id]) delete weeklyDone[id]; else weeklyDone[id] = true; save(); renderWeekly(); });
    document.getElementById('resetBtn').addEventListener('click', () => {
      if (!confirm('هل تريد إعادة تعيين كل مهام اليوم؟')) return;
      done = {}; water = 0;
      localStorage.removeItem('dt_fasting'); // Reset fasting preference to automatic
      save();
      renderSchedule(); renderWater(); updateProgress(); highlightCurrent();
      // Refresh UI state
      const isF = getIsFasting();
      document.body.classList.toggle('fasting', isF);
      fastBtn.classList.toggle('active', isF);
    });
    // Fasting mode
    const fastBtn = document.getElementById('fastToggle');
    const isFasting = getIsFasting();
    if (isFasting) { document.body.classList.add('fasting'); fastBtn.classList.add('active'); }
    fastBtn.addEventListener('click', () => {
      const currentlyManual = localStorage.getItem('dt_fasting') === '1';
      const on = document.body.classList.toggle('fasting');
      fastBtn.classList.toggle('active', on);
      localStorage.setItem('dt_fasting', on ? '1' : '0');
      renderSchedule();
      updateProgress();
    });
    document.getElementById('focusClose').addEventListener('click', closeFocus);
    document.getElementById('focusOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeFocus(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFocus(); });
  }

  function init() {
    loadStreak(); checkReset(); loadState(); renderDate(); startClock(); renderQuote(); renderDayInfo();
    renderSchedule(); renderWater(); renderWeekly(); updateProgress(); renderCalendar();
    setupNotif(); fetchPrayers(); bindEvents(); highlightCurrent();
    renderStreakBadge(); renderCountdown();
    setInterval(checkNotifs, 60000);
    checkNotifs(); // first immediate check (adhan/notif) at page open
  }
  document.addEventListener('DOMContentLoaded', init);
})();

// ── PWA Service Worker ──
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(e => console.warn('SW:', e));
}

