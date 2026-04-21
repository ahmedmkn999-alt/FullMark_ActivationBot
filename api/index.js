const { Telegraf } = require('telegraf');
const admin = require('firebase-admin');

// ─────────────────────────────────────────
//  Firebase Init
// ─────────────────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "fullmark-neweddition",
      private_key_id: "8e6bea610e1b4d1af3d27c27e137bd34e6636a4e",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCj593kaisD2UBo\noiWS25EmmBDCer1zV9LTsjtkh0Si7iEkZHA9wknRV71bAdhnBYB9ZVYSN5mjlnSf\nNhkO/CJ5gUtP9v0XPXk1SwFnx2qXq+WS3Cu+P87k43s/n7GhU3upFRGH5mi01Wq1\nBdW86TgTbwwSROXCnJ7N/8f3CvLj8rfuVO9C8Q57OLPVLZJxLqcRH52Fl/d0I+uv\n87pUl8+TjUOkkUEi94q/Wnv4+RG99hMuZxTY8K+zVs7nrkYVMszGnLV7Ww7chN9L\nql4Ws9m3Xk8DfN0qsl2Mm3Zlkyx5Kn21Z8uf1MvK5gj6e8FThg5rtvMNGuBkdLv6\nIfVcz9yDAgMBAAECgf9Z6EM8MseoBDMlycvShSyZwV5mpOPCI8Si/C+hkZsP/XMd\nmwQJhy+E9jhoM11M/6lj8Aegqq+g9J/LOlgJQ8m4ToSKxaA+SfCy1IAbhNqsYWo8\nFoAhD/I5M1+vBr93W1iRfqx5MAHqJlaDSx0d5nFJG0a4ARx49Kl891FVZgYraxLU\nlLwK00kJbQaZ7cltFw76puOfwces1Zjyfa7csLUUnABO/4GkjN5JIbMGjGFetCNM\n1xN0kT8FhTTf/o1IP0YDVuPNgosYGanfQrKtWlBdw6CbeIxb06lDjW20glAD97Bd\nTIm6DsiNl9HS5bot2qOYekEbNfzPqweEinN6Da0CgYEA1sMr+DjgQB3QqCyHrFRg\nnfovm4uQFb6bVVgmOQHb9MCn5BjQQgsF6gvTrxpp69p0ALKJJCdk1trI9N7i+qwv\nz8eAf4ytHLFJMEyo9XJJmDu3i8EOACYuCyWzwCwbY/ckAc6FsZiMgAmIaSoNFpjH\nlNvyON5gGKgWJvPA4t6Ik1UCgYEAw2DK5K+DoieUbT4MzMl5U5syJZi0iPox5tpb\n+FL2+f8vbZq+mWOHosGA0YL9ejwCCoJ01exulNOlTdGI2o28u+fyoH0ozt54yqDR\ntqxbfDsPzQOYiwWn+Du1VEHAZuXH9az5PHM9ggqc/KuCONHbMsIG1RI7eFOQzawu\nJuLF4HcCgYEAtk3W9U7SjZrBlQC36sF1gqTt5MwD83FpyniZearqXEluO2IU5vsU\neiiv+OQjJeK6thzX7ajDIN931uWdJ80iiO6BVcTE7qZPyoBIrJHnhyKqHCg1Ckte\nqnfGrkrCtYkFN8NoGem02rs84Iihs5zdTq+mXj/mswd8RnSEOBFPPkECgYAk5rEr\nhCLei48zGtccDqmFqvhLtY3TmT23lmJsgm73RMVWdDWvjubdTKLh71WkspTIG1+p\nz+AK5/Z+viaU8NRGwUZIHZuJhudVjg5N7DvTOOyBEj7LcyQIdG6JHWoThS7BLgxc\n6H8jgpGn/1S3GpvF+HOF5s2oqk/dKLoGyioJfQKBgQDQc2sWkR7raz1Z8v92hEE8\nkOE/FPLvDdlH5psghq05ZU0yxbBPCjJ6QmV1LLy1F+Ya+XeLjp5AE0jTpgorUlLB\nZIc4wYipK2x0PypqgJD7+L3evqAwuXZEvtWiZPB2N+ueXsE00T4m35N4w9VNadI4\ndDfLoOIsWbfGCuvOA0SmZQ==\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk-fbsvc@fullmark-neweddition.iam.gserviceaccount.com",
      client_id: "103917924440939464168"
    }),
    databaseURL: "https://fullmark-neweddition-default-rtdb.europe-west1.firebasedatabase.app"
  });
}

