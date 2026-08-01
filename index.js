const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, REST, Routes, PermissionFlagsBits, MessageFlags, AttachmentBuilder } = require('discord.js');
const { RockPaperScissors } = require('discord-gamecord');
const { createCanvas, loadImage } = require('canvas');

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
// قاعدة البيانات الضخمة (مُصححة بالكامل ومطابقة للحروف)
// ==========================================

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
    { word: "قمر", spaced: "ق م ر" }, { word: "شمس", spaced: "ش م س" },
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
    { question: "من هو النبي الذي أُلقي في النار؟", correct: "إبراهيم", options: ["موسى", "إبراهيم", "عيسى", "نوح"] }
];

const cairoData = [
    { country: "فرنسا", capital: "باريس" }, { country: "إيطاليا", capital: "روما" },
    { country: "إسبانيا", capital: "مدريد" }, { country: "ألمانيا", capital: "برلين" },
    { country: "المملكة المتحدة", capital: "لندن" }, { country: "اليابان", capital: "طوكيو" }
];

const flagsData = [
    { country: "فرنسا", flag: "🇫🇷" }, { country: "إيطاليا", flag: "🇮🇹" },
    { country: "إسبانيا", flag: "🇪🇸" }, { country: "ألمانيا", flag: "🇩🇪" }
];

const rakabData = [
    { scrambled: "م ك ت ب ة", correct: "مكتبة" }, { scrambled: "ح ا س و ب", correct: "حاسوب" },
    { scrambled: "م د ر س ة", correct: "مدرسة" }, { scrambled: "ب ر م ج ة", correct: "برمجة" }
];

