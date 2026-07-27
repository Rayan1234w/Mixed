const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, REST, Routes } = require('discord.js');
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
// قاعدة البيانات الضخمة (40 سؤال/جملة لكل لعبة)
// ==========================================

// 1. لعبة فكك (40 كلمة)
const fakkData = [
    { word: "مكتبة", spaced: "م ك ت ب ة" }, { word: "حاسوب", spaced: "ح ا س و ب" }, 
    { word: "مدرسة", spaced: "م د ر س ة" }, { word: "برمجة", spaced: "ب ر م ج ة" }, 
    { word: "الرياض", spaced: "ا ل ر ي ا ض" }, { word: "ديسكورد", spaced: "د ي س ك و ر د" },
    { word: "سيارة", spaced: "س ي ا ر ة" }, { word: "طائرة", spaced: "ط ا ئ ر ة" },
    { word: "قميص", spaced: "ق م ي ص" }, { word: "جامعة", spaced: "ج ا م ع ة" },
    { word: "مهندس", spaced: "م ه ن د س" }, { word: "طبيب", spaced: "ط ب ي ب" },
    { word: "رياضيات", spaced: "ر ي ا ض ي ا ت" }, { word: "فيزياء", spaced: "ف ي ز ي ا ء" },
    { word: "تاريخ", spaced: "ت ا ر ي خ" }, { word: "جغرافيا", spaced: "ج غ ر ا ف ي ا" },
    { word: "مستشفى", spaced: "م س ت ش ف ى" }, { word: "ملعب", spaced: "م ل ع ب" },
    { word: "حديقة", spaced: "ح د ي ق ة" }, { word: "شاطئ", spaced: "ش ا ط ئ" },
    { word: "قممر", spaced: "ق م ر" }, { word: "شمس", spaced: "ش م س" },
    { word: "نجوم", spaced: "ن ج و م" }, { word: "محيط", spaced: "م ح ي ط" },
    { word: "صحراء", spaced: "ص ح ر ا ء" }, { word: "جبل", spaced: "ج ب ل" },
    { word: "نهر", spaced: "ن ه ر" }, { word: "بحر", spaced: "ب ح ر" },
    { word: "سماء", spaced: "س م ا ء" }, { word: "ارض", spaced: "ا ر ض" },
    { word: "قلم", spaced: "ق ل م" }, { word: "دفتري", spaced: "د ف ت ر ي" },
    { word: "سبورة", spaced: "س ب و ر ة" }, { word: "مفتاح", spaced: "م ف ت ا ح" },
    { word: "باب", spaced: "ب ا ب" }, { word: "نافذة", spaced: "ن ا ف ذ ة" },
    { word: "طاولة", spaced: "ط ا و ل ة" }, { word: "كرسي", spaced: "ك ر س ي" },
    { word: "ساعة", spaced: "س ا ع ة" }, { word: "هاتف", spaced: "ه ا ت ف" }
];

