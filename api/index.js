const { Telegraf, session } = require('telegraf');
const admin = require('firebase-admin');

// إعداد Firebase Admin (استخدم بياناتك من ملف الـ JSON اللي بتحمله من Firebase)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "fullmark-neweddition",
      clientEmail: "firebase-adminsdk-xxxxx@fullmark-neweddition.iam.gserviceaccount.com", // هاته من فايربيز
      privateKey: "-----BEGIN PRIVATE KEY-----\nYourKeyHere\n-----END PRIVATE KEY-----".replace(/\\n/g, '\n')
    }),
    databaseURL: "https://fullmark-neweddition-default-rtdb.europe-west1.firebasedatabase.app"
  });
}

const db = admin.database();
const bot = new Telegraf('8473800828:AAFTTHHoUb_ccXc0FOJb6y6DLzBCSAKoxH8');
const OWNERS = [1778665778, 6188310641];

bot.use(session());

// دالة توليد كود 9 أرقام
const generateCode = () => Math.floor(100000000 + Math.random() * 900000000).toString();

// Middleware التحقق من الصلاحيات
const checkAuth = async (ctx, next) => {
  const userId = ctx.from.id;
  if (OWNERS.includes(userId)) { ctx.state.role = 'OWNER'; return next(); }
  const staff = await db.ref(`staff/${userId}`).once('value');
  if (staff.exists()) { ctx.state.role = 'STAFF'; return next(); }
  return ctx.reply("❌ غير مسموح لك بالدخول.");
};

// القائمة الرئيسية
bot.start(checkAuth, (ctx) => {
  const role = ctx.state.role;
  let buttons = [['👤 تفعيل طالب', '⏳ تجربة ساعة'], ['🔄 تجديد اشتراك', '📱 تغيير الجهاز'], ['📊 إحصائياتي']];
  if (role === 'OWNER') {
    buttons.push(['🔍 بحث عن طالب', '🚫 حظر/فك حظر']);
    buttons.push(['➕ إضافة موظف', '📈 إحصائيات عامة']);
  }
  ctx.reply("🚀 لوحة تحكم المنصة جاهزة:", { reply_markup: { keyboard: buttons, resize_keyboard: true } });
});

// التعامل مع النصوص والعمليات
bot.on('text', checkAuth, async (ctx) => {
  const text = ctx.text;
  const step = ctx.session.step;

  // 1. تفعيل طالب
  if (text === '👤 تفعيل طالب') {
    ctx.session.step = 'WAIT_NAME';
    return ctx.reply("✍️ أرسل اسم الطالب:");
  }
  if (step === 'WAIT_NAME') {
    const code = generateCode();
    await db.ref(`students/${code}`).set({
      name: text, expiry: Date.now() + (30 * 24 * 60 * 60 * 1000),
      hwid: null, banned: false, creator: ctx.from.id
    });
    ctx.session.step = null;
    return ctx.reply(`✅ تم! اسم الطالب: ${text}\n🔑 الكود: ${code}`);
  }

  // 2. تجربة ساعة
  if (text === '⏳ تجربة ساعة') {
    const code = generateCode();
    await db.ref(`students/${code}`).set({
      name: "تجربة ساعة", expiry: Date.now() + (60 * 60 * 1000),
      hwid: null, banned: false, creator: ctx.from.id
    });
    return ctx.reply(`⏳ كود تجربة ساعة جاهز:\n🔑 الكود: ${code}`);
  }

  // 3. تغيير الجهاز
  if (text === '📱 تغيير الجهاز') {
    ctx.session.step = 'WAIT_RESET';
    return ctx.reply("🔢 أرسل الكود لتصفير جهازه:");
  }
  if (step === 'WAIT_RESET') {
    const ref = db.ref(`students/${text}`);
    const snap = await ref.once('value');
    if (snap.exists()) {
      await ref.update({ hwid: null });
      ctx.session.step = null;
      return ctx.reply("✅ تم فك ارتباط الجهاز. يمكنه الدخول من جهاز آخر.");
    }
  }

  // 4. إضافة موظف (OWNER فقط)
  if (text === '➕ إضافة موظف' && ctx.state.role === 'OWNER') {
    ctx.session.step = 'WAIT_STAFF';
    return ctx.reply("🆔 أرسل الـ ID الخاص بالملاحظ:");
  }
  if (step === 'WAIT_STAFF') {
    await db.ref(`staff/${text}`).set({ addedBy: ctx.from.id });
    ctx.session.step = null;
    return ctx.reply("✅ تم إضافة الموظف بنجاح.");
  }

  // 5. تجديد اشتراك
  if (text === '🔄 تجديد اشتراك') {
    ctx.session.step = 'WAIT_RENEW';
    return ctx.reply("🔢 أرسل كود الطالب للتجديد شهر:");
  }
  if (step === 'WAIT_RENEW') {
    const ref = db.ref(`students/${text}`);
    const snap = await ref.once('value');
    if (snap.exists()) {
      const newExpiry = Math.max(snap.val().expiry, Date.now()) + (30 * 24 * 60 * 60 * 1000);
      await ref.update({ expiry: newExpiry });
      ctx.session.step = null;
      return ctx.reply("✅ تم تجديد الاشتراك لمدة شهر إضافي.");
    }
  }

  // 6. بحث عن طالب (OWNER فقط)
  if (text === '🔍 بحث عن طالب' && ctx.state.role === 'OWNER') {
    ctx.session.step = 'WAIT_SEARCH';
    return ctx.reply("🔎 أرسل الكود أو الاسم للبحث:");
  }
  if (step === 'WAIT_SEARCH') {
    const snap = await db.ref('students').once('value');
    let found = false;
    snap.forEach(child => {
      const data = child.val();
      if (child.key === text || data.name.includes(text)) {
        ctx.reply(`📊 بيانات الطالب:\nالاسم: ${data.name}\nالكود: ${child.key}\nالحالة: ${data.banned ? 'محظور 🚫' : 'نشط ✅'}`);
        found = true;
      }
    });
    if (!found) ctx.reply("❌ لم يتم العثور على نتائج.");
    ctx.session.step = null;
  }
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } else {
    res.status(200).send('Bot is running...');
  }
};
