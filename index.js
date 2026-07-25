const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, REST, Routes, SlashCommandBuilder } = require('discord.js');
const { ConnectFour, RockPaperScissors } = require('discord-gamecord');

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
// 100 عنصر للعبة فكك
// ==========================================
const fakkData = [
    { word: "مكتبة", spaced: "م ك ت ب ة" }, { word: "حاسوب", spaced: "ح ا س و ب" }, { word: "مدرسة", spaced: "م د ر س ة" }, { word: "جامعة", spaced: "ج ا م ع ة" }, { word: "سيارة", spaced: "س ي ا ر ة" },
    { word: "طائرة", spaced: "ط ا ئ ر ة" }, { word: "قطار", spaced: "ق ط ا ر" }, { word: "شجرة", spaced: "ش ج ر ة" }, { word: "حديقة", spaced: "ح د ي ق ة" }, { word: "طاولة", spaced: "ط ا و ل ة" },
    { word: "قلم", spaced: "ق ل م" }, { word: "دفتر", spaced: "د ف ت ر" }, { word: "حقيبة", spaced: "ح ق ي ب ة" }, { word: "نافذة", spaced: "ن ا ف ذ ة" }, { word: "باب", spaced: "ب ا ب" },
    { word: "منزل", spaced: "م ن ز ل" }, { word: "مدينة", spaced: "م د ي ن ة" }, { word: "دولة", spaced: "د و ل ة" }, { word: "عالم", spaced: "ع ا ل م" }, { word: "تاريخ", spaced: "ت ا ر ي خ" },
    { word: "جغرافيا", spaced: "ج غ ر ا ف ي ا" }, { word: "رياضيات", spaced: "ر ي ا ض ي ا ت" }, { word: "فيزياء", spaced: "ف ي ز ي ا ء" }, { word: "كيمياء", spaced: "ك ي م ي ا ء" }, { word: "أحياء", spaced: "أ ح ي ا ء" },
    { word: "حاسب", spaced: "ح ا س ب" }, { word: "برمجة", spaced: "ب ر م ج ة" }, { word: "تطبيقات", spaced: "ت ط ب ي ق ا ت" }, { word: "شبكة", spaced: "ش ب ك ة" }, { word: "انترنت", spaced: "ا ن ت ر ن ت" },
    { word: "شاشات", spaced: "ش ا ش ا ت" }, { word: "سماعات", spaced: "س م ا ع ا ت" }, { word: "مفاتيح", spaced: "م ف ا ت ي ح" }, { word: "كرسي", spaced: "ك ر س ي" }, { word: "سرير", spaced: "س ر ي ر" },
    { word: "غرفة", spaced: "غ ر ف ة" }, { word: "مطبخ", spaced: "م ط ب خ" }, { word: "حمام", spaced: "ح م ا م" }, { word: "طعام", spaced: "ط ع ا م" }, { word: "شراب", spaced: "ش ر ا ب" },
    { word: "تفاح", spaced: "ت ف ا ح" }, { word: "موز", spaced: "م و ز" }, { word: "برتقال", spaced: "ب ر ت ق ا ل" }, { word: "عنب", spaced: "ع ن ب" }, { word: "بطيخ", spaced: "ب ط ي خ" },
    { word: "خيار", spaced: "خ ي ا ر" }, { word: "طماطم", spaced: "ط م ا ط م" }, { word: "خس", spaced: "خ س" }, { word: "جزر", spaced: "ج ز ر" }, { word: "بطاطس", spaced: "ب ط ا ط س" },
    { word: "ملابس", spaced: "م ل ا ب س" }, { word: "قميص", spaced: "ق م ي ص" }, { word: "بنطلون", spaced: "ب ن ط ل و ن" }, { word: "حذاء", spaced: "ح ذ ا ء" }, { word: "جورب", spaced: "ج و ر ب" },
    { word: "ساعة", spaced: "س ا ع ة" }, { word: "خاتم", spaced: "خ ا ت م" }, { word: "نظارة", spaced: "ن ظ ا ر ة" }, { word: "عطر", spaced: "ع ط ر" }, { word: "صابون", spaced: "ص ا ب و ن" },
    { word: "مفتاح", spaced: "م ف ت ا ح" }, { word: "قفل", spaced: "ق ف ل" }, { word: "محفظة", spaced: "م ح ف ظ ة" }, { word: "نقود", spaced: "ن ق و د" }, { word: "مصرف", spaced: "م ص ر ف" },
    { word: "بطاقة", spaced: "ب ط ا ق ة" }, { word: "هاتف", spaced: "ه ا ت ف" }, { word: "جوال", spaced: "ج و ا ل" }, { word: "شاحن", spaced: "ش ا ح ن" }, { word: "كاميرا", spaced: "ك ا م ي ر ا" },
    { word: "صورة", spaced: "ص و ر ة" }, { word: "شاشة", spaced: "ش ا ش ة" }, { word: "لوحة", spaced: "ل و ح ة" }, { word: "رسم", spaced: "ر س م" }, { word: "لون", spaced: "ل و ن" },
    { word: "أحمر", spaced: "أ ح م ر" }, { word: "أزرق", spaced: "أ ز ر ق" }, { word: "أخضر", spaced: "أ خ ض ر" }, { word: "أصفر", spaced: "أ ص ف ر" }, { word: "أسود", spaced: "أ س و د" },
    { word: "أبيض", spaced: "أ ب ي ض" }, { word: "رمادي", spaced: "ر م ا د ي" }, { word: "بني", spaced: "ب ن ي" }, { word: "وردي", spaced: "و ر د ي" }, { word: "سماء", spaced: "س م ا ء" },
    { word: "أرض", spaced: "أ ر ض" }, { word: "بحر", spaced: "ب ح ر" }, { word: "نهر", spaced: "ن ه ر" }, { word: "جبل", spaced: "ج ب ل" }, { word: "صحراء", spaced: "ص ح ر ا ء" },
    { word: "غابة", spaced: "غ ا ب ة" }, { word: "حيوان", spaced: "ح ي و ا ن" }, { word: "أسد", spaced: "أ س د" }, { word: "نمر", spaced: "ن م ر" }, { word: "فهد", spaced: "ف ه د" },
    { word: "ذئب", spaced: "ذ ئ ب" }, { word: "ثعلب", spaced: "ث ع ل ب" }, { word: "غزال", spaced: "غ ز ا ل" }, { word: "جمل", spaced: "ج م ل" }
];

