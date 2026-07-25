const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const { RockPaperScissors } = require('discord-gamecord');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('error', (error) => { console.error(error); });
process.on('unhandledRejection', (error) => { console.error(error); });
process.on('uncaughtException', (error) => { console.error(error); });

// ==========================================
// 30 عنصر لكل لعبة (كلمات، جمل، وأسئلة)
// ==========================================
const fakkData = [
    { word: "مكتبة", spaced: "م ك ت ب ة" }, { word: "حاسوب", spaced: "ح ا س و ب" }, 
    { word: "مدرسة", spaced: "م د ر س ة" }, { word: "برمجة", spaced: "ب ر م ج ة" }, 
    { word: "الرياض", spaced: "ا ل ر ي ا ض" }, { word: "ديسكورد", spaced: "د ي س ك و ر د" }, 
    { word: "جامعة", spaced: "ج ا م ع ة" }, { word: "طائرة", spaced: "ط ا ئ ر ة" }, 
    { word: "سيارة", spaced: "س ي ا ر ة" }, { word: "كمبيوتر", spaced: "ك م ب ي و ت ر" },
    { word: "تلفاز", spaced: "ت ل ف ا ز" }, { word: "مستشفى", spaced: "م س ت ش ف ى" },
    { word: "حديقة", spaced: "ح د ي ق ة" }, { word: "مهندس", spaced: "م ه ن د س" },
    { word: "طبیب", spaced: "ط ب ي ب" }, { word: "محفظة", spaced: "م ح ف ظ ة" },
    { word: "مظلة", spaced: "م ظ ل ة" }, { word: "نافذة", spaced: "ن ا ف ذ ة" },
    { word: "ثلاجة", spaced: "ث ل ا ج ة" }, { word: "مفتاح", spaced: "م ف ت ا ح" },
    { word: "سحاب", spaced: "س ح ا ب" }, { word: "شجرة", spaced: "ش ج ر ة" },
    { word: "طاولة", spaced: "ط ا و ل ة" }, { word: "قلم", spaced: "ق ل م" },
    { word: "كتاب", spaced: "ك ت ا ب" }, { word: "محاية", spaced: "م ح ا ي ة" },
    { word: "مسطرة", spaced: "م س ط ر ة" }, { word: "دفتر", spaced: "د ف ت ر" },
    { word: "حقيبة", spaced: "ح ق ي ب ة" }, { word: "ساعة", spaced: "س ا ع ة" }
];

const rakibData = [
    { scrambled: "س م ك", correct: "سمك" }, { scrambled: "ق م ر", correct: "قمر" }, 
    { scrambled: "ش م ش", correct: "شمس" }, { scrambled: "ق ل م", correct: "قلم" }, 
    { scrambled: "ب ح ر", correct: "بحر" }, { scrambled: "و ر د", correct: "ورد" }, 
    { scrambled: "ن ج م", correct: "نجم" }, { scrambled: "ت ف ح", correct: "تفاح" },
    { scrambled: "ل ب ن", correct: "لبن" }, { scrambled: "م ا ء", correct: "ماء" },
    { scrambled: "خ ب ز", correct: "خبز" }, { scrambled: "ل ح م", correct: "لحم" },
    { scrambled: "ب ب غ", correct: "ببغاء" }, { scrambled: "أ س د", correct: "أسد" },
    { scrambled: "ن م ر", correct: "نمر" }, { scrambled: "في ل", correct: "فيل" },
    { scrambled: "ق ط", correct: "قط" }, { scrambled: "ك ل ب", correct: "كلب" },
    { scrambled: "ذ ي ب", correct: "ذئب" }, { scrambled: "ث ع ل", correct: "ثعلب" },
    { scrambled: "غ ز ل", correct: "غزال" }, { scrambled: "ز ر ف", correct: "زرافة" },
    { scrambled: "ق ر د", correct: "قرد" }, { scrambled: "د ب", correct: "دب" },
    { scrambled: "ص ق ر", correct: "صقر" }, { scrambled: "ن ص ر", correct: "نسر" },
    { scrambled: "ح م ا", correct: "حمام" }, { scrambled: "ب ط", correct: "بطة" },
    { scrambled: "د ج ج", correct: "دجاجة" }, { scrambled: "خ ر ف", correct: "خروف" }
];