const db = admin.database();
const bot = new Telegraf('8473800828:AAFTTHHoUb_ccXc0FOJb6y6DLzBCSAKoxH8');
const OWNERS = [1778665778, 6188310641];
const CODE_PRICE = 200;

// ─────────────────────────────────────────
//  Session
// ─────────────────────────────────────────
const sessions = {};
const getSession = (userId) => {
  if (!sessions[userId]) sessions[userId] = {};
  return sessions[userId];
};

// ─────────────────────────────────────────
//  مساعدات
// ─────────────────────────────────────────
const generateCode = () => Math.floor(100000000 + Math.random() * 900000000).toString();

const formatDate = (ts) =>
  new Date(ts).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

const safeReply = async (ctx, msg, extra = {}) => {
  try { return await ctx.reply(msg, extra); } catch (e) { console.error('Reply error:', e.message); }
};

const withTimeout = (promise, ms = 8000) =>
  Promise.race([promise, new Promise((_, r) => setTimeout(() => r(new Error('timeout')), ms))]);

const getUserName = async (userId) => {
  const snap = await withTimeout(db.ref(`users/${userId}/name`).once('value'));
  return snap.exists() ? snap.val() : String(userId);
};

// ─────────────────────────────────────────
//  Middleware التحقق
// ─────────────────────────────────────────
const checkAuth = async (ctx, next) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;

    if (OWNERS.includes(userId)) {
      ctx.state.role = 'OWNER';
      const nameSnap = await withTimeout(db.ref(`users/${userId}/name`).once('value'));
      if (!nameSnap.exists()) {
        getSession(userId).step = 'REGISTER_NAME';
        return safeReply(ctx, `👑 أهلاً بالمالك!\n\nأرسل اسمك عشان يتسجل في النظام:`);
      }
      return next();
    }

    const staffSnap = await withTimeout(db.ref(`staff/${userId}`).once('value'));
    if (staffSnap.exists()) {
      const staffData = staffSnap.val();
      if (staffData.banned) return safeReply(ctx, "🚫 تم حظرك من استخدام البوت.");
      ctx.state.role = 'STAFF';
      return next();
    }

    return safeReply(ctx, "❌ غير مسموح لك بالدخول.");
  } catch (e) {
    console.error('Auth error:', e.message);
    return safeReply(ctx, "⚠️ خطأ في التحقق، حاول مرة ثانية.");
  }
};

// ─────────────────────────────────────────
//  القائمة الرئيسية
// ─────────────────────────────────────────
const mainMenu = (role) => {
  const buttons = [
    ['📅 كود شهر بفلوس', '🎁 كود شهر مجاني'],
    ['⏳ تجربة ساعة', '🔄 تجديد اشتراك'],
    ['📱 تغيير الجهاز'],
    ['📊 إحصائياتي', '💰 أرباحي'],
    ['📋 أكوادي', '⏰ أكواد قاربت تنتهي'],
  ];
  if (role === 'OWNER') {
    buttons.push(['🔍 بحث عن طالب', '🚫 حظر/فك حظر طالب']);
    buttons.push(['➕ إضافة موظف', '🗑️ حذف موظف']);
    buttons.push(['🔒 حظر موظف', '📈 إحصائيات عامة']);
    buttons.push(['💵 أرباح الفريق', '👥 قائمة الأونرز']);
    buttons.push(['📤 تصدير الطلاب']);
  }
  return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
};