// ==========================================
// 100 عنصر للعبة ركب
// ==========================================
const rakibData = [
    { scrambled: "س م ك", correct: "سمك" }, { scrambled: "ق م ر", correct: "قمر" }, { scrambled: "ش م س", correct: "شمس" }, { scrambled: "ن ج م", correct: "نجم" }, { scrambled: "ب ح ر", correct: "بحر" },
    { scrambled: "ن ه ر", correct: "نهر" }, { scrambled: "ج ب ل", correct: "جبل" }, { scrambled: "ق ل م", correct: "قلم" }, { scrambled: "ك ت ب", correct: "كتب" }, { scrambled: "و ر ق", correct: "ورق" },
    { scrambled: "ب ا ب", correct: "باب" }, { scrambled: "د ا ر", correct: "دار" }, { scrambled: "د ر س", correct: "درس" }, { scrambled: "ل ع ب", correct: "لعب" }, { scrambled: "أ ك ل", correct: "أكل" },
    { scrambled: "ش ر ب", correct: "شرب" }, { scrambled: "ن ا م", correct: "نام" }, { scrambled: "ق ا م", correct: "قام" }, { scrambled: "م ش ى", correct: "مشى" }, { scrambled: "ج ر ي", correct: "جري" },
    { scrambled: "ح ب ل", correct: "حبل" }, { scrambled: "خ ش ب", correct: "خشب" }, { scrambled: "ح د ي د", correct: "حديد" }, { scrambled: "ذ ه ب", correct: "ذهب" }, { scrambled: "ف ض ة", correct: "فضة" },
    { scrambled: "م ا ء", correct: "ماء" }, { scrambled: "ه و ا ء", correct: "هواء" }, { scrambled: "ت ر ا ب", correct: "تراب" }, { scrambled: "ن ا ر", correct: "نار" }, { scrambled: "ث و ب", correct: "ثوب" },
    { scrambled: "ب ي ت", correct: "بيت" }, { scrambled: "س و ق", correct: "سوق" }, { scrambled: "ح ك م", correct: "حكم" }, { scrambled: "ع ل م", correct: "علم" }, { scrambled: "ف ه م", correct: "فهم" },
    { scrambled: "س م ع", correct: "سمع" }, { scrambled: "ب ص ر", correct: "بصر" }, { scrambled: "ن ط ق", correct: "نطق" }, { scrambled: "ق و ل", correct: "قول" }, { scrambled: "ف ع ل", correct: "فعل" },
    { scrambled: "ص د ق", correct: "صدق" }, { scrambled: "ع د ل", correct: "عدل" }, { scrambled: "ص ب ر", correct: "صبر" }, { scrambled: "ش ك ر", correct: "شكر" }, { scrambled: "ح م د", correct: "حمد" },
    { scrambled: "م ل ك", correct: "ملك" }, { scrambled: "أ م ي ر", correct: "أمير" }, { scrambled: "و ز ي ر", correct: "وزير" }, { scrambled: "ق ا ض ي", correct: "قاضي" }, { scrambled: "ع ا ل م", correct: "عالم" },
    { scrambled: "ط ب ي ب", correct: "طبيب" }, { scrambled: "م ه ن د س", correct: "مهندس" }, { scrambled: "م ع ل م", correct: "معلم" }, { scrambled: "ط ا ل ب", correct: "طالب" }, { scrambled: "ج ن د ي", correct: "جندي" },
    { scrambled: "ش ر ط ي", correct: "شرطي" }, { scrambled: "ت ا ج ر", correct: "تاجر" }, { scrambled: "ف ل ل ا ح", correct: "فلاح" }, { scrambled: "ص ي ا د", correct: "صياد" }, { scrambled: "ن ج ا ر", correct: "نجار" },
    { scrambled: "ح د ا د", correct: "حداد" }, { scrambled: "خ ب ا ز", correct: "خباز" }, { scrambled: "ب ن ا ء", correct: "بناء" }, { scrambled: "خ ي ا ط", correct: "خياط" }, { scrambled: "ر س ا م", correct: "رسام" },
    { scrambled: "ك ا ت ب", correct: "كاتب" }, { scrambled: "ش ا ع ر", correct: "شاعر" }, { scrambled: "أ د ي ب", correct: "أديب" }, { scrambled: "خ ط ي ب", correct: "خطيب" }, { scrambled: "إ م ا م", correct: "إمام" },
    { scrambled: "م و ذ ن", correct: "مؤذن" }, { scrambled: "خ ا د م", correct: "خادم" }, { scrambled: "ض ي ف", correct: "ضيف" }, { scrambled: "ج ا ر", correct: "جار" }, { scrambled: "ص د ي ق", correct: "صديق" },
    { scrambled: "ر ف ي ق", correct: "رفيق" }, { scrambled: "أ خ", correct: "أخ" }, { scrambled: "أ خ ت", correct: "أخت" }, { scrambled: "أ ب", correct: "أب" }, { scrambled: "أ م", correct: "أم" },
    { scrambled: "ج د", correct: "جد" }, { scrambled: "ج د ة", correct: "جدة" }, { scrambled: "خ ا ل", correct: "خال" }, { scrambled: "ع م", correct: "عم" }, { scrambled: "ا ب ن", correct: "ابن" },
    { scrambled: "ب ن ت", correct: "بنت" }, { scrambled: "ط ف ل", correct: "طفل" }, { scrambled: "و ل د", correct: "ولد" }, { scrambled: "ر ج ل", correct: "رجل" }, { scrambled: "ا م ر أ ة", correct: "امرأة" },
    { scrambled: "ش ا ب", correct: "شاب" }, { scrambled: "ف ت ا ة", correct: "فتاة" }, { scrambled: "ع ج و ز", correct: "عجوز" }, { scrambled: "ق و ي", correct: "قوي" }, { scrambled: "ض ع ي ف", correct: "ضعيف" },
    { scrambled: "غ ن ي", correct: "غني" }, { scrambled: "ف ق ي ر", correct: "فقير" }, { scrambled: "ك ر ي م", correct: "كريم" }, { scrambled: "ب خ ي ل", correct: "بخيل" }, { scrambled: "ش ج ا ع", correct: "شجاع" }
];