const triviaData = [
    { question: "ما هي عاصمة المملكة العربية السعودية؟", correct: "الرياض", options: ["جدة", "الرياض", "الدمام", "مكة"] },
    { question: "ما هي عاصمة الإمارات العربية المتحدة؟", correct: "أبوظبي", options: ["دبي", "أبوظبي", "الشارقة", "عجمان"] },
    { question: "كم عدد سور القرآن الكريم؟", correct: "114", options: ["112", "113", "114", "115"] },
    { question: "ما هي عاصمة الكويت؟", correct: "الكويت", options: ["الجهراء", "الكويت", "المباركية", "حولي"] },
    { question: "ما هي عاصمة مصر؟", correct: "القاهرة", options: ["الإسكندرية", "القاهرة", "الجيزة", "أسوان"] },
    { question: "ما هي عاصمة الأردن؟", correct: "عمان", options: ["إربد", "عمان", "الطفيلة", "الزرقاء"] },
    { question: "ما هي عاصمة قطر؟", correct: "الدوحة", options: ["الدوحة", "الوكرة", "الخور", "الشحانية"] },
    { question: "ما هي عاصمة البحرين؟", correct: "المنامة", options: ["المحرق", "المنامة", "الرفاع", "السيح"] },
    { question: "ما هي عاصمة سلطنة عمان؟", correct: "مسقط", options: ["صلالة", "مسقط", "نزوى", "صحر"] },
    { question: "ما هي عاصمة العراق؟", correct: "بغداد", options: ["الموصل", "بغداد", "البصرة", "اربيل"] },
    { question: "ما هي عاصمة سوريا؟", correct: "دمشق", options: ["حلب", "دمشق", "حمص", "اللاذقية"] },
    { question: "ما هي عاصمة لبنان؟", correct: "بيروت", options: ["طرابلس", "بيروت", "صيدا", "صرفند"] },
    { question: "ما هي عاصمة فلسطين؟", correct: "القدس", options: ["رام الله", "القدس", "غزة", "نابلس"] },
    { question: "ما هي عاصمة الجزائر؟", correct: "الجزائر", options: ["وهران", "الجزائر", "قسنطينة", "عنابة"] },
    { question: "ما هي عاصمة المغرب؟", correct: "الرباط", options: ["الدار البيضاء", "الرباط", "مراكش", "فاس"] },
    { question: "ما هي عاصمة تونس؟", correct: "تونس", options: ["سوسة", "تونس", "صفاقس", "بنزرت"] },
    { question: "ما هي عاصمة ليبيا؟", correct: "طرابلس", options: ["بنغازي", "طرابلس", "مصراتة", "سبها"] },
    { question: "ما هي عاصمة السودان؟", correct: "خرطوم", options: ["الخرطوم", "بورتسودان", "أم درمان", "كسلا"] },
    { question: "ما هي عاصمة اليمن؟", correct: "صنعاء", options: ["عدن", "صنعاء", "تعز", "إب"] },
    { question: "أكبر كوكب في المجموعة الشمسية هو؟", correct: "المشتري", options: ["المريخ", "زحل", "المشتري", "الأرض"] },
    { question: "ما هو الكوكب الأحمر؟", correct: "المريخ", options: ["المريخ", "عطارد", "الزهرة", "نبتون"] },
    { question: "كم عدد أركان الإسلام؟", correct: "5", options: ["4", "5", "6", "3"] },
    { question: "كم عدد أركان الإيمان؟", correct: "6", options: ["5", "6", "7", "4"] },
    { question: "من هو النبي الذي ألقي في الحوت؟", correct: "يونس", options: ["موسى", "يونس", "إبراهيم", "يوسف"] },
    { question: "ما هي سورة القرآن التي تسمى قلب القرآن؟", correct: "يس", options: ["البقرة", "الملك", "يس", "الرحمن"] },
    { question: "أسرع حيوان بري في العالم هو؟", correct: "الفهد", options: ["الأسد", "الفهد", "الحصان", "الغزال"] },
    { question: "كم عدد قارات العالم؟", correct: "7", options: ["5", "6", "7", "8"] },
    { question: "ما هو الحيوان الذي يُسمى بأسف البحر؟", correct: "القرش", options: ["الحوت", "القرش", "الدرفيل", "الأخطبوط"] },
    { question: "في اي قارة تقع مصر؟", correct: "أفريقيا", options: ["آسيا", "أفريقيا", "أوروبا", "أستراليا"] },
    { question: "ما هو العنصر الكيميائي للذهب؟", correct: "Au", options: ["Ag", "Au", "Fe", "Cu"] }
];