// 2. لعبة الأسئلة العامة (40 سؤالاً)
const triviaData = [
    { question: "ما هي عاصمة المملكة العربية السعودية؟", correct: "الرياض", options: ["جدة", "الرياض", "الدمام", "مكة"] },
    { question: "ما هي عاصمة الإمارات العربية المتحدة؟", correct: "أبوظبي", options: ["دبي", "أبوظبي", "الشارقة", "عجمان"] },
    { question: "كم عدد سور القرآن الكريم؟", correct: "114", options: ["112", "113", "114", "115"] },
    { question: "ما هو أكبر كوكب في المجموعة الشمسية؟", correct: "المشتري", options: ["المريخ", "زحل", "المشتري", "الأرض"] },
    { question: "في اي قارة تقع مصر؟", correct: "أفريقيا", options: ["أفريقيا", "آسيا", "أوروبا", "أستراليا"] },
    { question: "ما هو عنصر الذهب في الجدول الدوري؟", correct: "Au", options: ["Ag", "Au", "Fe", "Cu"] },
    { question: "كم عدد ركعات صلاة الفجر؟", correct: "2", options: ["1", "2", "3", "4"] },
    { question: "ما هي عاصمة الكويت؟", correct: "الكويت", options: ["الجهراء", "الكويت", "السالمية", "حولي"] },
    { question: "ما هو الحيوان الذي يُسمى أبا الحارث؟", correct: "الأسد", options: ["النمر", "الأسد", "الفهد", "الذئب"] },
    { question: "من هو النبي الذي أُلقي في النار؟", correct: "إبراهيم", options: ["موسى", "إبراهيم", "عيسى", "نوح"] },
    { question: "ما هي عاصمة سلطنة عمان؟", correct: "مسقط", options: ["صلالة", "مسقط", "نزوى", "صُحار"] },
    { question: "كم عدد الألوان الأساسية في قوس قزح؟", correct: "7", options: ["5", "6", "7", "8"] },
    { question: "ما هو أسرع حيوان بري في العالم؟", correct: "الفهد", options: ["الأسد", "الفهد", "الحصان", "الغزال"] },
    { question: "ما هي عاصمة البحرين؟", correct: "المنامة", options: ["المحرق", "المنامة", "الرفاع", "الاستقلال"] },
    { question: "ما هي عاصمة قطر؟", correct: "الدوحة", options: ["الخور", "الوكرة", "الدوحة", "لوسيل"] },
    { question: "ما هو الغاز الأكثر إحاطة بكوكب الأرض؟", correct: "النيتروجين", options: ["الأكسجين", "النيتروجين", "الهيدروجين", "ثاني أكسيد الكربون"] },
    { question: "ما هي عاصمة الأردن؟", correct: "عمان", options: ["إربد", "عمان", "الزرقاء", "العقبة"] },
    { question: "في أي سنة هجرية وقعت غزوة بدر؟", correct: "2", options: ["1", "2", "3", "4"] },
    { question: "ما هي عاصمة العراق؟", correct: "بغداد", options: ["البصرة", "الموصل", "بغداد", "أربيل"] },
    { question: "كم عدد أركان الإسلام؟", correct: "5", options: ["3", "4", "5", "6"] },
    { question: "ما هي عاصمة سوريا؟", correct: "دمشق", options: ["حلب", "دمشق", "حمص", "اللاذقية"] },
    { question: "ما هو أطول نهر في العالم؟", correct: "نهر النيل", options: ["نهر الأمازون", "نهر النيل", "نهر الميسيسبي", "نهر الدانوب"] },
    { question: "ما هي عاصمة لبنان؟", correct: "بيروت", options: ["طرابلس", "بيروت", "صيدا", "جبيل"] },
    { question: "كم عدد أركان الإيمان؟", correct: "6", options: ["4", "5", "6", "7"] },
    { question: "ما هي عاصمة تونس؟", correct: "تونس", options: ["صفاقس", "سوسة", "تونس", "بنزرت"] },
    { question: "ما هو المعدن السائل في درجة حرارة الغرفة؟", correct: "الزئبق", options: ["الذهب", "الزئبق", "الفضة", "النحاس"] },
    { question: "ما هي عاصمة المغرب؟", correct: "الرباط", options: ["الدار البيضاء", "مراكش", "الرباط", "فاس"] },
    { question: "كم عدد الصلوات المفروضة في اليوم والليلة؟", correct: "5", options: ["3", "4", "5", "6"] },
    { question: "ما هي عاصمة الجزائر؟", correct: "الجزائر", options: ["وهران", "الجزائر", "قسنطينة", "عنابة"] },
    { question: "ما هي عاصمة فلسطين؟", correct: "القدس", options: ["غزة", "القدس", "رام الله", "نابلس"] },
    { question: "ما هي عاصمة اليمن؟", correct: "صنعاء", options: ["عدن", "صنعاء", "تعز", "إب"] },
    { question: "من هو أول الخلفاء الراشدين؟", correct: "أبو بكر الصديق", options: ["عمر بن الخطاب", "عثمان بن عفان", "أبو بكر الصديق", "علي بن أبي طالب"] },
    { question: "ما هي عاصمة السودان؟", correct: "الخرطوم", options: ["أم درمان", "الخرطوم", "بورتسودان", "كسلا"] },
    { question: "كم عدد أجزاء القرآن الكريم؟", correct: "30", options: ["20", "25", "30", "40"] },
    { question: "ما هي عاصمة ليبيا؟", correct: "طرابلس", options: ["بنغازي", "طرابلس", "مصراتة", "سبها"] },
    { question: "ما هي عاصمة موريتانيا؟", correct: "نواكشوط", options: ["الزبديرات", "نواكشوط", "الروصو", "ازويرات"] },
    { question: "ما هي عاصمة الصومال؟", correct: "مقديشو", options: ["بربرة", "مقديشو", "بورسعيد", "كسمايو"] },
    { question: "ما هو الحيوان المعروف بصديق الإنسان؟", correct: "الكلب", options: ["القط", "الكلب", "الحصان", "الدلفين"] },
    { question: "ما هي عاصمة جيبوتي؟", correct: "جيبوتي", options: ["علي صبيح", "جيبوتي", "تادجورة", "أبو عريش"] },
    { question: "في اي دولة تقع أهرامات الجيزة؟", correct: "مصر", options: ["السودان", "مصر", "العراق", "المغرب"] }
];