// ==========================================
// 100 سؤال للعبة الأسئلة (Trivia)
// ==========================================
const triviaData = [
    { question: "ما هو أعلى حزام في التايكوندو؟", correct: "الأسود", options: ["الأخضر", "الأحمر", "الأبيض", "الأسود"] },
    { question: "ما هي عاصمة المملكة العربية السعودية؟", correct: "الرياض", options: ["جدة", "الرياض", "الدمام", "مكة"] },
    { question: "كم عدد سور القرآن الكريم؟", correct: "114", options: ["112", "113", "114", "115"] },
    { question: "ما هو أكبر كوكب في المجموعة الشمسية؟", correct: "المشتري", options: ["المريخ", "زحل", "المشتري", "الأرض"] },
    { question: "في أي قارة تقع مصر؟", correct: "إفريقيا", options: ["آسيا", "إفريقيا", "أوروبا", "أستراليا"] },
    { question: "ما هو الحيوان الذي يُسمى بملك الغابة؟", correct: "الأسد", options: ["النمر", "الأسد", "الفهد", "الدب"] },
    { question: "كم عدد ركعات صلاة الفجر؟", correct: "ركعتان", options: ["ركعة", "ركعتان", "ثلاث ركعات", "أربع ركعات"] },
    { question: "ما هو عنصر الذهب بالجدول الدوري؟", correct: "Au", options: ["Ag", "Au", "Fe", "Cu"] },
    { question: "ما هي عاصمة فرنسا؟", correct: "باريس", options: ["لندن", "برلين", "باريس", "روما"] },
    { question: "كم يبلغ عدد ألوان قوس قزح؟", correct: "7", options: ["5", "6", "7", "8"] },
    { question: "ما هو أسرع حيوان بري في العالم؟", correct: "الفهد", options: ["الأسد", "الحصان", "الفهد", "الغزال"] },
    { question: "ما هو أطول نهر في العالم؟", correct: "نهر النيل", options: ["نهر الأمازون", "نهر النيل", "نهر المسيسيبي", "نهر الفرات"] },
    { question: "ما هي عاصمة الإمارات؟", correct: "أبوظبي", options: ["دبي", "الشارقة", "أبوظبي", "عجمان"] },
    { question: "من هو أول خلفاء المسلمين؟", correct: "أبو بكر الصديق", options: ["عمر بن الخطاب", "عثمان بن عفان", "علي بن أبي طالب", "أبو بكر الصديق"] },
    { question: "ما هو المعدن السائل في درجة حرارة الغرفة؟", correct: "الزئبق", options: ["الذهب", "الزئبق", "الحديد", "النحاس"] },
    { question: "كم عدد عظام جسم الإنسان البالغ؟", correct: "206", options: ["200", "206", "210", "180"] },
    { question: "ما هو الغاز الأكثر رواجاً في الغلاف الجوي للأرض؟", correct: "النيتروجين", options: ["الأكسجين", "النيتروجين", "السيليكون", "الهيدروجين"] },
    { question: "ما هي عاصمة الكويت؟", correct: "الكويت", options: ["الجهراء", "الكويت", "الفروانية", "حولي"] },
    { question: "في أي عام هجري كانت غزوة بدر؟", correct: "السنة الثانية", options: ["السنة الأولى", "السنة الثانية", "السنة الثالثة", "السنة الرابعة"] },
    { question: "ما هو الكوكب الملقب بالكوكب الأحمر؟", correct: "المريخ", options: ["الزهرة", "المريخ", "عطارد", "المشتري"] },
    { question: "كم عدد أجزاء القرآن الكريم؟", correct: "30", options: ["20", "25", "30", "40"] },
    { question: "ما هي عاصمة قطر؟", correct: "الدوحة", options: ["الدوحة", "الوكرة", "الخور", "لوسيل"] },
    { question: "من هو النبي الذي أُلقي في الجب؟", correct: "يوسف عليه السلام", options: ["موسى عليه السلام", "يوسف عليه السلام", "إبراهيم عليه السلام", "يونس عليه السلام"] },
    { question: "ما هو أصل كلمة 'تلفاز'؟", correct: "يوناني/لاتيني", options: ["عربي", "إنجليزي", "يوناني/لاتيني", "فرنسي"] },
    { question: "ما هي عاصمة سلطنة عمان؟", correct: "مسقط", options: ["صلالة", "نزوى", "مسقط", "صواريخ"] },
    { question: "كم عدد الأئمة عند الشيعة الإثنا عشرية؟", correct: "12", options: ["10", "11", "12", "14"] },
    { question: "ما هو الحيوان الذي يتحمل العطش أكثر من الجمل؟", correct: "الزرافة", options: ["الفيل", "الزرافة", "الحصان", "الكلب"] },
    { question: "ما هي عاصمة البحرين؟", correct: "المنامة", options: ["المحرق", "المنامة", "رفاع", "السيص"] },
    { question: "من هو مخترع المصباح الكهربائي؟", correct: "توماس إديسون", options: ["نيكولا تيسلا", "توماس إديسون", "ألبرت آينشتاين", "ألكسندر بيل"] },
    { question: "ما هي عاصمة الأردن؟", correct: "عمان", options: ["إربد", "عمان", "الزرقاء", "مادبا"] },
    { question: "ما هو البحر الذي يقع بين إفريقيا وآسيا؟", correct: "البحر الأحمر", options: ["البحر المتوسط", "البحر الأحمر", "بحر العرب", "الخليج العربي"] },
    { question: "كم عدد ركعات صلاة الظهر؟", correct: "أربع ركعات", options: ["ركعتان", "ثلاث ركعات", "أربع ركعات", "أربع ركعات وسنة"] },
    { question: "ما هي عاصمة لبنان؟", correct: "بيروت", options: ["طرابلس", "بيروت", "صيدا", "جبيل"] },
    { question: "من هو النبي الذي فداه الله بذبح عظيم؟", correct: "إسماعيل عليه السلام", options: ["إسحاق عليه السلام", "إسماعيل عليه السلام", "يعقوب عليه السلام", "إبراهيم عليه السلام"] },
    { question: "ما هي عاصمة سوريا؟", correct: "دمشق", options: ["حلب", "حمص", "دمشق", "اللاذقية"] },
    { question: "ما هي عاصمة العراق؟", correct: "بغداد", options: ["الموصل", "البصرة", "بغداد", "أربيل"] },
    { question: "ما هو أكبر بحر مغلق في العالم؟", correct: "بحر قزوين", options: ["البحر الميت", "بحر قزوين", "البحر الأسود", "البحر الأحمر"] },
    { question: "ما هي عاصمة المغرب؟", correct: "الرباط", options: ["الدار البيضاء", "مراكش", "الرباط", "فاس"] },
    { question: "من هو كاتب رواية البؤساء؟", correct: "فكتور هوغو", options: ["شكسبير", "فكتور هوغو", "تولستوي", "تشيخوف"] },
    { question: "ما هي عاصمة الجزائر؟", correct: "الجزائر", options: ["وهران", "الجزائر", "قسنطينة", "عنابة"] },
    { question: "ما هي عاصمة تونس؟", correct: "تونس", options: ["صفاقس", "سوسة", "تونس", "بنزرت"] },
    { question: "ما هي عاصمة ليبيا؟", correct: "طرابلس", options: ["بنغازي", "طرابلس", "مصراتة", "سرت"] },
    { question: "ما هي عاصمة السودان؟", correct: "الخرطوم", options: ["بورتسودان", "الخرطوم", "أم درمان", "كسلا"] },
    { question: "ما هو أصل الكنغر؟", correct: "أستراليا", options: ["إفريقيا", "أستراليا", "أمريكا الجنوبية", "آسيا"] },
    { question: "كم عدد حروف الهجاء العربية؟", correct: "28", options: ["26", "28", "30", "29"] },
    { question: "ما هي عاصمة فلسطين؟", correct: "القدس", options: ["غزة", "القدس", "رام الله", "نابلس"] },
    { question: "ما هو أصغر كوكب في المجموعة الشمسية؟", correct: "عطارد", options: ["المريخ", "عطارد", "الزهرة", "بلوتو"] },
    { question: "من هو قائد معركة عفت الصحراء؟", correct: "خالد بن الوليد", options: ["عمر بن الخطاب", "خالد بن الوليد", "علي بن أبي طالب", "سعد بن أبي وقاص"] },
    { question: "ما هو الحيوان الذي ينفرد بوجود سنامين؟", correct: "الجمل ذو السنامين", options: ["الجمل العربي", "الجمل ذو السنامين", "اللاما", "الألباكا"] },
    { question: "ما هي عاصمة تركيا؟", correct: "أنقرة", options: ["إسطنبول", "أنقرة", "إزمير", "بورصة"] },
    { question: "ما هي عاصمة إيران؟", correct: "طهران", options: ["أصفهان", "طهران", "شيراز", "تبريز"] },
    { question: "ما هي عاصمة اليابان؟", correct: "طوكيو", options: ["أوساكا", "طوكيو", "كيوتو", "هيروشيما"] },
    { question: "ما هي عاصمة الصين؟", correct: "بكين", options: ["شنغهاي", "بكين", "هونغ كونغ", "قوانغتشو"] },
    { question: "ما هي عاصمة الهند؟", correct: "نيودلهي", options: ["مومباي", "نيودلهي", "بنغالور", "كلكتا"] },
    { question: "ما هي عاصمة باكستان؟", correct: "إسلام آباد", options: ["كراتشي", "لاهور", "إسلام آباد", "بيشاور"] },
    { question: "ما هي عاصمة ألمانيا؟", correct: "برلين", options: ["ميونخ", "فرانكفورت", "برلين", "هامبورغ"] },
    { question: "ما هي عاصمة إيطاليا؟", correct: "روما", options: ["ميلانو", "فلورنس", "روما", "البندقية"] },
    { question: "ما هي عاصمة إسبانيا؟", correct: "مدريد", options: ["برشلونة", "مدريد", "إشبيلية", "فالنسيا"] },
    { question: "ما هي عاصمة إنجلترا (المملكة المتحدة)؟", correct: "لندن", options: ["مانشستر", "لندن", "ليفربول", "برمنغهام"] },
    { question: "ما هي عاصمة روسيا؟", correct: "موسكو", options: ["سان بطرسبرغ", "موسكو", "قازان", "سوتشي"] },
    { question: "ما هي عاصمة البرازيل؟", correct: "برازيليا", options: ["ريو دي جانيرو", "ساو باولو", "برازيليا", "سالفادور"] },
    { question: "ما هي عاصمة الأرجنتين؟", correct: "بوينس آيرس", options: ["قرطبة", "بوينس آيرس", "روزاريو", "مندوزا"] },
    { question: "ما هي عاصمة كندا؟", correct: "أوتاوا", options: ["تورونتو", "فانكوفر", "أوتاوا", "مونتريال"] },
    { question: "ما هي عاصمة الولايات المتحدة الأمريكية؟", correct: "واشنطن العاصمة", options: ["نيويورك", "لوس أنجلوس", "واشنطن العاصمة", "شيكاغو"] },
    { question: "ما هو أكبر محيط في العالم؟", correct: "المحيط الهادئ", options: ["المحيط الأطلسي", "المحيط الهندي", "المحيط الهادئ", "المحيط المتجمد الشمالي"] },
    { question: "ما هو الحيوان الذي يُسمى بـ 'سفينة الصحراء'؟", correct: "الجمل", options: ["الحصان", "الجمل", "الفيل", "الخروف"] },
    { question: "ما هو لون دم طائر الكركي أو بعض الحشرات؟", correct: "أصفر أو أبيض شفيف", options: ["أحمر", "أزرق", "أصفر أو أبيض", "أخضر"] },
    { question: "كم عدد أركان الإسلام؟", correct: "5", options: ["4", "5", "6", "3"] },
    { question: "كم عدد أركان الإيمان؟", correct: "6", options: ["4", "5", "6", "7"] },
    { question: "من هو أول مؤذن في الإسلام؟", correct: "بلال بن رباح", options: ["عمار بن ياسر", "بلال بن رباح", "عبد الله بن مسعود", "زيد بن حارثة"] },
    { question: "ما هو الحرف الذي يُكتب ولا يُنطق في الكلمات أحياناً؟", correct: "واو الجماعة", options: ["الباء", "التاء", "واو الجماعة", "السين"] },
    { question: "ما هي السورة التي تُسمى 'قلب القرآن'؟", correct: "سورة يس", options: ["سورة البقرة", "سورة الملك", "سورة يس", "سورة الكهف"] },
    { question: "ما هي السورة التي تعدل ثلث القرآن؟", correct: "سورة الإخلاص", options: ["سورة الفاتحة", "سورة الإخلاص", "سورة الناس", "سورة الكافرون"] },
    { question: "ما هو الشرك الأصغر كما جاء في السنة؟", correct: "الرياء", options: ["عبادة غير الله", "الرياء", "السحر", "الكذب"] },
    { question: "ما هو أثقل حيوان بحري في العالم؟", correct: "الحوت الأزرق", options: ["القرش الأبيض", "الحوت الأزرق", "الحوت قاتل", "الأُكْتُوبُوس"] },
    { question: "ما هو العنصر الكيميائي الذي يرمز له بالرمز O؟", correct: "الأكسجين", options: ["الذهب", "الأكسجين", "الفضة", "الحديد"] },
    { question: "ما هو العنصر الكيميائي الذي يرمز له بالرمز H؟", correct: "الهيدروجين", options: ["الهيدروجين", "الهيليوم", "الحديد", "الزئبق"] },
    { question: "ما هو الشهر التاسع في التقويم الهجري؟", correct: "رمضان", options: ["شعبان", "رمضان", "شوال", "رجب"] },
    { question: "في أي شهر هجري يأتي عيد الأضحى؟", correct: "ذو الحجة", options: ["شوال", "رمضان", "ذو القعدة", "ذو الحجة"] },
    { question: "من هو النبي الذي بنى السفينة الكبرى؟", correct: "نوح عليه السلام", options: ["إبراهيم عليه السلام", "نوح عليه السلام", "موسى عليه السلام", "عيسى عليه السلام"] },
    { question: "ما هو أسرع كوكب يدور حول الشمس؟", correct: "عطارد", options: ["عطارد", "الزهرة", "الأرض", "المريخ"] },
    { question: "من هو مكتشف أمريكا؟", correct: "كريستوفر كولومبوس", options: ["فاسكو دي غاما", "كريستوفر كولومبوس", "ماجلان", "ابن بطوطة"] },
    { question: "ما هو الحيوان الذي يستطيع النوم وإحدى عينيه مفتوحة؟", correct: "الدلفين", options: ["القط", "الدلفين", "الكلب", "الأسد"] },
    { question: "كم عدد اللاعبين الأساسيين في فريق كرة القدم؟", correct: "11", options: ["9", "10", "11", "12"] },
    { question: "كم عدد الشهور الميلادية؟", correct: "12", options: ["10", "11", "12", "13"] },
    { question: "ما هي عاصمة اليونان؟", correct: "أثينا", options: ["أثينا", "اسبرطة", "ثيسالونيكي", "باتراس"] },
    { question: "ما هي عاصمة البرتغال؟", correct: "لشبونة", options: ["بورتو", "لشبونة", "كويمبرا", "فارو"] },
    { question: "ما هي عاصمة هولندا؟", correct: "أمستردام", options: ["روتردام", "أمستردام", "لاهاي", "أوترخت"] },
    { question: "ما هي عاصمة بلجيكا؟", correct: "بروكسل", options: ["أنتويرب", "بروكسل", "خنت", "بروج"] },
    { question: "ما هي عاصمة سويسرا؟", correct: "برن", options: ["زيورخ", "جنيف", "برن", "بازل"] },
    { question: "ما هي عاصمة النمسا؟", correct: "فيينا", options: ["سالزبورغ", "فيينا", "إنسبروك", "غراتس"] },
    { question: "ما هي عاصمة السويد؟", correct: "ستوكهولم", options: ["غوتنبرغ", "ستوكهولم", "مالمو", "أوبسالا"] },
    { question: "ما هي عاصمة النرويج؟", correct: "أوسلو", options: ["بيرغن", "أوسلو", "تروندهايم", "ستافانغر"] },
    { question: "ما هي عاصمة فنلندا؟", correct: "هلسنكي", options: ["إسبو", "تامبيري", "هلسنكي", "أولو"] },
    { question: "ما هي عاصمة الدنمارك؟", correct: "كوبنهاغن", options: ["آرهوس", "كوبنهاغن", "أودنسه", "ألبورغ"] },
    { question: "ما هي عاصمة أستراليا؟", correct: "كانبيرا", options: ["سيدني", "ملبورن", "كانبيرا", "بريسبان"] },
    { question: "ما هي عاصمة نيوزيلندا؟", correct: "ويلينغتون", options: ["أوكلاند", "ويلينغتون", "كرايستشيرش", "هاميلتون"] },
    { question: "ما هي عاصمة جنوب إفريقيا؟", correct: "بريتوريا", options: ["جوهانسبرغ", "كيب تاون", "بريتوريا", "ديربان"] },
    { question: "من هو أول من بنى الكعبة؟", correct: "الملائكة ثم إبراهيم وإسماعيل", options: ["آدم عليه السلام", "إبراهيم عليه السلام", "الملائكة ثم إبراهيم وإسماعيل", "قريش"] }
];