const flagsGameData = [
    { country: "المملكة العربية السعودية", flag: "🇸🇦", options: ["المملكة العربية السعودية", "الإمارات العربية المتحدة", "الكويت", "قطر"] },
    { country: "الكويت", flag: "🇰🇼", options: ["الكويت", "البحرين", "عمان", "مصر"] },
    { country: "الإمارات العربية المتحدة", flag: "🇦🇪", options: ["قطر", "الإمارات العربية المتحدة", "السعودية", "اليمن"] },
    { country: "قطر", flag: "🇶🇦", options: ["قطر", "البحرين", "الكويت", "عمان"] },
    { country: "البحرين", flag: "🇧🇭", options: ["البحرين", "الأردن", "العراق", "لبنان"] },
    { country: "عمان", flag: "🇴🇲", options: ["عمان", "اليمن", "السعودية", "مصر"] },
    { country: "مصر", flag: "🇪🇬", options: ["مصر", "سوريا", "فلسطين", "ليبيا"] },
    { country: "العراق", flag: "🇮🇶", options: ["العراق", "الكويت", "الأردن", "إيران"] },
    { country: "الأردن", flag: "🇯🇴", options: ["الأردن", "سوريا", "لبنان", "فلسطين"] },
    { country: "فلسطين", flag: "🇵🇸", options: ["فلسطين", "الأردن", "مصر", "المغرب"] },
    { country: "لبنان", flag: "🇱🇧", options: ["لبنان", "سوريا", "قبرص", "اليونان"] },
    { country: "سوريا", flag: "🇸🇾", options: ["سوريا", "العراق", "مصر", "تركيا"] },
    { country: "المغرب", flag: "🇲🇦", options: ["المغرب", "الجزائر", "تونس", "موريتانيا"] },
    { country: "الجزائر", flag: "🇩🇿", options: ["الجزائر", "المغرب", "تونس", "ليبيا"] },
    { country: "تونس", flag: "🇹🇳", options: ["تونس", "ليبيا", "مصر", "الجزائر"] },
    { country: "ليبيا", flag: "🇱🇾", options: ["ليبيا", "السودان", "مصر", "تونس"] },
    { country: "السودان", flag: "🇸🇩", options: ["السودان", "مصر", "إثيوبيا", "تشاد"] },
    { country: "اليمن", flag: "🇾🇪", options: ["اليمن", "عمان", "السعودية", "الصومال"] },
    { country: "تركيا", flag: "🇹🇷", options: ["تركيا", "اليونان", "إيطاليا", "إسبانيا"] },
    { country: "إيطاليا", flag: "🇮🇹", options: ["إيطاليا", "فرنسا", "ألمانيا", "إسبانيا"] },
    { country: "فرنسا", flag: "🇫🇷", options: ["فرنسا", "بريطانيا", "إيطاليا", "بلجيكا"] },
    { country: "إسبانيا", flag: "🇪🇸", options: ["إسبانيا", "البرتغال", "فرنسا", "إيطاليا"] },
    { country: "ألمانيا", flag: "🇩🇪", options: ["ألمانيا", "النمسا", "سويسرا", "فرنسا"] },
    { country: "البرازيل", flag: "🇧🇷", options: ["البرازيل", "الأرجنتين", "كولومبيا", "تشيلي"] },
    { country: "الأرجنتين", flag: "🇦🇷", options: ["الأرجنتين", "البرازيل", "أوروغواي", "بيرو"] },
    { country: "الولايات المتحدة", flag: "🇺🇸", options: ["الولايات المتحدة", "كندا", "بريطانيا", "أستراليا"] },
    { country: "كندا", flag: "🇨🇦", options: ["كندا", "الولايات المتحدة", "أستراليا", "نيوزيلندا"] },
    { country: "اليابان", flag: "🇯🇵", options: ["اليابان", "كوريا الجنوبية", "الصين", "فيتنام"] },
    { country: "الصين", flag: "🇨🇳", options: ["الصين", "اليابان", "الهند", "كوريا"] },
    { country: "كوريا الجنوبية", flag: "🇰🇷", options: ["كوريا الجنوبية", "اليابان", "كوريا الشمالية", "تايلاند"] }
];

