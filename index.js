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
// البيانات (الأسئلة والألعاب)
// ==========================================
const fakkData = [
    { word: "مكتبة", spaced: "م ك ت ب ة" }, { word: "حاسوب", spaced: "ح ا س و ب" }, 
    { word: "مدرسة", spaced: "م د ر س ة" }, { word: "برمجة", spaced: "ب ر م ج ة" }, 
    { word: "الرياض", spaced: "ا ل ر ي ا ض" }, { word: "ديسكورد", spaced: "د ي س ك و ر د" }
];

const triviaData = [
    { question: "ما هي عاصمة المملكة العربية السعودية؟", correct: "الرياض", options: ["جدة", "الرياض", "الدمام", "مكة"] },
    { question: "ما هي عاصمة الإمارات العربية المتحدة؟", correct: "أبوظبي", options: ["دبي", "أبوظبي", "الشارقة", "عجمان"] }
];

client.once('ready', async () => {
    console.log(`تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);

    const commands = [
        new SlashCommandBuilder().setName('help').setDescription('عرض قائمة ألعاب وأوامر Mixed-bot'),
        new SlashCommandBuilder()
            .setName('rps')
            .setDescription('لعبة حجر ورق مقص مع شخص آخر')
            .addUserOption(option => option.setName('user').setDescription('الشخص الذي تريد تحديه').setRequired(true)),
        new SlashCommandBuilder().setName('تخمين').setDescription('لعبة تخمين الرقم'),
        new SlashCommandBuilder().setName('سريع').setDescription('تحدي السرعة والبرق'),
        new SlashCommandBuilder().setName('حظ').setDescription('ماكينة الحظ السعيد'),
        new SlashCommandBuilder().setName('اسئلة').setDescription('سؤال وجواب'),
        new SlashCommandBuilder().setName('فكك').setDescription('لعبة تفكيك الكلمات')
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
            .setDescription('اختر لعبتك المفضلة واكتب الأمر في الشات:')
            .addFields(
                { name: '✂️ حجر ورق مقص', value: '`/rps`', inline: true },
                { name: '🔢 تخمين الرقم', value: '`/تخمين`', inline: true },
                { name: '⚡ تحدي السرعة', value: '`/سريع`', inline: true },
                { name: '🎰 الحظ السعيد', value: '`/حظ`', inline: true },
                { name: '❓ لعبة الأسئلة', value: '`/اسئلة`', inline: true },
                { name: '🧩 لعبة فكك', value: '`/فكك`', inline: true }
            )
            .setColor(0x00AE86)
            .setTimestamp();
        return await interaction.reply({ embeds: [helpEmbed] });
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
        const words = ["تفاح", "برمجة", "ديسكورد", "حاسوب", "تطبيقات", "سرعة", "تحدي"];
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
});

client.login(process.env.TOKEN);