// 3. لعبة عواصم (40 سؤالاً)
const cairoData = [
    { country: "فرنسا", capital: "باريس" }, { country: "إيطاليا", capital: "روما" },
    { country: "إسبانيا", capital: "مدريد" }, { country: "ألمانيا", capital: "برلين" },
    { country: "المملكة المتحدة", capital: "لندن" }, { country: "اليابان", capital: "طوكيو" },
    { country: "الصين", capital: "بكين" }, { country: "كوريا الجنوبية", capital: "سيول" },
    { country: "روسيا", capital: "موسكو" }, { country: "الولايات المتحدة", capital: "واشنطن" },
    { country: "كندا", capital: "أوتاوا" }, { country: "البرازيل", capital: "برازيليا" },
    { country: "الأرجنتين", capital: "بوينس آيرس" }, { country: "تركيا", capital: "أنقرة" },
    { country: "اليونان", capital: "أثينا" }, { country: "الهند", capital: "نيودلهي" },
    { country: "باكستان", capital: "إسلام آباد" }, { country: "إيران", capital: "طهران" },
    { country: "أستراليا", capital: "كانبيرا" }, { country: "جنوب أفريقيا", capital: "بريتوريا" },
    { country: "المكسيك", capital: "مكسيكو سيتي" }, { country: "السويد", capital: "ستوكهولم" },
    { country: "النرويج", capital: "أوسلو" }, { country: "فنتلندا", capital: "هلسنكي" },
    { country: "الدنمارك", capital: "كوبنهاغن" }, { country: "هولندا", capital: "أمستردام" },
    { country: "بلجيكا", capital: "بروكسل" }, { country: "سويسرا", capital: "برن" },
    { country: "النمسا", capital: "فيينا" }, { country: "البرتغال", capital: "لشبونة" },
    { country: "بولندا", capital: "وارسو" }, { country: "أوكرانيا", capital: "كييف" },
    { country: "المجر", capital: "بودابست" }, { country: "رومانيا", capital: "بوخارست" },
    { country: "إندونيسيا", capital: "جاكرتا" }, { country: "ماليزيا", capital: "كوالالمبور" },
    { country: "تايلاند", capital: "بانكوك" }, { country: "فيتنام", capital: "هانوي" },
    { country: "الفلبين", capital: "مانيلا" }, { country: "نيوزيلندا", capital: "ويلينغتون" }
];