const capitalsGameData = [
    { country: "المملكة العربية السعودية", capital: "الرياض", options: ["الرياض", "جدة", "مكة المكرمة", "الدمام"] },
    { country: "مصر", capital: "القاهرة", options: ["الإسكندرية", "القاهرة", "الجيزة", "أسوان"] },
    { country: "الإمارات", capital: "أبوظبي", options: ["دبي", "أبوظبي", "الشارقة", "عجمان"] },
    { country: "الكويت", capital: "الكويت", options: ["الكويت", "الجهراء", "حولي", "الفحيحيل"] },
    { country: "قطر", capital: "الدوحة", options: ["الدوحة", "الخور", "الوكرة", "الريان"] },
    { country: "البحرين", capital: "المنامة", options: ["المحرق", "المنامة", "الرفاع", "المدينة"] },
    { country: "عمان", capital: "مسقط", options: ["صلالة", "مسقط", "نزوى", "صحر"] },
    { country: "الأردن", capital: "عمان", options: ["إربد", "عمان", "الزرقاء", "السلط"] },
    { country: "العراق", capital: "بغداد", options: ["الموصل", "بغداد", "البصرة", "اربيل"] },
    { country: "سوريا", capital: "دمشق", options: ["حلب", "دمشق", "حمص", "اللاذقية"] },
    { country: "لبنان", capital: "بيروت", options: ["طرابلس", "بيروت", "صيدا", "صور"] },
    { country: "فلسطين", capital: "القدس", options: ["رام الله", "القدس", "غزة", "نابلس"] },
    { country: "اليمن", capital: "صنعاء", options: ["عدن", "صنعاء", "تعز", "إب"] },
    { country: "الجزائر", capital: "الجزائر", options: ["وهران", "الجزائر", "قسنطينة", "عنابة"] },
    { country: "المغرب", capital: "الرباط", options: ["الدار البيضاء", "الرباط", "مراكش", "فاس"] },
    { country: "تونس", capital: "تونس", options: ["سوسة", "تونس", "صفاقس", "بنزرت"] },
    { country: "ليبيا", capital: "طرابلس", options: ["بنغازي", "طرابلس", "مصراتة", "سبها"] },
    { country: "السودان", capital: "الخرطوم", options: ["الخرطوم", "بورتسودان", "أم درمان", "كسلا"] },
    { country: "تركيا", capital: "أنقرة", options: ["إسطنبول", "أنقرة", "إزمير", "بورصة"] },
    { country: "إيطاليا", capital: "روما", options: ["ميلانو", "روما", "البندقية", "فلورنسا"] },
    { country: "فرنسا", capital: "باريس", options: ["ليون", "مارسيليا", "باريس", "نيس"] },
    { country: "إسبانيا", capital: "مدريد", options: ["برشلونة", "مدريد", "إشبيلية", "فالنسيا"] },
    { country: "ألمانيا", capital: "برلين", options: ["ميونخ", "فرانكفورت", "برلين", "هامبورغ"] },
    { country: "بريطانيا", capital: "لندن", options: ["مانشستر", "لندن", "ليفربول", "برمنغهام"] },
    { country: "الولايات المتحدة", capital: "واشنطن", options: ["نيويورك", "واشنطن", "لوس أنجلوس", "شيكاغو"] },
    { country: "كندا", capital: "أوتاوا", options: ["تورونتو", "فانكوفر", "أوتاوا", "مونتريال"] },
    { country: "اليابان", capital: "طوكيو", options: ["أوساكا", "طوكيو", "كيوتو", "هيروشيما"] },
    { country: "الصين", capital: "بكين", options: ["شنغهاي", "بكين", "هونغ كونغ", "قوانغتشو"] },
    { country: "روسيا", capital: "موسكو", options: ["سان بطرسبرغ", "موسكو", "قازان", "سوتشي"] },
    { country: "البرازيل", capital: "برازيليا", options: ["ريو دي جانيرو", "ساو باولو", "برازيليا", "سالفادور"] }
];