const flagsGameData = [
    { country: "المملكة العربية السعودية", flag: "🇸🇦", options: ["المملكة العربية السعودية", "الإمارات العربية المتحدة", "الكويت", "قطر"] },
    { country: "اليابان", flag: "🇯🇵", options: ["الصين", "اليابان", "كوريا الجنوبية", "فيتنام"] }
];

const capitalsGameData = [
    { country: "المملكة العربية السعودية", capital: "الرياض", options: ["الرياض", "جدة", "مكة المكرمة", "الدمام"] }
];

const hazirData = [{ riddle: "ما هو الشيء الذي أبيض من السن وأسود من الليل؟", correct: "خط القران" }];

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

client.once('ready', async () => {
    console.log(`تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);

    const commands = [
        new SlashCommandBuilder().setName('help').setDescription('عرض قائمة الألعاب والأوامر'),
        new SlashCommandBuilder().setName('clear').setDescription('مسح الشات مع الحفاظ على المثبتة')
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, 'YOUR_SERVER_ID'), // ضع آيدي سيرفرك هنا
            { body: commands },
        );
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'help') {
        const helpEmbed = new EmbedBuilder().setTitle('🎮 قائمة ألعاب البوت التفاعلية والأوامر').setColor(0x5865F2);
        await interaction.reply({ embeds: [helpEmbed] });
    }

    if (interaction.commandName === 'clear') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: '❌ ليس لديك صلاحية لإدارة الرسائل!', ephemeral: true });
        }
        await interaction.deferReply({ ephemeral: true });
        try {
            const fetchedMessages = await interaction.channel.messages.fetch({ limit: 100 });
            const messagesToDelete = fetchedMessages.filter(msg => !msg.pinned);
            if (messagesToDelete.size === 0) return interaction.editReply('❌ لا توجد رسائل غير مثبتة.');
            await interaction.channel.bulkDelete(messagesToDelete, true);
            await interaction.editReply('✅ تم مسح الشات بنجاح.');
        } catch (error) {
            await interaction.editReply('❌ حدث خطأ.');
        }
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content === '!clear') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply('❌ ليس لديك صلاحية!');
        try {
            const fetched = await message.channel.messages.fetch({ limit: 100 });
            const toDel = fetched.filter(msg => !msg.pinned);
            if (toDel.size === 0) return message.reply('❌ لا توجد رسائل غير مثبتة.');
            await message.channel.bulkDelete(toDel, true);
            const conf = await message.channel.send('✅ تم مسح الشات.');
            setTimeout(() => conf.delete().catch(() => {}), 4000);
        } catch (e) { message.reply('❌ حدث خطأ.'); }
        return;
    }

    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('🎮 قائمة ألعاب البوت التفاعلية والأوامر')
            .addFields(
                { name: '❌ إكس أو', value: '`!xo @الشخص`', inline: true },
                { name: '🟡 أربع على الحواف', value: '`!اربع @الشخص`', inline: true },
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
            .setColor(0x5865F2);
        return message.reply({ embeds: [helpEmbed] });
    }

    // 1. إكس أو
    if (message.content.startsWith('!xo')) {
        let opponent = message.mentions.users.first();
        if (!opponent) return message.reply('❌ يجب عليك منشن شخص لتبدأ معه! مثال: `!xo @الشخص`');
        if (opponent.bot || opponent.id === message.author.id) return message.reply('❌ لا يمكنك اللعب مع بوت أو نفسك!');

        const inviteEmbed = new EmbedBuilder().setTitle('🎮 تحدي إكس أو ❌⭕').setDescription(`لقد تحداك <@${message.author.id}>!\nهل توافق يا <@${opponent.id}>؟`).setColor(0x5865F2);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('xo_acc').setLabel('وافق').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('xo_dec').setLabel('رفض').setStyle(ButtonStyle.Danger)
        );

        const msg = await message.reply({ content: `<@${opponent.id}>`, embeds: [inviteEmbed], components: [row] });
        const col = msg.createMessageComponentCollector({ time: 60000 });

        col.on('collect', async i => {
            if (i.user.id !== opponent.id) return i.reply({ content: '❌ التحدي ليس لك!', ephemeral: true });
            if (i.customId === 'xo_dec') {
                col.stop();
                return await i.update({ embeds: [new EmbedBuilder().setTitle('❌ تم رفض التحدي')], components: [] });
            }
            col.stop();

            let board = Array(9).fill(null);
            let turn = message.author.id;

            const getBoardRows = (b) => {
                let rows = [];
                for (let r = 0; r < 3; r++) {
                    let row = new ActionRowBuilder();
                    for (let c = 0; c < 3; c++) {
                        let idx = r * 3 + c;
                        let lbl = b[idx] === 'X' ? '❌' : b[idx] === 'O' ? '⭕' : '➖';
                        let sty = b[idx] === 'X' ? ButtonStyle.Danger : b[idx] === 'O' ? ButtonStyle.Primary : ButtonStyle.Secondary;
                        row.addComponents(new ButtonBuilder().setCustomId(`xb_${idx}`).setLabel(lbl).setStyle(sty).setDisabled(b[idx] !== null));
                    }
                    rows.push(row);
                }
                return rows;
            };

            const checkWinner = (b) => {
                const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
                for (let w of wins) {
                    if (b[w[0]] && b[w[0]] === b[w[1]] && b[w[0]] === b[w[2]]) return b[w[0]];
                }
                return b.every(c => c !== null) ? 'tie' : null;
            };

            const gEmbed = new EmbedBuilder().setTitle('❌ لعبة إكس أو ⭕').setDescription(`دور: <@${turn}> (❌)`).setColor(0x5865F2);
            await i.update({ embeds: [gEmbed], components: getBoardRows(board) });

            const gCol = msg.createMessageComponentCollector({ time: 300000 });
            gCol.on('collect', async gInt => {
                if (!gInt.customId.startsWith('xb_')) return;
                if (gInt.user.id !== message.author.id && gInt.user.id !== opponent.id) return gInt.reply({ content: '❌ مباراة لا تخصك!', ephemeral: true });
                if (gInt.user.id !== turn) return gInt.reply({ content: '❌ ليس دورك!', ephemeral: true });

                const idx = parseInt(gInt.customId.split('_')[1]);
                board[idx] = (turn === message.author.id) ? 'X' : 'O';

                let win = checkWinner(board);
                if (win) {
                    gCol.stop();
                    let res = win === 'tie' ? '🤝 تعادلتما!' : `🎉 الفائز: <@${turn}>`;
                    gEmbed.setDescription(`انتهت اللعبة!\n\n${res}`);
                    return await gInt.update({ embeds: [gEmbed], components: getBoardRows(board) });
                }

                turn = (turn === message.author.id) ? opponent.id : message.author.id;
                gEmbed.setDescription(`دور: <@${turn}> (${turn === message.author.id ? '❌' : '⭕'})`);
                await gInt.update({ embeds: [gEmbed], components: getBoardRows(board) });
            });
        });
        return;
    }

    // 2. أربع على الحواف
    if (message.content.startsWith('!اربع')) {
        let opponent = message.mentions.users.first();
        if (!opponent) return message.reply('❌ منشن شخص لتبدأ معه! مثال: `!اربع @الشخص`');
        if (opponent.bot || opponent.id === message.author.id) return message.reply('❌ لا يمكنك اللعب مع نفسك أو بوت!');
        
        const inviteMsg = await message.reply({ content: `<@${opponent.id}>`, embeds: [new EmbedBuilder().setTitle('🟡 تحدي أربع على الحواف').setDescription(`تحدي من <@${message.author.id}>`).setColor(0x5865F2)], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('cf_ok').setLabel('وافق').setStyle(ButtonStyle.Success), new ButtonBuilder().setCustomId('cf_no').setLabel('رفض').setStyle(ButtonStyle.Danger))] });
        const col = inviteMsg.createMessageComponentCollector({ time: 60000 });
        col.on('collect', async i => {
            if (i.user.id !== opponent.id) return i.reply({ content: '❌ ليس لك!', ephemeral: true });
            if (i.customId === 'cf_no') return i.update({ embeds: [new EmbedBuilder().setTitle('❌ تم الرفض')], components: [] });
            col.stop();
            await i.update({ content: '🎮 تبدأ اللعبة...', embeds: [], components: [] });
            new ConnectFour({ message: inviteMsg, slash_command: false, opponent: opponent, embed: { title: 'أربع على الحواف', color: '#5865F2' }, mentionUser: true }).startGame();
        });
        return;
    }

    // 3. حجر ورق مقص
    if (message.content.startsWith('!rps')) {
        let opponent = message.mentions.users.first();
        if (!opponent) return message.reply('❌ منشن شخص لتبدأ معه! مثال: `!rps @الشخص`');
        if (opponent.bot || opponent.id === message.author.id) return message.reply('❌ لا يمكنك اللعب مع نفسك أو بوت!');

        const inviteMsg = await message.reply({ content: `<@${opponent.id}>`, embeds: [new EmbedBuilder().setTitle('✂️ تحدي حجر ورق مقص').setDescription(`تحدي من <@${message.author.id}>`).setColor(0x5865F2)], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('rps_ok').setLabel('وافق').setStyle(ButtonStyle.Success), new ButtonBuilder().setCustomId('rps_no').setLabel('رفض').setStyle(ButtonStyle.Danger))] });
        const col = inviteMsg.createMessageComponentCollector({ time: 60000 });
        col.on('collect', async i => {
            if (i.user.id !== opponent.id) return i.reply({ content: '❌ ليس لك!', ephemeral: true });
            if (i.customId === 'rps_no') return i.update({ embeds: [new EmbedBuilder().setTitle('❌ تم الرفض')], components: [] });
            col.stop();
            await i.update({ content: '🎮 تبدأ اللعبة...', embeds: [], components: [] });
            new RockPaperScissors({ message: inviteMsg, slash_command: false, opponent: opponent, embed: { title: 'حجر ورق مقص', color: '#5865F2' }, mentionUser: true }).startGame();
        });
        return;
    }

    // 4. تخمين الرقم
    if (message.content === '!تخمين') {
        const targetNumber = Math.floor(Math.random() * 20) + 1;
        await message.reply({ embeds: [new EmbedBuilder().setTitle('🔢 تخمين الرقم').setDescription('خمن رقماً بين **1 و 20** واكتبه في الشات! أمامك 30 ثانية.').setColor(0x5865F2)] });
        
        const col = message.channel.createMessageCollector({ filter: m => m.author.id === message.author.id, time: 30000, max: 1 });
        col.on('collect', m => {
            const guess = parseInt(m.content);
            if (guess === targetNumber) {
                message.channel.send(`🎉 كفو <@${message.author.id}>! الرقم الصحيح هو **${targetNumber}**.`);
            } else {
                message.channel.send(`❌ خطأ! الرقم الصحيح كان **${targetNumber}**.`);
            }
        });
    }

    // 5. تحدي السرعة
    if (message.content === '!سريع') {
        const msg = await message.reply({ embeds: [new EmbedBuilder().setTitle('⚡ تحدي السرعة').setDescription('اضغط على الزر بأسرع ما يمكن!').setColor(0x5865F2)], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('click_fast').setLabel('اضغط بسرعة!').setStyle(ButtonStyle.Success))] });
        
        const startTime = Date.now();
        const col = msg.createMessageComponentCollector({ time: 10000, max: 1 });
        col.on('collect', async i => {
            const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
            await i.update({ content: `🏆 كفو <@${i.user.id}> فزت بالسرعة خلال **${timeTaken}** ثانية!`, embeds: [], components: [] });
        });
        col.on('end', collected => {
            if (collected.size === 0) msg.edit({ content: '⏰ انتهى الوقت ولم يضغط أحد!', components: [] }).catch(() => {});
        });
    }

    // 6. الحظ
    if (message.content === '!حظ') {
        const items = ['🍇', '🍊', '🍋', '🍌', '🍍', '🍒', '⭐'];
        const r1 = items[Math.floor(Math.random() * items.length)];
        const r2 = items[Math.floor(Math.random() * items.length)];
        const r3 = items[Math.floor(Math.random() * items.length)];

        let resultText = (r1 === r2 && r2 === r3) ? '🎉 مبروك فزت بالجائزة الكبرى!' : '❌ هاردلك، لم تتطابق الرموز!';
        const embed = new EmbedBuilder().setTitle('🎰 الحظ السعيد').setDescription(`**[ ${r1} | ${r2} | ${r3} ]**\n\n${resultText}`).setColor(0x5865F2);
        await message.reply({ embeds: [embed] });
    }

    // 7. الأسئلة
    if (message.content === '!اسئلة') {
        const q = triviaData[Math.floor(Math.random() * triviaData.length)];
        const opts = shuffleArray([...q.options]);
        const row = new ActionRowBuilder();
        opts.forEach((o, i) => row.addComponents(new ButtonBuilder().setCustomId(`t_${i}`).setLabel(o).setStyle(ButtonStyle.Primary)));
        const msg = await message.reply({ embeds: [new EmbedBuilder().setTitle('❓ أسئلة متنوعة').setDescription(`**${q.question}**`).setColor(0x5865F2)], components: [row] });
        const col = msg.createMessageComponentCollector({ time: 30000 });
        col.on('collect', async i => {
            if (i.user.id !== message.author.id) return i.reply({ content: '❌ ليست لك!', ephemeral: true });
            if (i.component.label === q.correct) {
                await i.update({ content: `🎉 إجابة صحيحة يا <@${i.user.id}>! الإجابة هي **${q.correct}**`, components: [] });
            } else {
                await i.update({ content: `❌ إجابة خاطئة يا <@${i.user.id}>! الصحيحة هي **${q.correct}**`, components: [] });
            }
            col.stop();
        });
    }

    // 8. الأعلام
    if (message.content === '!اعلام') {
        const d = flagsGameData[Math.floor(Math.random() * flagsGameData.length)];
        const opts = shuffleArray([...d.options]);
        const row = new ActionRowBuilder();
        opts.forEach((o, i) => row.addComponents(new ButtonBuilder().setCustomId(`f_${i}`).setLabel(o).setStyle(ButtonStyle.Primary)));
        const msg = await message.reply({ embeds: [new EmbedBuilder().setTitle('🌍 أعلام').setDescription(`ما هي الدولة?\n\n# ${d.flag}`).setColor(0x5865F2)], components: [row] });
        const col = msg.createMessageComponentCollector({ time: 30000 });
        col.on('collect', async i => {
            if (i.user.id !== message.author.id) return i.reply({ content: '❌ ليست لك!', ephemeral: true });
            await i.update({ content: `🎉 صحيح! **${d.country}** ${d.flag}`, components: [] });
            col.stop();
        });
    }

    // 9. العواصم
    if (message.content === '!عواصم') {
        const c = capitalsGameData[Math.floor(Math.random() * capitalsGameData.length)];
        const opts = shuffleArray([...c.options]);
        const row = new ActionRowBuilder();
        opts.forEach((o, i) => row.addComponents(new ButtonBuilder().setCustomId(`c_${i}`).setLabel(o).setStyle(ButtonStyle.Primary)));
        const msg = await message.reply({ embeds: [new EmbedBuilder().setTitle('🏛️ عواصم').setDescription(`عاصمة **${c.country}**؟`).setColor(0x5865F2)], components: [row] });
        const col = msg.createMessageComponentCollector({ time: 30000 });
        col.on('collect', async i => {
            if (i.user.id !== message.author.id) return i.reply({ content: '❌ ليست لك!', ephemeral: true });
            await i.update({ content: `🎉 صحيح! **${c.capital}**`, components: [] });
            col.stop();
        });
    }

    // 10. فكك
    if (message.content === '!فكك') {
        const f = fakkData[Math.floor(Math.random() * fakkData.length)];
        await message.reply({ embeds: [new EmbedBuilder().setTitle('🧩 فكك').setDescription(`فكك الكلمة التالية:\n\n# ${f.spaced}`).setColor(0x5865F2)] });
        const col = message.channel.createMessageCollector({ filter: r => r.author.id === message.author.id, time: 30000, max: 1 });
        col.on('collect', r => {
            if (r.content.trim() === f.word) {
                message.channel.send(`🎉 كفو <@${r.author.id}> إجابة صحيحة: **${f.word}**`);
            } else {
                message.channel.send(`❌ خطأ يا <@${r.author.id}>! الإجابة الصحيحة: **${f.word}**`);
            }
        });
    }

    // 11. ركب
    if (message.content === '!ركب') {
        const r = rakibData[Math.floor(Math.random() * rakibData.length)];
        await message.reply({ embeds: [new EmbedBuilder().setTitle('🔤 ركب').setDescription(`ركب الحروف التالية:\n\n# ${r.scrambled}`).setColor(0x5865F2)] });
        const col = message.channel.createMessageCollector({ filter: resp => resp.author.id === message.author.id, time: 30000, max: 1 });
        col.on('collect', resp => {
            if (resp.content.trim() === r.correct) {
                message.channel.send(`🎉 كفو <@${resp.author.id}> إجابة صحيحة: **${r.correct}**`);
            } else {
                message.channel.send(`❌ خطأ يا <@${resp.author.id}>! الإجابة الصحيحة: **${r.correct}**`);
            }
        });
    }

    // 12. حزر
    if (message.content === '!حزر') {
        const h = hazirData[0];
        await message.reply({ embeds: [new EmbedBuilder().setTitle('🧠 حزر').setDescription(`اللغز:\n\n# "${h.riddle}"`).setColor(0x5865F2)] });
        const col = message.channel.createMessageCollector({ filter: resp => resp.author.id === message.author.id, time: 30000, max: 1 });
        col.on('collect', resp => {
            message.channel.send(resp.content.trim() === h.correct ? `🎉 صح: **${h.correct}**` : `❌ خطأ! الصحيح: **${h.correct}**`);
        });
    }
});

client.login(process.env.TOKEN);