// 4. لعبة ركب الحروف (40 جملة)
const rakabData = [
    { scrambled: "ة ك ت ب", correct: "مكتبة" }, { scrambled: "ب و س ح ا", correct: "حاسوب" },
    { scrambled: "ة ر د م س", correct: "مدرسة" }, { scrambled: "ة ج م ر ب", correct: "برمجة" },
    { scrambled: "ض ي ا ر ل ا", correct: "الرياض" }, { scrambled: "د ر و ك س ي د", correct: "ديسكورد" },
    { scrambled: "ة ر ا ي س", correct: "سيارة" }, { scrambled: "ة ر ا ئ ط", correct: "طائرة" },
    { scrambled: "ص م ي ق", correct: "قميص" }, { scrambled: "ة ع م ا ج", correct: "جامعة" },
    { scrambled: "س د ن ه م", correct: "مهندس" }, { scrambled: "ب ي ب ط", correct: "طبيب" },
    { scrambled: "ت ا ي ض ي ا ر", correct: "رياضيات" }, { scrambled: "ء ا ي ز ف", correct: "فيزياء" },
    { scrambled: "خ ي ر ت", correct: "تاريخ" }, { scrambled: "ا ف ر ج غ", correct: "جغرافيا" },
    { scrambled: "ى ف ش ت س م", correct: "مستشفى" }, { scrambled: "ب ع ل م", correct: "ملعب" },
    { scrambled: "ة ق ي د ح", correct: "حديقة" }, { scrambled: "ئ ط ا ش", correct: "شاطئ" },
    { scrambled: "ر م ق", correct: "قمر" }, { scrambled: "س م ش", correct: "شمس" },
    { scrambled: "م و ج ن", correct: "نجوم" }, { scrambled: "ط ي ح م", correct: "محيط" },
    { scrambled: "ء ا ر ح ص", correct: "صحراء" }, { scrambled: "ل ب ج", correct: "جبل" },
    { scrambled: "ر ه ن", correct: "نهر" }, { scrambled: "ر ح ب", correct: "بحر" },
    { scrambled: "ء ا م س", correct: "سماء" }, { scrambled: "ض ر ا", correct: "ارض" },
    { scrambled: "م ل ق", correct: "قلم" }, { scrambled: "ي ر ت ف د", correct: "دفتري" },
    { scrambled: "ة ر و ب س", correct: "سبورة" }, { scrambled: "ح ا ت ف م", correct: "مفتاح" },
    { scrambled: "ب ا ب", correct: "باب" }, { scrambled: "ة ذ ف ن", correct: "نافذة" },
    { scrambled: "ة ل و ط ا", correct: "طاولة" }, { scrambled: "ي س ر ك", correct: "كرسي" },
    { scrambled: "ة ع ا س", correct: "ساعة" }, { scrambled: "ف ت ه ه", correct: "هاتف" }
];

