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

// ─────────────────────────────────────────
//  Session تشتغل على Vercel Serverless
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

// ─────────────────────────────────────────
//  Middleware التحقق
// ─────────────────────────────────────────
const checkAuth = async (ctx, next) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;
    if (OWNERS.includes(userId)) { ctx.state.role = 'OWNER'; return next(); }
    const staff = await withTimeout(db.ref(`staff/${userId}`).once('value'));
    if (staff.exists()) { ctx.state.role = 'STAFF'; return next(); }
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
    ['👤 تفعيل طالب', '⏳ تجربة ساعة'],
    ['🔄 تجديد اشتراك', '📱 تغيير الجهاز'],
    ['📊 إحصائياتي'],
  ];
  if (role === 'OWNER') {
    buttons.push(['🔍 بحث عن طالب', '🚫 حظر/فك حظر']);
    buttons.push(['➕ إضافة موظف', '📈 إحصائيات عامة']);
  }
  return { reply_markup: { keyboard: buttons, resize_keyboard: true } };
};

// ─────────────────────────────────────────
//  /start
// ─────────────────────────────────────────
bot.start(checkAuth, (ctx) => {
  getSession(ctx.from.id).step = null;
  return safeReply(ctx,
    `🎓 *أهلاً ${ctx.from.first_name}!*\n🚀 لوحة تحكم FullMark جاهزة.`,
    { parse_mode: 'Markdown', ...mainMenu(ctx.state.role) }
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

    // ── إلغاء ──
    if (text === '❌ إلغاء') {
      session.step = null;
      return safeReply(ctx, "↩️ تم الإلغاء.", mainMenu(role));
    }

    // ── 1. تفعيل طالب ──
    if (text === '👤 تفعيل طالب') {
      session.step = 'WAIT_NAME';
      return safeReply(ctx, "✍️ أرسل اسم الطالب:", {
        reply_markup: { keyboard: [['❌ إلغاء']], resize_keyboard: true }
      });
    }
    if (step === 'WAIT_NAME') {
      const code = generateCode();
      const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
      await withTimeout(db.ref(`students/${code}`).set({
        name: text, expiry, hwid: null, banned: false, creator: userId, createdAt: Date.now()
      }));
      session.step = null;
      return safeReply(ctx,
        `✅ *تم تفعيل الطالب!*\n\n👤 الاسم: ${text}\n🔑 الكود: \`${code}\`\n📅 ينتهي: ${formatDate(expiry)}`,
        { parse_mode: 'Markdown', ...mainMenu(role) }
      );
    }

    // ── 2. تجربة ساعة ──
    if (text === '⏳ تجربة ساعة') {
      const code = generateCode();
      const expiry = Date.now() + 60 * 60 * 1000;
      await withTimeout(db.ref(`students/${code}`).set({
        name: "تجربة", expiry, hwid: null, banned: false, creator: userId, createdAt: Date.now()
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

    // ── 6. بحث عن طالب (OWNER) ──
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
          results.push(`👤 *${d.name}*\n🔑 \`${child.key}\`\n📅 ${formatDate(d.expiry)} | ${status}`);
        }
      });
      session.step = null;
      if (!results.length) return safeReply(ctx, "❌ لا نتائج.", mainMenu(role));
      for (const r of results) await safeReply(ctx, r, { parse_mode: 'Markdown' });
      return safeReply(ctx, `✅ ${results.length} نتيجة.`, mainMenu(role));
    }

    // ── 7. حظر / فك حظر (OWNER) ──
    if (text === '🚫 حظر/فك حظر') {
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

    // ── 8. إضافة موظف (OWNER) ──
    if (text === '➕ إضافة موظف') {
      if (role !== 'OWNER') return safeReply(ctx, "❌ للمالك فقط.");
      session.step = 'WAIT_STAFF';
      return safeReply(ctx, "🆔 أرسل الـ ID الخاص بالموظف:", {
        reply_markup: { keyboard: [['❌ إلغاء']], resize_keyboard: true }
      });
    }
    if (step === 'WAIT_STAFF') {
      const staffId = parseInt(text);
      if (isNaN(staffId)) return safeReply(ctx, "❌ أرسل ID رقمي صحيح.");
      await withTimeout(db.ref(`staff/${staffId}`).set({ addedBy: userId, addedAt: Date.now() }));
      session.step = null;
      return safeReply(ctx, `✅ تم إضافة الموظف \`${staffId}\` بنجاح.`,
        { parse_mode: 'Markdown', ...mainMenu(role) }
      );
    }

    // ── 9. إحصائيات عامة (OWNER) ──
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
    // ── CORS ──
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const path = req.url?.split('?')[0];

    // ── /generate-device-id ──
    if (path === '/generate-device-id' && req.method === 'GET') {
      const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
      return res.status(200).json({ device_id: id });
    }

    // ── /verify ──
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

    // ── Telegram Webhook ──
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
