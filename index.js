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
const { ConnectFour, RockPaperScissors, GuessTheNumber, QuickClick, Slot } = require('discord-gamecord');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('error', (error) => {
    console.error('خطأ في اتصال البوت:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('خطأ غير معالج:', error);
});

process.on('uncaughtException', (error) => {
    console.error('استثناء غير معالج:', error);
});

// قواعد البيانات
const flagsGameData = [
    { country: "المملكة العربية السعودية", flag: "🇸🇦", options: ["المملكة العربية السعودية", "الإمارات العربية المتحدة", "الكويت", "قطر"] },
    { country: "اليابان", flag: "🇯🇵", options: ["الصين", "اليابان", "كوريا الجنوبية", "فيتنام"] },
    { country: "البرازيل", flag: "🇧🇷", options: ["الأرجنتين", "البرازيل", "البرتغال", "إسبانيا"] }
];

const capitalsGameData = [
    { country: "المملكة العربية السعودية", capital: "الرياض", options: ["الرياض", "جدة", "مكة المكرمة", "الدمام"] },
    { country: "الإمارات العربية المتحدة", capital: "أبوظبي", options: ["دبي", "أبوظبي", "الشارقة", "عجمان"] }
];

const fakkData = [{ word: "مكتبة", spaced: "م ك ت ب ة" }, { word: "حاسب", spaced: "ح ا س ب" }];
const rakibData = [{ scrambled: "س م ك", correct: "سمك" }, { scrambled: "ق م ر", correct: "قمر" }];
const hazirData = [{ riddle: "ما هو الشيء الذي أبيض من السن وأسود من الليل؟", correct: "خط القران" }];
const triviaData = [{ question: "ما هو أعلى حزام في التايكوندو؟", correct: "الأسود", options: ["الأخضر", "الأحمر", "الأبيض", "الأسود"] }];

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
        console.log('تم تسجيل أوامر السلاش بنجاح!');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('🎮 قائمة ألعاب البوت التفاعلية والأوامر')
            .setDescription('اختر لعبتك المفضلة أو الأمر:')
            .setColor(0x5865F2);
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
            if (messagesToDelete.size === 0) {
                return interaction.editReply('❌ لا توجد رسائل غير مثبتة ليتم مسحها.');
            }
            await interaction.channel.bulkDelete(messagesToDelete, true);
            await interaction.editReply('✅ تم مسح الشات بنجاح (مع الحفاظ على الرسائل المثبتة).');
        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ حدث خطأ أثناء مسح الرسائل.');
        }
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // مسح الشات
    if (message.content === '!clear') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('❌ ليس لديك صلاحية لإدارة الرسائل!');
        }
        try {
            const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });
            const messagesToDelete = fetchedMessages.filter(msg => !msg.pinned);
            if (messagesToDelete.size === 0) {
                return message.reply('❌ لا توجد رسائل غير مثبتة ليتم مسحها.');
            }
            await message.channel.bulkDelete(messagesToDelete, true);
            const confirmation = await message.channel.send('✅ تم مسح الشات بنجاح (مع الحفاظ على الرسائل المثبتة).');
            setTimeout(() => confirmation.delete().catch(() => {}), 4000);
        } catch (error) {
            console.error(error);
            message.reply('❌ حدث خطأ أثناء مسح الرسائل.');
        }
        return;
    }

    // قائمة الـ help
    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('🎮 قائمة ألعاب البوت التفاعلية والأوامر')
            .addFields(
                { name: '❌ إكس أو', value: '`!xo @الشخص`', inline: true },
                { name: '🟡 أربع على الحواف', value: '`!اربع`', inline: true },
                { name: '✂️ حجر ورق مقص', value: '`!rps`', inline: true },
                { name: '🔢 تخمين الرقم', value: '`!تخمين`', inline: true },
                { name: '⚡ تحدي السرعة', value: '`!سريع`', inline: true },
                { name: '🎰 الحظ السعيد', value: '`!حظ`', inline: true }
            )
            .setColor(0x5865F2);
        return message.reply({ embeds: [helpEmbed] });
    }

    // ألعاب Gamecord المحدثة بالشكل الصحيح
    if (message.content === '!اربع') {
        const game = new ConnectFour({
            message: message,
            slash_command: false,
            opponent: message.mentions.users.first() || message.author,
            embed: { title: 'أربع على الحواف', color: '#5865F2' },
            emojis: { board: '⚪', player1: '🔴', player2: '🟡' },
            mentionUser: true,
            timeoutTime: 300000,
            buttonStyle: 'PRIMARY',
            turnMessage: 'دور اللاعب: {emoji}',
            winMessage: 'الفائز باللعبة هو {player}!',
            tieMessage: 'انتهت اللعبة تعادلاً!',
            timeoutMessage: 'انتهى الوقت!',
            playerOnlyMessage: 'هذه اللعبة ليست مخصصة لك!'
        });
        return game.startGame();
    }

    if (message.content === '!rps') {
        const game = new RockPaperScissors({
            message: message,
            slash_command: false,
            opponent: message.mentions.users.first() || message.author,
            embed: { title: 'حجر ورق مقص', color: '#5865F2' },
            mentionUser: true,
            timeoutTime: 300000,
            buttonStyle: 'PRIMARY',
            pickMessage: 'اختر حجر أو ورقة أو مقص!',
            winMessage: 'الفائز هو {player}!',
            tieMessage: 'تعادل!',
            timeoutMessage: 'انتهى الوقت!',
            playerOnlyMessage: 'اللعبة ليست لك!'
        });
        return game.startGame();
    }

    if (message.content === '!تخمين') {
        const game = new GuessTheNumber({
            message: message,
            slash_command: false,
            embed: { title: 'تخمين الرقم', color: '#5865F2' },
            timeoutTime: 300000,
            hostedBy: message.author,
            buttonStyle: 'PRIMARY',
            successMessage: 'كفو! الرقم الصحيح هو **{number}**.',
            timeoutMessage: 'انتهى الوقت ولم تخمن الرقم!',
            playerOnlyMessage: 'اللعبة ليست لك!'
        });
        return game.startGame();
    }

    if (message.content === '!سريع') {
        const game = new QuickClick({
            message: message,
            slash_command: false,
            embed: { title: 'تحدي السرعة', color: '#5865F2' },
            timeoutTime: 300000,
            hostedBy: message.author,
            buttonStyle: 'PRIMARY',
            successMessage: 'أسرع واحد هو {player} خلال {time} ثانية!',
            timeoutMessage: 'ما أحد اضغط في الوقت المناسب!'
        });
        return game.startGame();
    }

    if (message.content === '!حظ') {
        const game = new Slot({
            message: message,
            slash_command: false,
            embed: { title: 'لعبة الحظ', color: '#5865F2' },
            timeoutTime: 300000,
            hostedBy: message.author,
            slots: ['🍇', '🍊', '🍋', '🍌', '🍍']
        });
        return game.startGame();
    }
});

client.login(process.env.TOKEN);