client.once('ready', async () => {
    console.log(`تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);

    const commands = [
        new SlashCommandBuilder().setName('help').setDescription('عرض قائمة ألعاب وبوت التفاعلية والأوامر'),
        new SlashCommandBuilder()
            .setName('rps')
            .setDescription('لعبة حجر ورق مقص مع شخص آخر')
            .addUserOption(option => option.setName('user').setDescription('الشخص الذي تريد تحديه').setRequired(true)),
        new SlashCommandBuilder().setName('تخمين').setDescription('لعبة تخمين الرقم'),
        new SlashCommandBuilder().setName('سريع').setDescription('تحدي السرعة والبرق'),
        new SlashCommandBuilder().setName('حظ').setDescription('ماكينة الحظ السعيد'),
        new SlashCommandBuilder().setName('اسئلة').setDescription('لعبة الأسئلة العامة'),
        new SlashCommandBuilder().setName('فكك').setDescription('لعبة تفكيك الكلمات'),
        new SlashCommandBuilder().setName('عواصم').setDescription('لعبة تخمين العواصم'),
        new SlashCommandBuilder().setName('ركب').setDescription('لعبة تركيب الحروف'),
        new SlashCommandBuilder().setName('مسح').setDescription('حذف الرسائل في الشات مع إبقاء الرسائل المثبتة فقط')
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log('جاري تسجيل أوامر السلاش (Slash Commands)...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('تم تسجيل أوامر السلاش بنجاح!');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('🎮 قائمة ألعاب وبوت التفاعلية والأوامر')
            .setDescription('اختر لعبتك المفضلة أو الأمر واكتبه في الشات (كل لعبة تحتوي على 40 سؤالاً/جملة متجددة!):')
            .addFields(
                { name: '✂️ حجر ورق مقص', value: '`/rps`', inline: true },
                { name: '🎰 الحظ السعيد', value: '`/حظ`', inline: true },
                { name: '⚡ تحدي السرعة', value: '`/سريع`', inline: true },
                { name: '🔢 تخمين الرقم', value: '`/تخمين`', inline: true },
                { name: '🏛️ لعبة العواصم', value: '`/عواصم`', inline: true },
                { name: '❓ لعبة الأسئلة', value: '`/اسئلة`', inline: true },
                { name: '🔤 لعبة ركب', value: '`/ركب`', inline: true },
                { name: '🧩 لعبة فكك', value: '`/فكك`', inline: true },
                { name: '🧹 مسح الشات', value: '`/مسح`', inline: true }
            )
            .setColor(0x00AE86)
            .setTimestamp();
        return await interaction.reply({ embeds: [helpEmbed] });
    }

    if (commandName === 'مسح') {
        if (!interaction.member.permissions.has('ManageMessages')) {
            return await interaction.reply({ content: '❌ ليس لديك صلاحية لإدارة الرسائل (Manage Messages)!', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const fetched = await interaction.channel.messages.fetch({ limit: 100 });
            // فلترة الرسائل لحذف غير المثبتة فقط
            const messagesToDelete = fetched.filter(msg => !msg.pinned);
            
            await interaction.channel.bulkDelete(messagesToDelete, true);
            await interaction.editReply(`✅ تم تنظيف الشات بنجاح مع الإبقاء على الرسائل المثبتة!`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ حدث خطأ أثناء مسح الرسائل (تأكد أن الرسائل ليست أقدم من أسبوعين).`);
        }
        return;
    }

    if (commandName === 'rps') {
        let opponent = interaction.options.getUser('user');
        if (opponent.bot || opponent.id === interaction.user.id) {
            return await interaction.reply({ content: '❌ لا يمكنك اللعب مع نفسك أو بوت!', ephemeral: true });
        }

        const inviteMsg = await interaction.reply({ 
            content: `<@${opponent.id}>`, 
            embeds: [new EmbedBuilder().setTitle('✂️ تحدي حجر ورق مقص').setDescription(`تحدي ممتع بين <@${interaction.user.id}> و <@${opponent.id}>`).setColor(0x00AE86)], 
            components: [new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('rps_ok').setLabel('موافق').setStyle(ButtonStyle.Success), 
                new ButtonBuilder().setCustomId('rps_no').setLabel('رفض').setStyle(ButtonStyle.Danger)
            )],
            fetchReply: true
        });

        const col = inviteMsg.createMessageComponentCollector({ time: 60000 });
        col.on('collect', async i => {
            if (i.user.id !== opponent.id) return await i.reply({ content: '❌ التحدي ليس موجهاً لك!', ephemeral: true });
            if (i.customId === 'rps_no') return await i.update({ embeds: [new EmbedBuilder().setTitle('❌ تم رفض التحدي').setColor(0xFF0000)], components: [] });
            col.stop();
            await i.update({ content: '🎮 تبدأ اللعبة الآن...', embeds: [], components: [] });
            new RockPaperScissors({ message: inviteMsg, slash_command: false, opponent: opponent, embed: { title: 'حجر ورق مقص', color: '#00AE86' }, mentionUser: true }).startGame();
        });
        return;
    }

    if (commandName === 'تخمين') {
        const secret = Math.floor(Math.random() * 100) + 1;
        let attempts = 10;
        await interaction.reply(`🔢 **لعبة تخمين الرقم!**\nاخترت رقماً بين **1 و 100**. لديك **${attempts}** محاولات.\nاكتب الرقم في الشات الآن!`);
        
        const filter = m => m.author.id === interaction.user.id && !isNaN(m.content);
        const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

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
                m.reply(`خطأ! الرقم **أكبر**! باقي لديك **${attempts}** محاولات.`);
            } else {
                await m.react('📉');
                m.reply(`خطأ! الرقم **أصغر**! باقي لديك **${attempts}** محاولات.`);
            }
        });
        return;
    }

    if (commandName === 'سريع') {
        const words = ["تفاح", "برمجة", "ديسكورد", "حاسوب", "تطبيقات", "سرعة", "تحدي", "برمجيات", "تقنية", "ذكاء"];
        const targetWord = words[Math.floor(Math.random() * words.length)];
        
        const embed = new EmbedBuilder()
            .setTitle('⚡ تحدي السرعة والبرق')
            .setDescription(`أسرع شخص يكتب هذه الكلمة في الشات يربح:\n\`\`\`${targetWord}\`\`\``)
            .setColor(0xF1C40F);
        
        await interaction.reply({ embeds: [embed] });
        
        const filter = m => !m.author.bot;
        const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

        collector.on('collect', m => {
            if (m.content === targetWord) {
                collector.stop();
                m.reply(`🎉 كفو <@${m.author.id}>! لقد فزت بالسرعة البارقة وكسبت التحدي! ⚡`);
            } else {
                m.reply(`❌ خطأ! الكلمة المطلوبة هي: \`${targetWord}\``);
            }
        });
        return;
    }

    if (commandName === 'حظ') {
        const emojis = ['🍒', '🍋', '🍊', '🍇', '🔔', '⭐'];
        const r1 = emojis[Math.floor(Math.random() * emojis.length)];
        const r2 = emojis[Math.floor(Math.random() * emojis.length)];
        const r3 = emojis[Math.floor(Math.random() * emojis.length)];

        const embed = new EmbedBuilder()
            .setTitle('🎰 ماكينة الحظ السعيد')
            .setDescription(`[ ${r1} | ${r2} | ${r3} ]\n\n` + (r1 === r2 && r2 === r3 ? '🎉 مبروك! لقد ربحت الجائزة الكبرى!' : '❌ هارد لك حظاً أوفر في المرة القادمة!'))
            .setColor(0x9B59B6);
        return await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'اسئلة') {
        const q = triviaData[Math.floor(Math.random() * triviaData.length)];
        const embed = new EmbedBuilder().setTitle('❓ سؤال وجواب (اكتب الإجابة في الشات)').setDescription(`${q.question}\n\nالخيارات المتاحة: \`${q.options.join(', ')}\``).setColor(0x3498DB);
        await interaction.reply({ embeds: [embed] });

        const filter = m => !m.author.bot;
        const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

        collector.on('collect', m => {
            if (m.content.trim() === q.correct) {
                collector.stop();
                m.reply(`✅ إجابة صحيحة وكفو يا <@${m.author.id}>!`);
            } else {
                m.reply(`❌ خطأ! الإجابة الصحيحة هي: **${q.correct}**`);
            }
        });
        return;
    }

    if (commandName === 'فكك') {
        const item = fakkData[Math.floor(Math.random() * fakkData.length)];
        const embed = new EmbedBuilder()
            .setTitle('🧩 لعبة تفكيك الكلمات')
            .setDescription(`فكك الكلمة التالية واكتبها بالحروف مفرقة:\n\`\`\`${item.word}\`\`\``)
            .setColor(0xE91E63);
        
        await interaction.reply({ embeds: [embed] });

        const filter = m => !m.author.bot;
        const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

        collector.on('collect', m => {
            if (m.content.trim() === item.spaced) {
                collector.stop();
                m.reply(`🎉 كفو <@${m.author.id}>! فككتها وصح عليك.`);
            } else {
                m.reply(`❌ خطأ! الإجابة الصحيحة مفككة هكذا: \`${item.spaced}\``);
            }
        });
        return;
    }

    if (commandName === 'عواصم') {
        const c = cairoData[Math.floor(Math.random() * cairoData.length)];
        const embed = new EmbedBuilder()
            .setTitle('🏛️ لعبة تخمين العواصم')
            .setDescription(`ما هي عاصمة دولة **${c.country}**؟ اكتب الإجابة في الشات!`)
            .setColor(0x1ABC9C);
        
        await interaction.reply({ embeds: [embed] });

        const filter = m => !m.author.bot;
        const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

        collector.on('collect', m => {
            if (m.content.trim() === c.capital) {
                collector.stop();
                m.reply(`🎉 كفو <@${m.author.id}>! العاصمة الصحيحة هي **${c.capital}**.`);
            } else {
                m.reply(`❌ خطأ! الإجابة الصحيحة هي: **${c.capital}**`);
            }
        });
        return;
    }

    if (commandName === 'ركب') {
        const r = rakabData[Math.floor(Math.random() * rakabData.length)];
        const embed = new EmbedBuilder()
            .setTitle('🔤 لعبة تركيب الحروف')
            .setDescription(`ركب الحروف التالية لتكون كلمة صحيحة:\n\`\`\`${r.scrambled}\`\`\``)
            .setColor(0xE67E22);
        
        await interaction.reply({ embeds: [embed] });

        const filter = m => !m.author.bot;
        const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

        collector.on('collect', m => {
            if (m.content.trim() === r.correct) {
                collector.stop();
                m.reply(`🎉 كفو <@${m.author.id}>! الكلمة الصحيحة هي **${r.correct}**.`);
            } else {
                m.reply(`❌ خطأ! الكلمة الصحيحة هي: **${r.correct}**`);
            }
        });
        return;
    }
});

client.login(process.env.TOKEN);