const hazirData = [
    { riddle: "ما هو الشيء الذي أبيض من السن وأسود من الليل؟", correct: "خط القران" },
    { riddle: "ما هو الشيء الذي يجري وراءك ولا تحسه؟", correct: "الظل" },
    { riddle: "ما هو البيت الذي ليس فيه أبواب ولا نوافذ؟", correct: "بيت الشعر" },
    { riddle: "ما هو الشيء الذي إذا أكلته كله نفعك، وإذا أكلت نصفه قتلن؟", correct: "السمسم" },
    { riddle: "ما هو الشيء الذي له أربع أرجل ولا يستطيع المشي؟", correct: "الكرسي" },
    { riddle: "ما هو الشيء الذي كلما كبر صغر؟", correct: "الحفرة" },
    { riddle: "ما هو الشيء الذي يتكلم جميع اللغات ولكنه لا لسان له؟", correct: "الصدى" },
    { riddle: "ما هو الشيء الذي يحميك وتحميه وكلما مشى خطوة فقد خطوة؟", correct: "الحذاء" },
    { riddle: "من هو الشخص الذي يرى عدوه وصديقه بعين واحدة؟", correct: "الأعور" },
    { riddle: "ما هو الشيء الذي يوجد في وسط مكة؟", correct: "حرف الكاف" },
    { riddle: "ما هو الباب الذي لا يمكن فتحه؟", correct: "الباب المفتوح" },
    { riddle: "ما هو الشيء الذي يقرصك ولا تراه؟", correct: "الجوع" },
    { riddle: "ما هو الشئ الذي كلما اخذ منه كبر؟", correct: "الحفرة" },
    { riddle: "ما هو الشيء الذي يخترق الزجاج ولا يكسره؟", correct: "الضوء" },
    { riddle: "ما هو الشيء الذي يكون أخضر في الأرض وأسود في السوق وأحمر في البيت؟", correct: "الشاي" },
    { riddle: "من هو الحيوان الذي ينام وإحدى عينيه مفتوحه والأخرى مغلوبة؟", correct: "الدلفين" },
    { riddle: "ما هو الشيء الذي تذبحه وتكي عليه وتبكي عليه؟", correct: "البصل" },
    { riddle: "ما هو الشيء الذي يمشي بلا رجلين ويطير بلا جناحين؟", correct: "السحاب" },
    { riddle: "ما هي اللوحة التي ليس عليها رسومات ولا كتابات؟", correct: "لوحة السيارات" },
    { riddle: "ما هو الشيء الذي له عين واحدة ولكنه لا يرى؟", correct: "الإبرة" },
    { riddle: "ما هو الشيء الذي تراه في الليل ثلاث مرات وفي النهار مرة واحدة؟", correct: "حرف اللام" },
    { riddle: "ما هو الشيء الذي ليس له بداية ولا نهاية؟", correct: "الدائرة" },
    { riddle: "ما هو الطائر الذي يلد ولا يبيض؟", correct: "الخفاش" },
    { riddle: "ما هو الشيء الذي يقرصك بدون أن تراه؟", correct: "البرد" },
    { riddle: "ما هو الشيء الذي يقرأ ولا كتب له؟", correct: "الطالع" },
    { riddle: "ما هو الشيء الذي إذا لمسته صاح بصوت عالي؟", correct: "الجرس" },
    { riddle: "ما هو الشيء الذي يسير أمامك ولا تراه؟", correct: "المستقبل" },
    { riddle: "ما هو الشيء الذي يحمله الناس ويحميهم في نفس الوقت؟", correct: "المظلة" },
    { riddle: "ما هو الشيء الذي إذا غليته جمد؟", correct: "البيضة" },
    { riddle: "ما هو الشيء الذي كلما زاد نقص؟", correct: "العمر" }
];

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