// ─────────────────────────────────────────
//  /start
// ─────────────────────────────────────────
bot.start(checkAuth, async (ctx) => {
  const userId = ctx.from.id;
  const session = getSession(userId);
  const role = ctx.state.role;
  session.step = null;
  const name = await getUserName(userId);
  return safeReply(ctx,
    `🎓 *أهلاً ${name}!*\n🚀 لوحة تحكم FullMark جاهزة.`,
    { parse_mode: 'Markdown', ...mainMenu(role) }
  );
});

// ─────────────────────────────────────────
//  معالج الرسائل
// ─────────────────────────────────────────
bot.on('text', checkAuth, async (ctx) => {
  const text = ctx.message.text.trim();
  const userId = ctx.from.id;
  const session = getSession(userId);
  const step = session.step;
  const role = ctx.state.role;

  try {

    // ── تسجيل اسم الأونر (أول مرة) ──
    if (step === 'REGISTER_NAME') {
      await withTimeout(db.ref(`users/${userId}`).set({ name: text, role: 'OWNER', registeredAt: Date.now() }));
      for (const ownerId of OWNERS) {
        if (ownerId !== userId) {
          try {
            await bot.telegram.sendMessage(ownerId,
              `👑 *الأونر سجل دخوله!*\n🆔 \`${userId}\`\n👤 الاسم: ${text}`,
              { parse_mode: 'Markdown' }
            );
          } catch (e) {}
        }
      }
      session.step = null;
      return safeReply(ctx,
        `✅ *تم تسجيل اسمك: ${text}*\n🚀 لوحة التحكم جاهزة!`,
        { parse_mode: 'Markdown', ...mainMenu(role) }
      );
    }

    // ── إلغاء ──
    if (text === '❌ إلغاء') {
      session.step = null;
      return safeReply(ctx, "↩️ تم الإلغاء.", mainMenu(role));
    }

    // ── 1. كود شهر بفلوس ──
    if (text === '📅 كود شهر بفلوس') {
      session.step = 'WAIT_NAME_PAID';
      return safeReply(ctx, "✍️ أرسل اسم الطالب (كود مدفوع):", {
        reply_markup: { keyboard: [['❌ إلغاء']], resize_keyboard: true }
      });
    }
    if (step === 'WAIT_NAME_PAID') {
      const code = generateCode();
      const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
      const creatorName = await getUserName(userId);
      await withTimeout(db.ref(`students/${code}`).set({
        name: text, expiry, hwid: null, banned: false,
        creator: userId, creatorName, createdAt: Date.now(), free: false
      }));
      session.step = null;
      return safeReply(ctx,
        `✅ *كود شهر بفلوس جاهز!*\n\n👤 الاسم: ${text}\n🔑 الكود: \`${code}\`\n📅 ينتهي: ${formatDate(expiry)}\n💰 بيتحسب في الأرباح`,
        { parse_mode: 'Markdown', ...mainMenu(role) }
      );
    }

    // ── 1b. كود شهر مجاني ──
    if (text === '🎁 كود شهر مجاني') {
      session.step = 'WAIT_NAME_FREE';
      return safeReply(ctx, "✍️ أرسل اسم الطالب (كود مجاني):", {
        reply_markup: { keyboard: [['❌ إلغاء']], resize_keyboard: true }
      });
    }
    if (step === 'WAIT_NAME_FREE') {
      const code = generateCode();
      const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
      const creatorName = await getUserName(userId);
      await withTimeout(db.ref(`students/${code}`).set({
        name: text, expiry, hwid: null, banned: false,
        creator: userId, creatorName, createdAt: Date.now(), free: true
      }));
      session.step = null;
      return safeReply(ctx,
        `🎁 *كود شهر مجاني جاهز!*\n\n👤 الاسم: ${text}\n🔑 الكود: \`${code}\`\n📅 ينتهي: ${formatDate(expiry)}\n🎁 مش بيتحسب في الأرباح`,
        { parse_mode: 'Markdown', ...mainMenu(role) }
      );
    }

    // ── 2. تجربة ساعة ──
    if (text === '⏳ تجربة ساعة') {
      const code = generateCode();
      const expiry = Date.now() + 60 * 60 * 1000;
      const creatorName = await getUserName(userId);
      await withTimeout(db.ref(`students/${code}`).set({
        name: "تجربة", expiry, hwid: null, banned: false,
        creator: userId, creatorName, createdAt: Date.now()
      }));
      return safeReply(ctx,
        `⏳ *كود تجربة جاهز!*\n🔑 الكود: \`${code}\`\n⏰ صالح لمدة ساعة`,
        { parse_mode: 'Markdown', ...mainMenu(role) }
      );
    }

    // ── 3. تغيير الجهاز ──
    if (text === '📱 تغيير الجهاز') {
      session.step = 'WAIT_RESET';
      return safeReply(ctx, "🔢 أرسل كود الطالب لتصفير جهازه:", {
        reply_markup: { keyboard: [['❌ إلغاء']], resize_keyboard: true }
      });
    }
    if (step === 'WAIT_RESET') {
      const snap = await withTimeout(db.ref(`students/${text}`).once('value'));
      if (!snap.exists()) return safeReply(ctx, "❌ الكود غير موجود! تحقق منه.");
      await withTimeout(db.ref(`students/${text}`).update({ hwid: null }));
      session.step = null;
      return safeReply(ctx,
        `✅ *تم فك ارتباط الجهاز*\n👤 ${snap.val().name} يمكنه الدخول من جهاز جديد.`,
        { parse_mode: 'Markdown', ...mainMenu(role) }
      );
    }

    // ── 4. تجديد اشتراك ──
    if (text === '🔄 تجديد اشتراك') {
      session.step = 'WAIT_RENEW';
      return safeReply(ctx, "🔢 أرسل كود الطالب للتجديد (شهر إضافي):", {
        reply_markup: { keyboard: [['❌ إلغاء']], resize_keyboard: true }
      });
    }
    if (step === 'WAIT_RENEW') {
      const ref = db.ref(`students/${text}`);
      const snap = await withTimeout(ref.once('value'));
      if (!snap.exists()) return safeReply(ctx, "❌ الكود غير موجود! تحقق منه.");
      const data = snap.val();
      const newExpiry = Math.max(data.expiry, Date.now()) + 30 * 24 * 60 * 60 * 1000;
      await withTimeout(ref.update({ expiry: newExpiry }));
      session.step = null;
      return safeReply(ctx,
        `✅ *تم التجديد!*\n👤 ${data.name}\n📅 ينتهي: ${formatDate(newExpiry)}`,
        { parse_mode: 'Markdown', ...mainMenu(role) }
      );
    }

    // ── 5. إحصائياتي ──
    if (text === '📊 إحصائياتي') {
      const snap = await withTimeout(db.ref('students').once('value'));
      let total = 0, active = 0, expired = 0, banned = 0;
      const now = Date.now();
      snap.forEach(child => {
        const d = child.val();
        if (String(d.creator) !== String(userId)) return;
        total++;
        if (d.banned) banned++;
        else if (d.expiry > now) active++;
        else expired++;
      });
      return safeReply(ctx,
        `📊 *إحصائياتك:*\n\n🔢 الإجمالي: ${total}\n✅ نشطين: ${active}\n⌛ منتهي: ${expired}\n🚫 محظورين: ${banned}`,
        { parse_mode: 'Markdown' }
      );
    }

    // ── 6. أرباحي ──
    if (text === '💰 أرباحي') {
      const snap = await withTimeout(db.ref('students').once('value'));
      let paid = 0, free = 0;
      snap.forEach(child => {
        const d = child.val();
        if (String(d.creator) === String(userId)) {
          if (d.free) free++;
          else paid++;
        }
      });
      const money = paid * CODE_PRICE;
      return safeReply(ctx,
        `💰 *أرباحك:*\n\n💳 أكواد بفلوس: ${paid}\n🎁 أكواد مجانية: ${free}\n💵 إجمالي الأرباح: ${money} ج`,
        { parse_mode: 'Markdown' }
      );
    }

    // ── 7. أكوادي ──
    if (text === '📋 أكوادي') {
      const snap = await withTimeout(db.ref('students').once('value'));
      const now = Date.now();
      let results = [];
      snap.forEach(child => {
        const d = child.val();
        if (String(d.creator) !== String(userId)) return;
        const status = d.banned ? '🚫' : d.expiry > now ? '✅' : '⌛';
        results.push(`${status} *${d.name}*\n🔑 \`${child.key}\`\n📅 ${formatDate(d.expiry)}`);
      });
      if (!results.length) return safeReply(ctx, "📋 مفيش أكواد لحد دلوقتي.");
      for (let i = 0; i < results.length; i += 10) {
        const chunk = results.slice(i, i + 10).join('\n─────────\n');
        await safeReply(ctx, chunk, { parse_mode: 'Markdown' });
      }
      return safeReply(ctx, `📋 إجمالي: ${results.length} كود`, mainMenu(role));
    }

    // ── 8. أكواد قاربت تنتهي ──
    if (text === '⏰ أكواد قاربت تنتهي') {
      const snap = await withTimeout(db.ref('students').once('value'));
      const now = Date.now();
      const week = 7 * 24 * 60 * 60 * 1000;
      let results = [];
      snap.forEach(child => {
        const d = child.val();
        if (String(d.creator) !== String(userId)) return;
        if (!d.banned && d.expiry > now && d.expiry - now <= week) {
          const daysLeft = Math.ceil((d.expiry - now) / (24 * 60 * 60 * 1000));
          results.push(`⚠️ *${d.name}*\n🔑 \`${child.key}\`\n⏳ باقي ${daysLeft} يوم`);
        }
      });
      if (!results.length) return safeReply(ctx, "✅ مفيش أكواد هتنتهي خلال أسبوع.");
      for (const r of results) await safeReply(ctx, r, { parse_mode: 'Markdown' });
      return safeReply(ctx, `⚠️ ${results.length} كود هينتهي خلال أسبوع`, mainMenu(role));
    }

    // ── 9. بحث عن طالب (OWNER) ──
    if (text === '🔍 بحث عن طالب') {
      if (role !== 'OWNER') return safeReply(ctx, "❌ للمالك فقط.");
      session.step = 'WAIT_SEARCH';
      return safeReply(ctx, "🔎 أرسل كود أو اسم الطالب:", {
        reply_markup: { keyboard: [['❌ إلغاء']], resize_keyboard: true }
      });
    }
    if (step === 'WAIT_SEARCH') {
      const snap = await withTimeout(db.ref('students').once('value'));
      const now = Date.now();
      let results = [];
      snap.forEach(child => {
        const d = child.val();
        if (!d) return;
        const nameMatch = d.name && d.name.includes(text);
        const codeMatch = child.key === text;
        if (nameMatch || codeMatch) {
          const status = d.banned ? '🚫 محظور' : d.expiry > now ? '✅ نشط' : '⌛ منتهي';
          const creatorLabel = d.creatorName || d.creator;
          results.push(`👤 *${d.name}*\n🔑 \`${child.key}\`\n📅 ${formatDate(d.expiry)} | ${status}\n🧑‍💼 طلعه: ${creatorLabel}`);
        }
      });
      session.step = null;
      if (!results.length) return safeReply(ctx, "❌ لا نتائج.", mainMenu(role));
      for (const r of results) await safeReply(ctx, r, { parse_mode: 'Markdown' });
      return safeReply(ctx, `✅ ${results.length} نتيجة.`, mainMenu(role));
    }

    // ── 10. حظر/فك حظر طالب (OWNER) ──
    if (text === '🚫 حظر/فك حظر طالب') {
      if (role !== 'OWNER') return safeReply(ctx, "❌ للمالك فقط.");
      session.step = 'WAIT_BAN';
      return safeReply(ctx, "🔢 أرسل كود الطالب لتغيير حالة الحظر:", {
        reply_markup: { keyboard: [['❌ إلغاء']], resize_keyboard: true }
      });
    }
    if (step === 'WAIT_BAN') {
      const ref = db.ref(`students/${text}`);
      const snap = await withTimeout(ref.once('value'));
      if (!snap.exists()) return safeReply(ctx, "❌ الكود غير موجود!");
      const data = snap.val();
      const newBanned = !data.banned;
      await withTimeout(ref.update({ banned: newBanned }));
      session.step = null;
      return safeReply(ctx,
        `${newBanned ? '🚫 تم حظر' : '✅ تم فك حظر'} الطالب *${data.name}*.`,
        { parse_mode: 'Markdown', ...mainMenu(role) }
      );
    }

    // ── 11. إضافة موظف باسم (OWNER) ──
    if (text === '➕ إضافة موظف') {
      if (role !== 'OWNER') return safeReply(ctx, "❌ للمالك فقط.");
      session.step = 'WAIT_STAFF_ID';
      return safeReply(ctx, "🆔 أرسل الـ ID الخاص بالموظف:", {
        reply_markup: { keyboard: [['❌ إلغاء']], resize_keyboard: true }
      });
    }
    if (step === 'WAIT_STAFF_ID') {
      const staffId = parseInt(text);
      if (isNaN(staffId)) return safeReply(ctx, "❌ أرسل ID رقمي صحيح.");
      session.newStaffId = staffId;
      session.step = 'WAIT_STAFF_NAME';
      return safeReply(ctx, `✅ ID: \`${staffId}\`\nدلوقتي أرسل اسم الموظف:`, {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: [['❌ إلغاء']], resize_keyboard: true }
      });
    }
    if (step === 'WAIT_STAFF_NAME') {
      const staffId = session.newStaffId;
      await withTimeout(db.ref(`staff/${staffId}`).set({
        name: text, addedBy: userId, addedAt: Date.now(), banned: false
      }));
      await withTimeout(db.ref(`users/${staffId}`).set({ name: text, role: 'STAFF' }));
      session.step = null;
      session.newStaffId = null;
      for (const ownerId of OWNERS) {
        if (ownerId !== userId) {
          try {
            await bot.telegram.sendMessage(ownerId,
              `🔔 *موظف جديد أضيف!*\n🆔 \`${staffId}\`\n👤 ${text}`,
              { parse_mode: 'Markdown' }
            );
          } catch (e) {}
        }
      }
      return safeReply(ctx,
        `✅ تم إضافة الموظف *${text}* بنجاح!\n🆔 \`${staffId}\``,
        { parse_mode: 'Markdown', ...mainMenu(role) }
      );
    }

    // ── 12. حذف موظف (OWNER) ──
    if (text === '🗑️ حذف موظف') {
      if (role !== 'OWNER') return safeReply(ctx, "❌ للمالك فقط.");
      session.step = 'WAIT_DELETE_STAFF';
      return safeReply(ctx, "🆔 أرسل ID الموظف اللي عايز تحذفه:", {
        reply_markup: { keyboard: [['❌ إلغاء']], resize_keyboard: true }
      });
    }
    if (step === 'WAIT_DELETE_STAFF') {
      const staffId = parseInt(text);
      if (isNaN(staffId)) return safeReply(ctx, "❌ أرسل ID رقمي صحيح.");
      const snap = await withTimeout(db.ref(`staff/${staffId}`).once('value'));
      if (!snap.exists()) return safeReply(ctx, "❌ الموظف مش موجود!");
      const staffName = snap.val().name || staffId;
      await withTimeout(db.ref(`staff/${staffId}`).remove());
      session.step = null;
      return safeReply(ctx,
        `🗑️ تم حذف الموظف *${staffName}* بنجاح.`,
        { parse_mode: 'Markdown', ...mainMenu(role) }
      );
    }

    // ── 13. حظر موظف (OWNER) ──
    if (text === '🔒 حظر موظف') {
      if (role !== 'OWNER') return safeReply(ctx, "❌ للمالك فقط.");
      session.step = 'WAIT_BAN_STAFF';
      return safeReply(ctx, "🆔 أرسل ID الموظف لتغيير حالة حظره:", {
        reply_markup: { keyboard: [['❌ إلغاء']], resize_keyboard: true }
      });
    }
    if (step === 'WAIT_BAN_STAFF') {
      const staffId = parseInt(text);
      if (isNaN(staffId)) return safeReply(ctx, "❌ أرسل ID رقمي صحيح.");
      const ref = db.ref(`staff/${staffId}`);
      const snap = await withTimeout(ref.once('value'));
      if (!snap.exists()) return safeReply(ctx, "❌ الموظف مش موجود!");
      const data = snap.val();
      const newBanned = !data.banned;
      await withTimeout(ref.update({ banned: newBanned }));
      session.step = null;
      const staffName = data.name || staffId;
      return safeReply(ctx,
        `${newBanned ? '🔒 تم حظر' : '🔓 تم فك حظر'} الموظف *${staffName}*.`,
        { parse_mode: 'Markdown', ...mainMenu(role) }
      );
    }

    // ── 14. أرباح الفريق (OWNER) ──
    if (text === '💵 أرباح الفريق') {
      if (role !== 'OWNER') return safeReply(ctx, "❌ للمالك فقط.");
      const [studSnap, staffSnap] = await Promise.all([
        withTimeout(db.ref('students').once('value')),
        withTimeout(db.ref('staff').once('value')),
      ]);
      const creatorMap = {};
      const freeMap = {};
      const firstCode = {};
      const lastCode = {};
      studSnap.forEach(child => {
        const d = child.val();
        const c = String(d.creator);
        if (d.free) {
          if (!freeMap[c]) freeMap[c] = 0;
          freeMap[c]++;
        } else {
          if (!creatorMap[c]) creatorMap[c] = 0;
          creatorMap[c]++;
        }
        if (!firstCode[c] || d.createdAt < firstCode[c]) firstCode[c] = d.createdAt;
        if (!lastCode[c] || d.createdAt > lastCode[c]) lastCode[c] = d.createdAt;
      });

      let msg = `💵 *أرباح الفريق:*\n\n`;

      for (const ownerId of OWNERS) {
        const id = String(ownerId);
        const count = creatorMap[id] || 0;
        const freeCount = freeMap[id] || 0;
        const money = count * CODE_PRICE;
        const name = await getUserName(ownerId);
        const first = firstCode[id] ? formatDate(firstCode[id]) : '—';
        const last = lastCode[id] ? formatDate(lastCode[id]) : '—';
        msg += `👑 *${name}* (أونر)\n   💳 ${count} مدفوع | 🎁 ${freeCount} مجاني | 💵 ${money} ج\n   📅 أول: ${first} | آخر: ${last}\n\n`;
      }

      staffSnap.forEach(child => {
        const staffId = child.key;
        const staffData = child.val();
        const count = creatorMap[staffId] || 0;
        const freeCount = freeMap[staffId] || 0;
        const money = count * CODE_PRICE;
        const name = staffData.name || staffId;
        const banned = staffData.banned ? ' 🔒' : '';
        const first = firstCode[staffId] ? formatDate(firstCode[staffId]) : '—';
        const last = lastCode[staffId] ? formatDate(lastCode[staffId]) : '—';
        msg += `🧑‍💼 *${name}*${banned}\n   💳 ${count} مدفوع | 🎁 ${freeCount} مجاني | 💵 ${money} ج\n   📅 أول: ${first} | آخر: ${last}\n\n`;
      });

      const totalCodes = Object.values(creatorMap).reduce((a, b) => a + b, 0);
      const totalMoney = totalCodes * CODE_PRICE;
      msg += `─────────────────\n📊 الإجمالي: ${totalCodes} مدفوع | 💵 ${totalMoney} ج`;

      return safeReply(ctx, msg, { parse_mode: 'Markdown', ...mainMenu(role) });
    }

    // ── 15. قائمة الأونرز (OWNER) ──
    if (text === '👥 قائمة الأونرز') {
      if (role !== 'OWNER') return safeReply(ctx, "❌ للمالك فقط.");
      let msg = `👑 *الأونرز:*\n\n`;
      for (const ownerId of OWNERS) {
        const name = await getUserName(ownerId);
        msg += `👑 *${name}*\n🆔 \`${ownerId}\`\n\n`;
      }
      return safeReply(ctx, msg, { parse_mode: 'Markdown' });
    }

    // ── 16. إحصائيات عامة (OWNER) ──
    if (text === '📈 إحصائيات عامة') {
      if (role !== 'OWNER') return safeReply(ctx, "❌ للمالك فقط.");
      const [studSnap, staffSnap] = await Promise.all([
        withTimeout(db.ref('students').once('value')),
        withTimeout(db.ref('staff').once('value')),
      ]);
      const now = Date.now();
      let total = 0, active = 0, expired = 0, banned = 0;
      studSnap.forEach(child => {
        const d = child.val();
        total++;
        if (d.banned) banned++;
        else if (d.expiry > now) active++;
        else expired++;
      });
      return safeReply(ctx,
        `📈 *إحصائيات المنصة:*\n\n👥 الطلاب: ${total}\n✅ نشطين: ${active}\n⌛ منتهي: ${expired}\n🚫 محظورين: ${banned}\n\n🧑‍💼 الموظفون: ${staffSnap.numChildren()}`,
        { parse_mode: 'Markdown' }
      );
    }

    // ── 17. تصدير الطلاب (OWNER) ──
    if (text === '📤 تصدير الطلاب') {
      if (role !== 'OWNER') return safeReply(ctx, "❌ للمالك فقط.");
      const snap = await withTimeout(db.ref('students').once('value'));
      const now = Date.now();
      let csv = 'الاسم,الكود,الانتهاء,الحالة,طلعه\n';
      snap.forEach(child => {
        const d = child.val();
        const status = d.banned ? 'محظور' : d.expiry > now ? 'نشط' : 'منتهي';
        const creator = d.creatorName || d.creator;
        csv += `${d.name},${child.key},${formatDate(d.expiry)},${status},${creator}\n`;
      });
      const buffer = Buffer.from(csv, 'utf-8');
      await ctx.replyWithDocument(
        { source: buffer, filename: `fullmark_students_${Date.now()}.csv` },
        { caption: '📤 قائمة الطلاب الكاملة' }
      );
      return safeReply(ctx, "✅ تم التصدير.", mainMenu(role));
    }

  } catch (err) {
    console.error('Handler error:', err.message);
    session.step = null;
    return safeReply(ctx, "⚠️ حدث خطأ، حاول مرة ثانية.", mainMenu(role));
  }
});

