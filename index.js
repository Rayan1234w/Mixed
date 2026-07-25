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

// لمعالجة الأخطاء ومنع البوت من الانهيار
client.on('error', (error) => {
    console.error('خطأ في اتصال البوت:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('خطأ غير معالج (Unhandled Rejection):', error);
});

process.on('uncaughtException', (error) => {
    console.error('استثناء غير معالج (Uncaught Exception):', error);
});

// قواعد بيانات الألعاب
const flagsGameData = [
    { country: "المملكة العربية السعودية", flag: "🇸🇦", options: ["المملكة العربية السعودية", "الإمارات العربية المتحدة", "الكويت", "قطر"] },
    { country: "اليابان", flag: "🇯🇵", options: ["الصين", "اليابان", "كوريا الجنوبية", "فيتنام"] },
    { country: "البرازيل", flag: "🇧🇷", options: ["الأرجنتين", "البرازيل", "البرتغال", "إسبانيا"] },
    { country: "فرنسا", flag: "🇫🇷", options: ["إيطاليا", "ألمانيا", "فرنسا", "بلجيكا"] }
];

const capitalsGameData = [
    { country: "المملكة العربية السعودية", capital: "الرياض", options: ["الرياض", "جدة", "مكة المكرمة", "الدمام"] },
    { country: "الإمارات العربية المتحدة", capital: "أبوظبي", options: ["دبي", "أبوظبي", "الشارقة", "عجمان"] },
    { country: "مصر", capital: "القاهرة", options: ["الإسكندرية", "القاهرة", "الجيزة", "الأقصر"] }
];

const fakkData = [
    { word: "مكتبة", spaced: "م ك ت ب ة" },
    { word: "حاسب", spaced: "ح ا س ب" },
    { word: "برمجة", spaced: "ب ر م ج ة" }
];

const rakibData = [
    { scrambled: "س م ك", correct: "سمك" },
    { scrambled: "ق م ر", correct: "قمر" },
    { scrambled: "ش م س", correct: "شمس" }
];

const hazirData = [
    { riddle: "ما هو الشيء الذي أبيض من السن وأسود من الليل؟", correct: "خط القران" },
    { riddle: "له عين واحدة ولا يرى بها فما هو؟", correct: "الإبرة" }
];

const triviaData = [
    { question: "ما هو أعلى حزام يمكن الوصول إليه في رياضة التايكوندو؟", correct: "الأسود", options: ["الأخضر", "الأحمر", "الأبيض", "الأسود"] },
    { question: "ما هي عاصمة جمهورية مصر العربية؟", correct: "القاهرة", options: ["الإسكندرية", "القاهرة", "الجيزة", "أسوان"] }
];

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// تشغيل البوت وتسجيل أوامر السلاش تلقائياً
client.once('ready', async () => {
    console.log(`تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);

    const commands = [
        new SlashCommandBuilder().setName('help').setDescription('عرض قائمة الألعاب والأوامر'),
        new SlashCommandBuilder().setName('clear').setDescription('مسح الشات مع الحفاظ على المثبتة')
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log('جاري تسجيل أوامر السلاش...');
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, 'YOUR_SERVER_ID'), // ضع آيدي سيرفرك هنا
            { body: commands },
        );
        console.log('تم تسجيل أوامر السلاش بنجاح!');
    } catch (error) {
        console.error(error);
    }
});

// معالجة أوامر السلاش {/}
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('🎮 قائمة ألعاب البوت التفاعلية والأوامر')
            .setDescription('اختر لعبتك المفضلة أو الأمر:')
            .addFields(
                { name: '❌ إكس أو', value: '`!xo @الشخص`', inline: true },
                { name: '🟡 أربع على الحواف', value: '`!اربع`', inline: true },
                { name: '⚡ تحدي السرعة', value: '`!سريع`', inline: true }
            )
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

// معالجة الأوامر التي تبدأ بعلامة التعجب (!) والألعاب
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // أمر مسح الشات السري بعلامة التعجب
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

    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('🎮 قائمة ألعاب البوت التفاعلية والأوامر')
            .setDescription('اختر لعبتك المفضلة أو الأمر واكتبه في الشات:')
            .addFields(
                { name: '❌ إكس أو', value: '`!xo @الشخص`', inline: true },
                { name: '🟡 أربع على الحواف', value: '`!اربع`', inline: true },
                { name: '✂️ حجر ورق مقص', value: '`!rps`', inline: true },
                { name: '🔢 تخمين الرقم', value: '`!تخمين`', inline: true },
                { name: '⚡ تحدي السرعة', value: '`!سريع`', inline: true },
                { name: '🎰 الحظ السعيد', value: '`!حظ`', inline: true },
                { name: '❓ لعبة الأسئلة', value: '`!اسئلة`', inline: true },
                { name: '🌍 تخمين الأعلام', value: '`!اعلام`', inline: true },
                { name: '🏛️ لعبة العواصم', value: '`!عواصم`', inline: true },
                { name: '🧩 لعبة فكك', value: '`!فكك`', inline: true },
                { name: '🔤 لعبة ركب', value: '`!ركب`', inline: true },
                { name: '🧠 لعبة حزر', value: '`!حزر`', inline: true }
            )
            .setColor(0x5865F2);
        await message.reply({ embeds: [helpEmbed] });
    }

    // لعبة إكس أو
    if (message.content.startsWith('!xo')) {
        const args = message.content.split(' ');
        let opponent = message.mentions.users.first();
        if (!opponent && args[1]) {
            const cleanId = args[1].replace(/[<@!>]/g, '');
            try { opponent = await client.users.fetch(cleanId); } catch (e) {}
        }
        if (!opponent) return message.reply('❌ يجب عليك منشن شخص لتبدأ معه لعبة إكس أو! مثال: `!xo @الشخص`');
        if (opponent.bot || opponent.id === message.author.id) return message.reply('❌ لا يمكنك اللعب مع بوت أو مع نفسك!');

        const inviteEmbed = new EmbedBuilder()
            .setTitle('🎮 طلب تحدي لعبة إكس أو ❌⭕')
            .setDescription(`لقد تحداك <@${message.author.id}> للعبة إكس أو!\nهل توافق على التحدي يا <@${opponent.id}>؟`)
            .setColor(0x5865F2);

        const inviteRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('xo_accept').setLabel('وافق').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('xo_decline').setLabel('رفض').setStyle(ButtonStyle.Danger)
        );

        const inviteMessage = await message.reply({ content: `<@${opponent.id}>`, embeds: [inviteEmbed], components: [inviteRow] });
        const inviteCollector = inviteMessage.createMessageComponentCollector({ time: 300000 });

        inviteCollector.on('collect', async interaction => {
            if (interaction.user.id !== opponent.id) return interaction.reply({ content: '❌ هذا التحدي ليس موجهاً لك!', ephemeral: true });
            if (interaction.customId === 'xo_decline') {
                inviteCollector.stop();
                return await interaction.update({ embeds: [new EmbedBuilder().setTitle('❌ تم رفض التحدي')], components: [] });
            }
            inviteCollector.stop();

            let board = Array(9).fill(null);
            let turn = message.author.id;

            const getRow = (currentBoard) => {
                let rows = [];
                for (let i = 0; i < 3; i++) {
                    let row = new ActionRowBuilder();
                    for (let j = 0; j < 3; j++) {
                        let index = i * 3 + j;
                        let label = currentBoard[index] === 'X' ? '❌' : currentBoard[index] === 'O' ? '⭕' : '➖';
                        let style = currentBoard[index] === 'X' ? ButtonStyle.Danger : currentBoard[index] === 'O' ? ButtonStyle.Primary : ButtonStyle.Secondary;
                        row.addComponents(new ButtonBuilder().setCustomId(`xo_${index}`).setLabel(label).setStyle(style).setDisabled(currentBoard[index] !== null));
                    }
                    rows.push(row);
                }
                return rows;
            };

            const checkWin = (b) => {
                const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
                for (let w of wins) {
                    if (b[w[0]] && b[w[0]] === b[w[1]] && b[w[0]] === b[w[2]]) return b[w[0]];
                }
                return b.every(c => c !== null) ? 'tie' : null;
            };

            const gameEmbed = new EmbedBuilder().setTitle('❌ لعبة إكس أو ⭕').setDescription(`دور اللاعب: <@${turn}> (❌)`).setColor(0x5865F2);
            await interaction.update({ embeds: [gameEmbed], components: getRow(board) });

            const gameCollector = inviteMessage.createMessageComponentCollector({ time: 300000 });
            gameCollector.on('collect', async gInt => {
                if (!gInt.customId.startsWith('xo_')) return;
                if (gInt.user.id !== message.author.id && gInt.user.id !== opponent.id) return gInt.reply({ content: '❌ مباراة لا تخصك!', ephemeral: true });
                if (gInt.user.id !== turn) return gInt.reply({ content: '❌ ليس دورك!', ephemeral: true });

                const index = parseInt(gInt.customId.split('_')[1]);
                board[index] = (turn === message.author.id) ? 'X' : 'O';

                let winner = checkWin(board);
                if (winner) {
                    gameCollector.stop();
                    let res = winner === 'tie' ? '🤝 تعادلتما!' : `🎉 الفائز: <@${turn}>`;
                    gameEmbed.setDescription(`انتهت اللعبة!\n\n${res}`);
                    return await gInt.update({ embeds: [gameEmbed], components: getRow(board) });
                }

                turn = (turn === message.author.id) ? opponent.id : message.author.id;
                gameEmbed.setDescription(`دور اللاعب: <@${turn}> (${turn === message.author.id ? '❌' : '⭕'})`);
                await gInt.update({ embeds: [gameEmbed], components: getRow(board) });
            });
        });
    }

    if (message.content === '!اربع') {
        new ConnectFour({ message, isSlashGame: false, opponent: message.mentions.users.first() || message.author, embed: { title: 'أربع على الحواف', color: '#5865F2' }, mentionUser: true, timeoutTime: 300000 }).startGame();
    }
    if (message.content === '!rps') {
        new RockPaperScissors({ message, isSlashGame: false, opponent: message.mentions.users.first() || message.author, embed: { title: 'حجر ورق مقص', color: '#5865F2' }, mentionUser: true, timeoutTime: 300000 }).startGame();
    }
    if (message.content === '!تخمين') {
        new GuessTheNumber({ message, isSlashGame: false, embed: { title: 'تخمين الرقم', color: '#5865F2' }, timeoutTime: 300000, mode: 'buttons' }).startGame();
    }
    if (message.content === '!سريع') {
        new QuickClick({ message, isSlashGame: false, embed: { title: 'تحدي السرعة', color: '#5865F2' }, timeoutTime: 300000 }).startGame();
    }
    if (message.content === '!حظ') {
        new Slot({ message, isSlashGame: false, embed: { title: 'لعبة الحظ', color: '#5865F2' }, timeoutTime: 300000 }).startGame();
    }

    if (message.content === '!اسئلة') {
        const q = triviaData[Math.floor(Math.random() * triviaData.length)];
        const opts = shuffleArray([...q.options]);
        const row = new ActionRowBuilder();
        opts.forEach((o, i) => row.addComponents(new ButtonBuilder().setCustomId(`t_${i}_${o}`).setLabel(o).setStyle(ButtonStyle.Primary)));
        const msg = await message.reply({ embeds: [new EmbedBuilder().setTitle('❓ أسئلة').setDescription(`**${q.question}**`).setColor(0x5865F2)], components: [row] });
        const col = msg.createMessageComponentCollector({ time: 300000 });
        col.on('collect', async i => {
            if (i.user.id !== message.author.id) return i.reply({ content: '❌ ليست لك!', ephemeral: true });
            const sel = i.customId.split('_').slice(2).join('_');
            await i.update({ content: sel === q.correct ? `🎉 صح! **${q.correct}**` : `❌ خطأ! الصحيح: **${q.correct}**`, components: [] });
            col.stop();
        });
    }

    if (message.content === '!اعلام') {
        const d = flagsGameData[Math.floor(Math.random() * flagsGameData.length)];
        const opts = shuffleArray([...d.options]);
        const row = new ActionRowBuilder();
        opts.forEach((o, i) => row.addComponents(new ButtonBuilder().setCustomId(`f_${i}_${o}`).setLabel(o).setStyle(ButtonStyle.Primary)));
        const msg = await message.reply({ embeds: [new EmbedBuilder().setTitle('🌍 أعلام').setDescription(`ما هي الدولة؟\n\n# ${d.flag}`).setColor(0x5865F2)], components: [row] });
        const col = msg.createMessageComponentCollector({ time: 300000 });
        col.on('collect', async i => {
            if (i.user.id !== message.author.id) return i.reply({ content: '❌ ليست لك!', ephemeral: true });
            const sel = i.customId.split('_').slice(2).join('_');
            await i.update({ content: sel === d.country ? `🎉 صح! **${d.country}** ${d.flag}` : `❌ خطأ! الصحيح: **${d.country}**`, components: [] });
            col.stop();
        });
    }

    if (message.content === '!عواصم') {
        const c = capitalsGameData[Math.floor(Math.random() * capitalsGameData.length)];
        const opts = shuffleArray([...c.options]);
        const row = new ActionRowBuilder();
        opts.forEach((o, i) => row.addComponents(new ButtonBuilder().setCustomId(`c_${i}_${o}`).setLabel(o).setStyle(ButtonStyle.Primary)));
        const msg = await message.reply({ embeds: [new EmbedBuilder().setTitle('🏛️ عواصم').setDescription(`عاصمة **${c.country}**؟`).setColor(0x5865F2)], components: [row] });
        const col = msg.createMessageComponentCollector({ time: 300000 });
        col.on('collect', async i => {
            if (i.user.id !== message.author.id) return i.reply({ content: '❌ ليست لك!', ephemeral: true });
            const sel = i.customId.split('_').slice(2).join('_');
            await i.update({ content: sel === c.capital ? `🎉 صح! **${c.capital}**` : `❌ خطأ! الصحيح: **${c.capital}**`, components: [] });
            col.stop();
        });
    }

    if (message.content === '!فكك') {
        const f = fakkData[Math.floor(Math.random() * fakkData.length)];
        await message.reply({ embeds: [new EmbedBuilder().setTitle('🧩 فكك').setDescription(`فكك الكلمة:\n\n# ${f.word}`).setColor(0x5865F2)] });
        const col = message.channel.createMessageCollector({ filter: r => r.author.id === message.author.id, time: 300000, max: 1 });
        col.on('collect', r => {
            message.channel.send(r.content.trim() === f.spaced ? `🎉 صح: **${f.spaced}**` : `❌ خطأ! الصحيح: **${f.spaced}**`);
        });
    }

    if (message.content === '!ركب') {
        const r = rakibData[Math.floor(Math.random() * rakibData.length)];
        await message.reply({ embeds: [new EmbedBuilder().setTitle('🔤 ركب').setDescription(`ركب الحروف:\n\n# ${r.scrambled}`).setColor(0x5865F2)] });
        const col = message.channel.createMessageCollector({ filter: resp => resp.author.id === message.author.id, time: 300000, max: 1 });
        col.on('collect', resp => {
            message.channel.send(resp.content.trim() === r.correct ? `🎉 صح: **${r.correct}**` : `❌ خطأ! الصحيح: **${r.correct}**`);
        });
    }

    if (message.content === '!حزر') {
        const h = hazirData[Math.floor(Math.random() * hazirData.length)];
        await message.reply({ embeds: [new EmbedBuilder().setTitle('🧠 حزر').setDescription(`اللغز:\n\n# "${h.riddle}"`).setColor(0x5865F2)] });
        const col = message.channel.createMessageCollector({ filter: resp => resp.author.id === message.author.id, time: 300000, max: 1 });
        col.on('collect', resp => {
            message.channel.send(resp.content.trim() === h.correct ? `🎉 صح: **${h.correct}**` : `❌ خطأ! الصحيح: **${h.correct}**`);
        });
    }
});

client.login(process.env.TOKEN);
