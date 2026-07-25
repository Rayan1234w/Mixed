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
// البيانات الموسعة (كلمات وجمل كثيرة ومتنوعة)
// ==========================================
const fakkData = [
    { word: "مكتبة", spaced: "م ك ت ب ة" }, 
    { word: "حاسوب", spaced: "ح ا س و ب" }, 
    { word: "مدرسة", spaced: "م د ر س ة" },
    { word: "برمجة", spaced: "ب ر م ج ة" },
    { word: "الرياض", spaced: "ا ل ر ي ا ض" },
    { word: "ديسكورد", spaced: "د ي س ك و ر د" },
    { word: "جامعة", spaced: "ج ا م ع ة" },
    { word: "طائرة", spaced: "ط ا ئ ر ة" },
    { word: "سيارة", spaced: "س ي ا ر ة" },
    { word: "كمبيوتر", spaced: "ك م ب ي و ت ر" }
];

const rakibData = [
    { scrambled: "س م ك", correct: "سمك" }, 
    { scrambled: "ق م ر", correct: "قمر" }, 
    { scrambled: "ش م ش", correct: "شمس" },
    { scrambled: "ق ل م", correct: "قلم" },
    { scrambled: "ب ح ر", correct: "بحر" },
    { scrambled: "و ر د", correct: "ورد" },
    { scrambled: "ن ج م", correct: "نجم" },
    { scrambled: "ت ف ح", correct: "تفح" }
];

const triviaData = [
    { question: "ما هي عاصمة المملكة العربية السعودية؟", correct: "الرياض", options: ["جدة", "الرياض", "الدمام", "مكة"] },
    { question: "ما هي عاصمة الإمارات العربية المتحدة؟", correct: "أبوظبي", options: ["دبي", "أبوظبي", "الشارقة", "عجمان"] },
    { question: "كم عدد سور القرآن الكريم؟", correct: "114", options: ["112", "113", "114", "115"] },
    { question: "ما هي عاصمة الكويت؟", correct: "الكويت", options: ["الجهراء", "الكويت", "المباركية", "حولي"] }
];

const flagsGameData = [
    { country: "المملكة العربية السعودية", flag: "🇸🇦", options: ["المملكة العربية السعودية", "الإمارات العربية المتحدة", "الكويت", "قطر"] },
    { country: "الكويت", flag: "🇰🇼", options: ["الكويت", "البحرين", "عمان", "مصر"] }
];

const capitalsGameData = [
    { country: "المملكة العربية السعودية", capital: "الرياض", options: ["الرياض", "جدة", "مكة المكرمة", "الدمام"] },
    { country: "مصر", capital: "القاهرة", options: ["الإسكندرية", "القاهرة", "الجيزة", "أسوان"] }
];

const hazirData = [
    { riddle: "ما هو الشيء الذي أبيض من السن وأسود من الليل؟", correct: "خط القران" },
    { riddle: "ما هو الشيء الذي يجري وراءك ولا تحسه؟", correct: "الظل" },
    { riddle: "ما هو البيت الذي ليس فيه أبواب ولا نوافذ؟", correct: "بيت الشعر" }
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
            .setDescription('استمتع بأفضل الألعاب والتحديات التفاعلية:')
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
        const words = ["تفاح", "برمجة", "ديسكورد", "حاسوب", "تطبيقات", "سرعة", "تحدي", "خوارزمية", "مطور", "ذكاء"];
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

    // فكك (البوت يعطيك الكلمة متصلة وأنت تكتبها مفككة بالحروف والمسافات)
    if (message.content === '!فكك') {
        const item = fakkData[Math.floor(Math.random() * fakkData.length)];
        const embed = new EmbedBuilder()
            .setTitle('🧩 لعبة تفكيك الكلمات')
            .setDescription(`فكك الكلمة التالية واكتبها بالحروف مفرقة:\n\`\`\`${item.word}\`\`\``)
            .setColor(0xE91E63);
        
        await message.channel.send({ embeds: [embed] });

        const filter = m => !m.author.bot && m.content.replace(/\s+/g, '') === item.word;
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });

        collector.on('collect', m => {
            m.reply(`🎉 كفو <@${m.author.id}>! فككتها وصح عليك (الإجابة المفككة: **${item.spaced}**).`);
        });
        return;
    }

    // ركب (البوت يعطيك الحروف مفرقة وأنت تركبها لتصبح كلمة متصلة)
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