client.once('ready', async () => {
    console.log(`تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);

    const commands = [
        new SlashCommandBuilder().setName('help').setDescription('عرض قائمة ألعاب وبوت التفاعلية والأوامر'),
        new SlashCommandBuilder().setName('nitro').setDescription('عرض بطاقة المهام والبروفايل الخاصة بك'),
        new SlashCommandBuilder().setName('نترو').setDescription('عرض بطاقة المهام والبروفايل الخاصة بك'),
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
        new SlashCommandBuilder().setName('اعلام').setDescription('لعبة تخمين الأعلام'),
        new SlashCommandBuilder().setName('ركب').setDescription('لعبة تركيب الحروف'),
        new SlashCommandBuilder()
            .setName('clear')
            .setDescription('مسح رسائل الشات الحالية')
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
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

// دالة لتوليد بطاقة بروفايل المهام (تشبه الصورة المطلوبة)
async function createNitroCard(user) {
    const canvas = createCanvas(800, 450);
    const ctx = canvas.getContext('2d');

    // الخلفية الداكنة
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // رسم الإطار الخارجي الخفيف
    ctx.strokeStyle = '#1f6feb';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // جلب صورة بروفايل المستخدم وتدلياتها الدائرية
    const avatarURL = user.displayAvatarURL({ extension: 'png', size: 256 });
    const avatar = await loadImage(avatarURL);

    ctx.save();
    ctx.beginPath();
    ctx.arc(400, 130, 60, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 340, 70, 120, 120);
    ctx.restore();

    // إطار دائرة البروفايل
    ctx.beginPath();
    ctx.arc(400, 130, 62, 0, Math.PI * 2, true);
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // كتابة اسم المستخدم
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(user.username, 400, 220);

    // خطوط مسار الشارات (Quests)
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(150, 300);
    ctx.lineTo(650, 300);
    ctx.stroke();

    // رسم بعض نقاط المستويات
    const nodes = [150, 230, 310, 390, 470, 550, 630];
    nodes.forEach((x, index) => {
        ctx.beginPath();
        ctx.arc(x, 300, 16, 0, Math.PI * 2);
        ctx.fillStyle = index === 2 ? '#00e5ff' : '#21262d';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = index === 2 ? '#ffffff' : '#484f58';
        ctx.stroke();
    });

    // النصوص السفلية
    ctx.fillStyle = '#8b949e';
    ctx.font = '16px sans-serif';
    ctx.fillText('الوقت المتبقي للشارة القادمة: 2 شهر و 14 يوم', 400, 365);

    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('التاريخ المستهدف: 2026-10-14', 400, 400);

    return canvas.toBuffer();
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('🎮 قائمة ألعاب وبوت التفاعلية والأوامر')
            .setDescription('اختر لعبتك المفضلة أو الأمر:')
            .addFields(
                { name: '🎟️ عرض بطاقة المهام', value: '`/nitro` أو `/نترو`', inline: true },
                { name: '✂️ حجر ورق مقص', value: '`/rps`', inline: true },
                { name: '🎰 الحظ السعيد', value: '`/حظ`', inline: true },
                { name: '⚡ تحدي السرعة', value: '`/سريع`', inline: true },
                { name: '🔢 تخمين الرقم', value: '`/تخمين`', inline: true },
                { name: '🌐 لعبة العواصم', value: '`/عواصم`', inline: true },
                { name: '🏴 لعبة الأعلام', value: '`/اعلام`', inline: true },
                { name: '❓ لعبة الأسئلة', value: '`/اسئلة`', inline: true },
                { name: '🔤 لعبة ركب', value: '`/ركب`', inline: true },
                { name: '🧩 لعبة فكك', value: '`/فكك`', inline: true }
            )
            .setColor(0x00AE86)
            .setTimestamp();
        return await interaction.reply({ embeds: [helpEmbed] });
    }

    if (commandName === 'nitro' || commandName === 'نيترو') {
        await interaction.deferReply();
        try {
            const buffer = await createNitroCard(interaction.user);
            const attachment = new AttachmentBuilder(buffer, { name: 'nitro-quest.png' });
            return await interaction.editReply({ files: [attachment] });
        } catch (error) {
            console.error(error);
            return await interaction.editReply({ content: '❌ حدث خطأ أثناء إنشاء بطاقة المهام.' });
        }
    }

    if (commandName === 'clear') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return await interaction.reply({ content: '❌ ليس لديك صلاحية لإدارة الرسائل!', flags: MessageFlags.Ephemeral });
        }

        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            const fetched = await interaction.channel.messages.fetch({ limit: 100 });
            const messagesToDelete = fetched.filter(msg => !msg.pinned);
            await interaction.channel.bulkDelete(messagesToDelete, true);
            await interaction.editReply({ content: '✅ تم مسح الرسائل بنجاح!' });
        } catch (error) {
            console.error(error);
            if (interaction.deferred) {
                await interaction.editReply({ content: '❌ حدث خطأ أثناء مسح الرسائل (تأكد أن الرسائل ليست أقدم من أسبوعين).' });
            }
        }
        return;
    }

    if (commandName === 'rps') {
        let opponent = interaction.options.getUser('user');
        if (opponent.bot || opponent.id === interaction.user.id) {
            return await interaction.reply({ content: '❌ لا يمكنك اللعب مع نفسك أو بوت!', flags: MessageFlags.Ephemeral });
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
            if (i.user.id !== opponent.id) return await i.reply({ content: '❌ التحدي ليس موجهاً لك!', flags: MessageFlags.Ephemeral });
            if (i.customId === 'rps_no') return await i.update({ embeds: [new EmbedBuilder().setTitle('❌ تم رفض التحدي').setColor(0xFF0000)], components: [] });
            col.stop();
            await i.update({ content: '🎮 تبدأ اللعبة الآن...', embeds: [], components: [] });
            new RockPaperScissors({ message: inviteMsg, slash_command: false, opponent: opponent, embed: { title: 'حجر ورق مقص', color: '#00AE86' }, mentionUser: true }).startGame();
        });
        return;
    }

    // بقية الألعاب (تخمين، سريع، حظ، اسئلة، فكك، عواصم، اعلام، ركب) تعمل كما هي في كودك السابق...
});

client.login(process.env.TOKEN);