client.once('ready', () => {
    console.log(`تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // أمر المسح المباشر في الشات دون لوحة أو أزرار
    if (message.content === '!clear') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('❌ ليس لديك صلاحية لإدارة الرسائل!');
        }
        try {
            const fetched = await message.channel.messages.fetch({ limit: 100 });
            const toDel = fetched.filter(msg => !msg.pinned);
            if (toDel.size === 0) return message.reply('❌ لا توجد رسائل غير مثبتة لمسحها.');
            await message.channel.bulkDelete(toDel, true);
            const conf = await message.channel.send('✅ تم مسح الشات بنجاح.');
            setTimeout(() => conf.delete().catch(() => {}), 3000);
        } catch (e) {
            message.reply('❌ حدث خطأ أثناء مسح الرسائل.');
        }
        return;
    }

    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('🎮 قائمة ألعاب وأوامر Mixed-bot')
            .setDescription('استمتع بأفضل الألعاب والتحديات التفاعلية (أكثر من 30 سؤالاً في كل لعبة):')
            .addFields(
                { name: '🧹 مسح الشات', value: '`!clear`', inline: true },
                { name: '✂️ حجر ورق مقص', value: '`!rps @الشخص`', inline: true },
                { name: '🔢 تخمين الرقم', value: '`!تخمين`', inline: true },
                { name: '⚡ تحدي السرعة', value: '`!سريع`', inline: true },
                { name: '🎰 الحظ السعيد', value: '`!حظ`', inline: true },
                { name: '❓ الأسئلة', value: '`!اسئلة`', inline: true },
                { name: '🌍 الأعلام', value: '`!اعلام`', inline: true },
                { name: '🏛️ العواصم', value: '`!عواصم`', inline: true },
                { name: '🧩 فكك', value: '`!فكك`', inline: true },
                { name: '🔤 ركب', value: '`!ركب`', inline: true },
                { name: '🧠 حزر', value: '`!حزر`', inline: true }
            )
            .setColor(0x00AE86)
            .setTimestamp();
        return message.reply({ embeds: [helpEmbed] });
    }

    // حجر ورق مقص
    if (message.content.startsWith('!rps')) {
        let opponent = message.mentions.users.first();
        if (!opponent) return message.reply('❌ منشن شخص لتبدأ معه! مثال: `!rps @الشخص`');
        if (opponent.bot || opponent.id === message.author.id) return message.reply('❌ لا يمكنك اللعب مع نفسك أو بوت!');

        const inviteMsg = await message.reply({ 
            content: `<@${opponent.id}>`, 
            embeds: [new EmbedBuilder().setTitle('✂️ تحدي حجر ورق مقص').setDescription(`تحدي ممتع بين <@${message.author.id}> و <@${opponent.id}>`).setColor(0x00AE86)], 
            components: [new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('rps_ok').setLabel('موافق').setStyle(ButtonStyle.Success), 
                new ButtonBuilder().setCustomId('rps_no').setLabel('رفض').setStyle(ButtonStyle.Danger)
            )] 
        });
        const col = inviteMsg.createMessageComponentCollector({ time: 60000 });
        col.on('collect', async i => {
            if (i.user.id !== opponent.id) return i.reply({ content: '❌ التحدي ليس موجهاً لك!', ephemeral: true });
            if (i.customId === 'rps_no') return i.update({ embeds: [new EmbedBuilder().setTitle('❌ تم رفض التحدي').setColor(0xFF0000)], components: [] });
            col.stop();
            await i.update({ content: '🎮 تبدأ اللعبة الآن...', embeds: [], components: [] });
            new RockPaperScissors({ message: inviteMsg, slash_command: false, opponent: opponent, embed: { title: 'حجر ورق مقص', color: '#00AE86' }, mentionUser: true }).startGame();
        });
        return;
    }

    // تخمين الرقم
    if (message.content === '!تخمين') {
        const secret = Math.floor(Math.random() * 100) + 1;
        let attempts = 10;
        await message.reply(`🔢 **لعبة تخمين الرقم!**\nاخترت رقماً بين **1 و 100**. لديك **${attempts}** محاولات.\nاكتب الرقم في الشات الآن!`);
        
        const filter = m => m.author.id === message.author.id && !isNaN(m.content);
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', async m => {
            const guess = parseInt(m.content);
            attempts--;
            if (guess === secret) {
                collector.stop();
                return m.reply(`🎉 كفو! لقد فزت، الرقم الصحيح كان **${secret}**.`);
            } else if (attempts === 0) {
                collector.stop();
                return m.reply(`❌ انتهت المحاولات! الرقم الصحيح كان **${secret}**.`);
            } else if (guess < secret) {
                await m.react('📈');
                m.reply(`الرقم **أكبر**! باقي لديك **${attempts}** محاولات.`);
            } else {
                await m.react('📉');
                m.reply(`الرقم **أصغر**! باقي لديك **${attempts}** محاولات.`);
            }
        });
        return;
    }

    // تحدي السرعة
    if (message.content === '!سريع') {
        const words = ["تفاح", "برمجة", "ديسكورد", "حاسوب", "تطبيقات", "سرعة", "تحدي", "خوارزمية", "مطور", "ذكاء", "سيرفر", "قناة", "روم", "صوت", "تفاعل", "نشاط", "تحديث", "تطوير", "مشروع", "منصة"];
        const targetWord = words[Math.floor(Math.random() * words.length)];
        
        const embed = new EmbedBuilder()
            .setTitle('⚡ تحدي السرعة والبرق')
            .setDescription(`أسرع شخص يكتب هذه الكلمة في الشات يربح:\n\`\`\`${targetWord}\`\`\``)
            .setColor(0xF1C40F);
        
        await message.channel.send({ embeds: [embed] });
        
        const filter = m => !m.author.bot && m.content === targetWord;
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });

        collector.on('collect', m => {
            m.reply(`🎉 كفو <@${m.author.id}>! لقد فزت بالسرعة البارقة وكسبت التحدي! ⚡`);
        });
        return;
    }

    // الحظ السعيد
    if (message.content === '!حظ') {
        const emojis = ['🍒', '🍋', '🍊', '🍇', '🔔', '⭐'];
        const r1 = emojis[Math.floor(Math.random() * emojis.length)];
        const r2 = emojis[Math.floor(Math.random() * emojis.length)];
        const r3 = emojis[Math.floor(Math.random() * emojis.length)];

        const embed = new EmbedBuilder()
            .setTitle('🎰 ماكينة الحظ السعيد')
            .setDescription(`[ ${r1} | ${r2} | ${r3} ]\n\n` + (r1 === r2 && r2 === r3 ? '🎉 مبروك! لقد ربحت الجائزة الكبرى!' : '❌ هارد لك، حظاً أوفر في المرة القادمة!'))
            .setColor(0x9B59B6);
        return message.reply({ embeds: [embed] });
    }

    // الأسئلة
    if (message.content === '!اسئلة') {
        const q = triviaData[Math.floor(Math.random() * triviaData.length)];
        const shuffledOpts = shuffleArray([...q.options]);
        
        const row = new ActionRowBuilder();
        shuffledOpts.forEach((opt, idx) => {
            row.addComponents(
                new ButtonBuilder().setCustomId(`trivia_${idx}_${opt === q.correct}`).setLabel(opt).setStyle(ButtonStyle.Primary)
            );
        });

        const embed = new EmbedBuilder().setTitle('❓ سؤال وجواب').setDescription(q.question).setColor(0x3498DB);
        const msg = await message.reply({ embeds: [embed], components: [row] });

        const collector = msg.createMessageComponentCollector({ time: 30000 });
        collector.on('collect', async i => {
            collector.stop();
            const isCorrect = i.customId.endsWith('_true');
            if (isCorrect) {
                await i.update({ content: `✅ إجابة صحيحة وكفو يا <@${i.user.id}>!`, embeds: [], components: [] });
            } else {
                await i.update({ content: `❌ إجابة خاطئة يا <@${i.user.id}>! الإجابة الصحيحة هي: **${q.correct}**`, embeds: [], components: [] });
            }
        });
        return;
    }

    // الأعلام
    if (message.content === '!اعلام') {
        const f = flagsGameData[Math.floor(Math.random() * flagsGameData.length)];
        const shuffledOpts = shuffleArray([...f.options]);

        const row = new ActionRowBuilder();
        shuffledOpts.forEach((opt, idx) => {
            row.addComponents(
                new ButtonBuilder().setCustomId(`flag_${idx}_${opt === f.country}`).setLabel(opt).setStyle(ButtonStyle.Primary)
            );
        });

        const embed = new EmbedBuilder().setTitle('🌍 لعبة تخمين الأعلام').setDescription(`ما هي الدولة الخاصة بهذا العلم؟\n\n# ${f.flag}`).setColor(0xE67E22);
        const msg = await message.reply({ embeds: [embed], components: [row] });

        const collector = msg.createMessageComponentCollector({ time: 30000 });
        collector.on('collect', async i => {
            collector.stop();
            const isCorrect = i.customId.endsWith('_true');
            if (isCorrect) {
                await i.update({ content: `✅ كفو <@${i.user.id}>! إجابة صحيحة ورائعة.`, embeds: [], components: [] });
            } else {
                await i.update({ content: `❌ إجابة خاطئة يا <@${i.user.id}>! الدولة هي: **${f.country}**`, embeds: [], components: [] });
            }
        });
        return;
    }

    // العواصم
    if (message.content === '!عواصم') {
        const c = capitalsGameData[Math.floor(Math.random() * capitalsGameData.length)];
        const shuffledOpts = shuffleArray([...c.options]);

        const row = new ActionRowBuilder();
        shuffledOpts.forEach((opt, idx) => {
            row.addComponents(
                new ButtonBuilder().setCustomId(`cap_${idx}_${opt === c.capital}`).setLabel(opt).setStyle(ButtonStyle.Primary)
            );
        });

        const embed = new EmbedBuilder().setTitle('🏛️ لعبة العواصم').setDescription(`ما هي عاصمة دولة **${c.country}**؟`).setColor(0x1ABC9C);
        const msg = await message.reply({ embeds: [embed], components: [row] });

        const collector = msg.createMessageComponentCollector({ time: 30000 });
        collector.on('collect', async i => {
            collector.stop();
            const isCorrect = i.customId.endsWith('_true');
            if (isCorrect) {
                await i.update({ content: `✅ كفو <@${i.user.id}>! عاصمة صحيحة.`, embeds: [], components: [] });
            } else {
                await i.update({ content: `❌ خطأ يا <@${i.user.id}>! العاصمة الصحيحة هي: **${c.capital}**`, embeds: [], components: [] });
            }
        });
        return;
    }

    // فكك (يجب تفكيك الحروف بالمسافات)
    if (message.content === '!فكك') {
        const item = fakkData[Math.floor(Math.random() * fakkData.length)];
        const embed = new EmbedBuilder()
            .setTitle('🧩 لعبة تفكيك الكلمات')
            .setDescription(`فكك الكلمة التالية واكتبها بالحروف مفرقة:\n\`\`\`${item.word}\`\`\``)
            .setColor(0xE91E63);
        
        await message.channel.send({ embeds: [embed] });

        const filter = m => !m.author.bot && m.content.trim() === item.spaced;
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });

        collector.on('collect', m => {
            m.reply(`🎉 كفو <@${m.author.id}>! فككتها وصح عليك.`);
        });
        
        collector.on('end', (collected, reason) => {
            if (reason === 'time' && collected.size === 0) {
                message.channel.send(`⏰ انتهى الوقت! الإجابة الصحيحة كانت: \`${item.spaced}\``);
            }
        });
        return;
    }

    // ركب
    if (message.content === '!ركب') {
        const item = rakibData[Math.floor(Math.random() * rakibData.length)];
        const embed = new EmbedBuilder()
            .setTitle('🔤 لعبة تركيب الحروف')
            .setDescription(`ركب الحروف التالية لتصبح كلمة صحيحة متصلة:\n\`\`\`${item.scrambled}\`\`\``)
            .setColor(0x34495E);
        
        await message.channel.send({ embeds: [embed] });

        const filter = m => !m.author.bot && m.content.replace(/\s+/g, '') === item.correct;
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });

        collector.on('collect', m => {
            m.reply(`🎉 كفو <@${m.author.id}>! ركبتها وصح عليك (الكلمة: **${item.correct}**).`);
        });
        return;
    }

    // حزر
    if (message.content === '!حزر') {
        const item = hazirData[Math.floor(Math.random() * hazirData.length)];
        const embed = new EmbedBuilder()
            .setTitle('🧠 لعبة الألغاز والفزورة')
            .setDescription(`حزر الفزورة التالية:\n\`\`\`${item.riddle}\`\`\``)
            .setColor(0xD35400);
        
        await message.channel.send({ embeds: [embed] });

        const filter = m => !m.author.bot && m.content.includes(item.correct);
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 40000 });

        collector.on('collect', m => {
            m.reply(`🎉 إجابة ذكية يا <@${m.author.id}>! الحل الصحيح هو: **${item.correct}**`);
        });
        return;
    }
});

client.login(process.env.TOKEN);