// ─────────────────────────────────────────
//  Vercel Handler
// ─────────────────────────────────────────
module.exports = async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const path = req.url?.split('?')[0];

    if (path === '/generate-device-id' && req.method === 'GET') {
      const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
      return res.status(200).json({ device_id: id });
    }

    if (path === '/verify' && req.method === 'POST') {
      const { activation_code, device_id } = req.body;
      if (!activation_code || !device_id)
        return res.status(400).json({ detail: "بيانات ناقصة" });

      const snap = await withTimeout(db.ref(`students/${activation_code}`).once('value'));
      if (!snap.exists())
        return res.status(400).json({ detail: "❌ الكود غير موجود" });

      const data = snap.val();
      const now = Date.now();

      if (data.banned)
        return res.status(400).json({ detail: "🚫 هذا الكود محظور" });
      if (data.expiry < now)
        return res.status(400).json({ detail: "⌛ الكود منتهي الصلاحية" });

      if (!data.hwid) {
        await withTimeout(db.ref(`students/${activation_code}`).update({ hwid: device_id }));
      } else if (data.hwid !== device_id) {
        return res.status(400).json({ detail: "📱 الكود مرتبط بجهاز آخر" });
      }

      return res.status(200).json({
        status: "success",
        user_data: { name: data.name, expiry: data.expiry }
      });
    }

    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
      return res.status(200).send('OK');
    }

    res.status(200).send('🤖 FullMark Bot is running!');

  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(200).send('OK');
  }
};
