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

// قواعد البيانات
const flagsGameData = [
    { country: "المملكة العربية السعودية", flag: "🇸🇦", options: ["المملكة العربية السعودية", "الإمارات العربية المتحدة", "الكويت", "قطر"] },
    { country: "اليابان", flag: "🇯🇵", options: ["الصين", "اليابان", "كوريا الجنوبية", "فيتنام"] }
];

const capitalsGameData = [
    { country: "المملكة العربية السعودية", capital: "الرياض", options: ["الرياض", "جدة", "مكة المكرمة", "الدمام"] }
];

const fakkData = [{ word: "مكتبة", spaced: "م ك ت ب ة" }];
const rakibData = [{ scrambled: "س م ك", correct: "سمك" }];
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

    // 1. لعبة إكس أو
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

    // 2. لعبة أربع على الحواف
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

    // 4. تخمين الرقم (مبرمج داخلياً وبدون أخطاء)
    if (message.content === '!تخمين') {
        const targetNumber = Math.floor(Math.random() * 20) + 1;
        const msg = await message.reply({ embeds: [new EmbedBuilder().setTitle('🔢 تخمين الرقم').setDescription('خمن رقماً بين **1 و 20** واكتبه في الشات! أمامك 30 ثانية.').setColor(0x5865F2)] });
        
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

    // 5. تحدي السرعة (مبرمج داخلياً وبدون أخطاء)
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

    // 6. لعبة الحظ (مبرمج داخلياً وبدون أخطاء)
    if (message.content === '!حظ') {
        const items = ['🍇', '🍊', '🍋', '🍌', '🍍', '🍒', '⭐'];
        const r1 = items[Math.floor(Math.random() * items.length)];
        const r2 = items[Math.floor(Math.random() * items.length)];
        const r3 = items[Math.floor(Math.random() * items.length)];

        let resultText = (r1 === r2 && r2 === r3) ? '🎉 مبروك فزت بالجائزة الكبرى!' : '❌ هاردلك، لم تتطابق الرموز!';
        const embed = new EmbedBuilder().setTitle('🎰 الحظ السعيد').setDescription(`**[ ${r1} | ${r2} | ${r3} ]**\n\n${resultText}`).setColor(0x5865F2);
        await message.reply({ embeds: [embed] });
    }

    // الألعاب الأخرى (أسئلة، أعلام، عواصم، فكك، ركب، حزر)
    if (message.content === '!اسئلة') {
        const q = triviaData[0];
        const opts = shuffleArray([...q.options]);
        const row = new ActionRowBuilder();
        opts.forEach((o, i) => row.addComponents(new ButtonBuilder().setCustomId(`t_${i}`).setLabel(o).setStyle(ButtonStyle.Primary)));
        const msg = await message.reply({ embeds: [new EmbedBuilder().setTitle('❓ أسئلة').setDescription(`**${q.question}**`).setColor(0x5865F2)], components: [row] });
        const col = msg.createMessageComponentCollector({ time: 30000 });
        col.on('collect', async i => {
            if (i.user.id !== message.author.id) return i.reply({ content: '❌ ليست لك!', ephemeral: true });
            await i.update({ content: `🎉 صحيح! الإجابة هي **${q.correct}**`, components: [] });
            col.stop();
        });
    }

    if (message.content === '!اعلام') {
        const d = flagsGameData[0];
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

    if (message.content === '!عواصم') {
        const c = capitalsGameData[0];
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

    if (message.content === '!فكك') {
        const f = fakkData[0];
        await message.reply({ embeds: [new EmbedBuilder().setTitle('🧩 فكك').setDescription(`فكك الكلمة:\n\n# ${f.word}`).setColor(0x5865F2)] });
        const col = message.channel.createMessageCollector({ filter: r => r.author.id === message.author.id, time: 30000, max: 1 });
        col.on('collect', r => {
            message.channel.send(r.content.trim() === f.spaced ? `🎉 صح: **${f.spaced}**` : `❌ خطأ! الصحيح: **${f.spaced}**`);
        });
    }

    if (message.content === '!ركب') {
        const r = rakibData[0];
        await message.reply({ embeds: [new EmbedBuilder().setTitle('🔤 ركب').setDescription(`ركب الحروف:\n\n# ${r.scrambled}`).setColor(0x5865F2)] });
        const col = message.channel.createMessageCollector({ filter: resp => resp.author.id === message.author.id, time: 30000, max: 1 });
        col.on('collect', resp => {
            message.channel.send(resp.content.trim() === r.correct ? `🎉 صح: **${r.correct}**` : `❌ خطأ! الصحيح: **${r.correct}**`);
        });
    }

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
