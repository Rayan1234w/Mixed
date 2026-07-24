const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { ConnectFour, RockPaperScissors, GuessTheNumber, QuickClick, Slot } = require('discord-gamecord');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// قائمة أعلام الدول
const flagsGameData = [
    { country: "المملكة العربية السعودية", flag: "🇸🇦", options: ["المملكة العربية السعودية", "الإمارات العربية المتحدة", "الكويت", "قطر"] },
    { country: "اليابان", flag: "🇯🇵", options: ["الصين", "اليابان", "كوريا الجنوبية", "فيتنام"] },
    { country: "البرازيل", flag: "🇧🇷", options: ["الأرجنتين", "البرازيل", "البرتغال", "إسبانيا"] },
    { country: "فرنسا", flag: "🇫🇷", options: ["إيطاليا", "ألمانيا", "فرنسا", "بلجيكا"] },
    { country: "المملكة المتحدة", flag: "🇬🇧", options: ["الولايات المتحدة", "المملكة المتحدة", "كندا", "استراليا"] },
    { country: "مصر", flag: "🇪🇬", options: ["مصر", "المغرب", "العراق", "تونس"] },
    { country: "المغرب", flag: "🇲🇦", options: ["الجزائر", "المغرب", "تونس", "مصر"] },
    { country: "إيطاليا", flag: "🇮🇹", options: ["إسبانيا", "إيطاليا", "فرنسا", "اليونان"] }
];

// لعبة عواصم الدول
const capitalsGameData = [
    { country: "المملكة العربية السعودية", capital: "الرياض", options: ["الرياض", "جدة", "مكة المكرمة", "الدمام"] },
    { country: "الإمارات العربية المتحدة", capital: "أبوظبي", options: ["دبي", "أبوظبي", "الشارقة", "عجمان"] },
    { country: "مصر", capital: "القاهرة", options: ["الإسكندرية", "القاهرة", "الجيزة", "الأقصر"] },
    { country: "الكويت", capital: "الكويت", options: ["الكويت", "الجهراء", "المباركية", "السالمية"] },
    { country: "قطر", capital: "الدوحة", options: ["الوكرة", "الدوحة", "الخور", "لوسيل"] },
    { country: "اليابان", capital: "طوكيو", options: ["أوساكا", "طوكيو", "كيوتو", "هيروشيما"] },
    { country: "فرنسا", capital: "باريس", options: ["مارسيليا", "ليون", "باريس", "نيس"] },
    { country: "المملكة المتحدة", capital: "لندن", options: ["مانشستر", "لندن", "ليفربول", "برمنغهام"] },
    { country: "إيطاليا", capital: "روما", options: ["ميلانو", "روما", "البندقية", "فلورنس"] },
    { country: "إسبانيا", capital: "مدريد", options: ["برشلونة", "مدريد", "إشبيلية", "فالنسيا"] },
    { country: "ألمانيا", capital: "برلين", options: ["ميونخ", "برلين", "فرانكفورت", "هامبورغ"] },
    { country: "التركية", capital: "أنقرة", options: ["إسطنبول", "أنقرة", "إزمير", "أنطاليا"] },
    { country: "المغرب", capital: "الرباط", options: ["الدار البيضاء", "الرباط", "مراكش", "فاس"] },
    { country: "الجزائر", capital: "الجزائر", options: ["وهران", "الجزائر", "قسنطينة", "عنابة"] },
    { country: "تونس", capital: "تونس", options: ["سوسة", "تونس", "صفاقس", "بنزرت"] },
    { country: "العراق", capital: "بغداد", options: ["البصرة", "بغداد", "أربيل", "الموصل"] },
    { country: "الأردن", capital: "عمان", options: ["العقبة", "عمان", "إربد", "الزرقاء"] },
    { country: "سلطنة عمان", capital: "مسقط", options: ["صلالة", "مسقط", "نزوى", "صحر"] }
];

// لعبة فكك
const fakkData = [
    { word: "مكتبة", spaced: "م ك ت ب ة" },
    { word: "حاسب", spaced: "ح ا س ب" },
    { word: "برمجة", spaced: "ب ر م ج ة" },
    { word: "ديسكورد", spaced: "د ي س ك و ر د" },
    { word: "قهوة", spaced: "ق ه و ة" },
    { word: "مفتاح", spaced: "م ف ت ا ح" },
    { word: "كمبيوتر", spaced: "ك م ب ي و ت ر" },
    { word: "مدرستنا", spaced: "م د ر س ت ن ا" }
];

// لعبة ركب
const rakibData = [
    { scrambled: "س م ك", correct: "سمك" },
    { scrambled: "ق م ر", correct: "قمر" },
    { scrambled: "ش م س", correct: "شمس" },
    { scrambled: "ك ت ا ب", correct: "كتاب" },
    { scrambled: "ق ل م", correct: "قلم" },
    { scrambled: "و ر ق", correct: "ورق" },
    { scrambled: "ب ح ر", correct: "بحر" },
    { scrambled: "ج ب ل", correct: "جبل" }
];

// لعبة حزر
const hazirData = [
    { riddle: "ما هو الشيء الذي أبيض من السن وأسود من الليل؟", correct: "خط القران" },
    { riddle: "له عين واحدة ولا يرى بها فما هو؟", correct: "الإبرة" },
    { riddle: "ما هو الشيء الذي يوجد وسط مكة؟", correct: "حرف الكاف" },
    { riddle: "يتحرك بلا رجليْن ولا يدخل إلا للأذنين فما هو؟", correct: "الصوت" },
    { riddle: "ما هو الشيء الذي كلما أخذت منه كبر وكلما وضعت فيه صغر؟", correct: "الحفرة" },
    { riddle: "ما هو الشيء الذي يلبس حذاء ولا يخلعه أبداً؟", correct: "الجمل" },
    { riddle: "يترى بغير عيون ويجيبك إذا ناديته فما هو؟", correct: "الصديق" }
];

// قاعدة بيانات الأسئلة العامة
const triviaData = [
    { question: "ما هو أعلى حزام يمكن الوصول إليه في رياضة التايكوندو؟", correct: "الأسود", options: ["الأخضر", "الأحمر", "الأبيض", "الأسود"] },
    { question: "ما هي عاصمة جمهورية مصر العربية؟", correct: "القاهرة", options: ["الإسكندرية", "القاهرة", "الجيزة", "أسوان"] },
    { question: "كم عدد سور القرآن الكريم؟", correct: "114", options: ["110", "112", "114", "120"] },
    { question: "أي كوكب يسمى بالكوكب الأحمر؟", correct: "المريخ", options: ["الزهرة", "المريخ", "المشتري", "زحل"] },
    { question: "ما هو العنصر الكيميائي الذي يرمز له بالرمز (Au)؟", correct: "الذهب", options: ["الفضة", "الحديد", "الذهب", "النحاس"] },
    { question: "في اي عام تأسست المملكة العربية السعودية؟", correct: "1932", options: ["1930", "1932", "1940", "1925"] }
];

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

client.once('ready', () => {
    console.log(`تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.startsWith('!clear')) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply({ content: '❌ ما عندك صلاحية لإستخدام هذا الأمر!', ephemeral: true });
        }

        try {
            let fetched;
            do {
                fetched = await message.channel.messages.fetch({ limit: 100 });
                const messagesToDelete = fetched.filter(msg => !msg.pinned && (Date.now() - msg.createdTimestamp < 1209600000));
                if (messagesToDelete.size === 0) break;
                await message.channel.bulkDelete(messagesToDelete, true);
                if (fetched.size < 100) break;
            } while (true);

            const reply = await message.channel.send('✅ تم تنظيف الروم بنجاح! تم حذف الرسائل غير المثبتة.');
            setTimeout(() => reply.delete().catch(() => {}), 4000);
        } catch (error) {
            console.error(error);
            message.channel.send('❌ حدث خطأ أثناء محاولة مسح الرسائل.');
        }
        return;
    }

    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('🎮 قائمة ألعاب البوت التفاعلية الشاملة')
            .setDescription('اختر لعبتك المفضلة واكتب أمرها في الشات:')
            .addFields(
                { name: '❌ إكس أو', value: '`!xo`', inline: true },
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

    // لعبة إكس أو بالعربي (طلب الموافقة بمهلة دقيقة كاملة 60000)
    if (message.content.startsWith('!xo')) {
        const args = message.content.split(' ');
        let opponent = message.mentions.users.first();
        
        if (!opponent && args[1]) {
            const cleanId = args[1].replace(/[<@!>]/g, '');
            try {
                const fetchedUser = await client.users.fetch(cleanId);
                if (fetchedUser) opponent = fetchedUser;
            } catch (e) {}
        }

        if (!opponent) {
            return message.reply('❌ يجب عليك منشن شخص لتبدأ معه لعبة إكس أو! مثال: `!xo @الشخص`');
        }
        if (opponent.bot || opponent.id === message.author.id) {
            return message.reply('❌ لا يمكنك اللعب مع بوت أو مع نفسك!');
        }

        const inviteEmbed = new EmbedBuilder()
            .setTitle('🎮 طلب تحدي لعبة إكس أو ❌⭕')
            .setDescription(`لقد تحداك <@${message.author.id}> للعبة إكس أو!\nهل توافق على التحدي يا <@${opponent.id}>؟`)
            .setColor(0x5865F2);

        const inviteRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('xo_accept').setLabel('وافق').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('xo_decline').setLabel('رفض').setStyle(ButtonStyle.Danger)
        );

        const inviteMessage = await message.reply({ content: `<@${opponent.id}>`, embeds: [inviteEmbed], components: [inviteRow] });
        const inviteCollector = inviteMessage.createMessageComponentCollector({ time: 60000 }); // دقيقة كاملة للموافقة

        inviteCollector.on('collect', async interaction => {
            if (interaction.user.id !== opponent.id) {
                return interaction.reply({ content: '❌ هذا التحدي ليس موجهاً لك!', ephemeral: true });
            }

            if (interaction.customId === 'xo_decline') {
                inviteCollector.stop();
                const declineEmbed = new EmbedBuilder()
                    .setTitle('❌ تم رفض التحدي')
                    .setDescription(`للأسف، رفض <@${opponent.id}> التحدي.`);
                return await interaction.update({ embeds: [declineEmbed], components: [] });
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
                        let label = "➖";
                        let style = ButtonStyle.Secondary;
                        if (currentBoard[index] === 'X') {
                            label = "❌";
                            style = ButtonStyle.Danger;
                        } else if (currentBoard[index] === 'O') {
                            label = "⭕";
                            style = ButtonStyle.Primary;
                        }
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId(`xo_${index}`)
                                .setLabel(label)
                                .setStyle(style)
                                .setDisabled(currentBoard[index] !== null)
                        );
                    }
                    rows.push(row);
                }
                return rows;
            };

            const checkWin = (b) => {
                const wins = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8],
                    [0, 3, 6], [1, 4, 7], [2, 5, 8],
                    [0, 4, 8], [2, 4, 6]
                ];
                for (let w of wins) {
                    if (b[w[0]] && b[w[0]] === b[w[1]] && b[w[0]] === b[w[2]]) {
                        return b[w[0]];
                    }
                }
                if (b.every(cell => cell !== null)) return 'tie';
                return null;
            };

            const gameEmbed = new EmbedBuilder()
                .setTitle('❌ لعبة إكس أو ⭕')
                .setDescription(`دور اللاعب: <@${turn}> (❌)`)
                .setColor(0x5865F2);

            await interaction.update({ embeds: [gameEmbed], components: getRow(board) });
            
            const gameCollector = inviteMessage.createMessageComponentCollector({ time: 60000 }); // دقيقة لكل حركة

            gameCollector.on('collect', async gameInteraction => {
                if (!gameInteraction.customId.startsWith('xo_')) return;
                
                if (gameInteraction.user.id !== turn) {
                    return gameInteraction.reply({ content: '❌ ليس دورك الآن!', ephemeral: true });
                }

                const index = parseInt(gameInteraction.customId.split('_')[1]);
                board[index] = (turn === message.author.id) ? 'X' : 'O';

                let winner = checkWin(board);
                if (winner) {
                    gameCollector.stop();
                    let resultText = winner === 'tie' ? '🤝 تعادلتما!' : `🎉 الفائز هو <@${turn}> مبروك!`;
                    gameEmbed.setDescription(`انتهت اللعبة!\n\n${resultText}`);
                    return await gameInteraction.update({ embeds: [gameEmbed], components: getRow(board) });
                }

                turn = (turn === message.author.id) ? opponent.id : message.author.id;
                let symbolText = (turn === message.author.id) ? '❌' : '⭕';
                gameEmbed.setDescription(`دور اللاعب: <@${turn}> (${symbolText})`);

                await gameInteraction.update({ embeds: [gameEmbed], components: getRow(board) });
            });
        });

        inviteCollector.on('end', async collected => {
            if (collected.size === 0) {
                const timeoutEmbed = new EmbedBuilder()
                    .setTitle('⌛ انتهت الصلاحية')
                    .setDescription('لم يقم الخصم بالرد على طلب التحدي في الوقت المحدد (دقيقة واحدة).')
                    .setColor(0xFF0000);
                await inviteMessage.edit({ embeds: [timeoutEmbed], components: [] }).catch(() => {});
            }
        });
    }

    if (message.content === '!اربع') {
        const Game = new ConnectFour({
            message: message, isSlashGame: false,
            opponent: message.mentions.users.first() || message.author,
            embed: { title: 'لعبة أربع على الحواف', color: '#5865F2' },
            mentionUser: true, timeoutTime: 60000,
        });
        Game.startGame();
    }

    if (message.content === '!rps') {
        const Game = new RockPaperScissors({
            message: message, isSlashGame: false,
            opponent: message.mentions.users.first() || message.author,
            embed: { title: 'حجر ورق مقص', color: '#5865F2' },
            mentionUser: true, timeoutTime: 60000,
        });
        Game.startGame();
    }

    if (message.content === '!تخمين') {
        const Game = new GuessTheNumber({
            message: message, isSlashGame: false,
            embed: { title: 'تخمين الرقم', color: '#5865F2' },
            timeoutTime: 60000, mode: 'buttons'
        });
        Game.startGame();
    }

    if (message.content === '!سريع') {
        const Game = new QuickClick({
            message: message, isSlashGame: false,
            embed: { title: 'تحدي السرعة', color: '#5865F2' },
            timeoutTime: 60000,
        });
        Game.startGame();
    }

    if (message.content === '!حظ') {
        const Game = new Slot({
            message: message, isSlashGame: false,
            embed: { title: 'لعبة الحظ', color: '#5865F2' },
            timeoutTime: 60000,
        });
        Game.startGame();
    }

    if (message.content === '!اسئلة') {
        const randomTrivia = triviaData[Math.floor(Math.random() * triviaData.length)];
        const shuffledOptions = shuffleArray([...randomTrivia.options]);

        const embed = new EmbedBuilder()
            .setTitle('❓ لعبة الأسئلة العامة')
            .setDescription(`**${randomTrivia.question}**`)
            .setColor(0x5865F2);

        const row = new ActionRowBuilder();
        shuffledOptions.forEach((option, index) => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`trivia_${index}_${option}`)
                    .setLabel(option)
                    .setStyle(ButtonStyle.Primary)
            );
        });

        const gameMessage = await message.reply({ embeds: [embed], components: [row] });
        const collector = gameMessage.createMessageComponentCollector({ time: 30000 });

        collector.on('collect', async interaction => {
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({ content: '❌ هذه اللعبة ليست لك!', ephemeral: true });
            }
            const selectedOption = interaction.customId.split('_').slice(2).join('_');
            if (selectedOption === randomTrivia.correct) {
                await interaction.update({ content: `🎉 كفو يا ${message.author}! إجابتك صحيحة: **${randomTrivia.correct}** 🏆`, components: [] });
            } else {
                await interaction.update({ content: `❌ خطأ! الإجابة الصحيحة هي: **${randomTrivia.correct}**`, components: [] });
            }
            collector.stop();
        });
    }

    if (message.content === '!اعلام') {
        const randomData = flagsGameData[Math.floor(Math.random() * flagsGameData.length)];
        const shuffledOptions = shuffleArray([...randomData.options]);

        const embed = new EmbedBuilder()
            .setTitle('🌍 لعبة تخمين أعلام الدول')
            .setDescription(`ما هي الدولة التي يتبع لها هذا العلم?\n\n# ${randomData.flag}`)
            .setColor(0x5865F2);

        const row = new ActionRowBuilder();
        shuffledOptions.forEach((option, index) => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`flag_${index}_${option}`)
                    .setLabel(option)
                    .setStyle(ButtonStyle.Primary)
            );
        });

        const gameMessage = await message.reply({ embeds: [embed], components: [row] });
        const collector = gameMessage.createMessageComponentCollector({ time: 30000 });

        collector.on('collect', async interaction => {
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({ content: '❌ هذه اللعبة ليست لك!', ephemeral: true });
            }
            const selectedOption = interaction.customId.split('_').slice(2).join('_');
            if (selectedOption === randomData.country) {
                await interaction.update({ content: `🎉 كفو! إجابتك صحيحة، العلم لـ **${randomData.country}** ${randomData.flag}`, components: [] });
            } else {
                await interaction.update({ content: `❌ خطأ! الإجابة الصحيحة هي: **${randomData.country}** ${randomData.flag}`, components: [] });
            }
            collector.stop();
        });
    }

    if (message.content === '!عواصم') {
        const randomCapital = capitalsGameData[Math.floor(Math.random() * capitalsGameData.length)];
        const shuffledOptions = shuffleArray([...randomCapital.options]);

        const embed = new EmbedBuilder()
            .setTitle('🏛️ لعبة عواصم الدول')
            .setDescription(`ما هي عاصمة دولة **${randomCapital.country}**؟`)
            .setColor(0x5865F2);

        const row = new ActionRowBuilder();
        shuffledOptions.forEach((option, index) => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`capital_${index}_${option}`)
                    .setLabel(option)
                    .setStyle(ButtonStyle.Primary)
            );
        });

        const gameMessage = await message.reply({ embeds: [embed], components: [row] });
        const collector = gameMessage.createMessageComponentCollector({ time: 30000 });

        collector.on('collect', async interaction => {
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({ content: '❌ هذه اللعبة ليست لك!', ephemeral: true });
            }
            const selectedOption = interaction.customId.split('_').slice(2).join('_');
            if (selectedOption === randomCapital.capital) {
                await interaction.update({ content: `🎉 كفو يا ${message.author}! عاصمة ${randomCapital.country} هي **${randomCapital.capital}** 🏆`, components: [] });
            } else {
                await interaction.update({ content: `❌ خطأ! عاصمة ${randomCapital.country} الصحيحة هي: **${randomCapital.capital}**`, components: [] });
            }
            collector.stop();
        });
    }

    if (message.content === '!فكك') {
        const randomWord = fakkData[Math.floor(Math.random() * fakkData.length)];
        const embed = new EmbedBuilder()
            .setTitle('🧩 لعبة فكك الكلمات')
            .setDescription(`فكك الكلمة التالية إلى حروف مسافة بينها:\n\n# 🔤 ${randomWord.word}`)
            .setColor(0x5865F2);

        await message.reply({ embeds: [embed] });

        const filter = response => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 20000, max: 1 });

        collector.on('collect', response => {
            if (response.content.trim() === randomWord.spaced) {
                message.channel.send(`🎉 مبروك يا ${message.author}! التفكيك صحيح: **${randomWord.spaced}** 🏆`);
            } else {
                message.channel.send(`❌ خطأ! التفكيك الصحيح كان: **${randomWord.spaced}**`);
            }
        });
    }

    if (message.content === '!ركب') {
        const randomRakib = rakibData[Math.floor(Math.random() * rakibData.length)];
        const embed = new EmbedBuilder()
            .setTitle('🔤 لعبة ركب الحروف')
            .setDescription(`تركيب الحروف التالية:\n\n# 🔤 ${randomRakib.scrambled}`)
            .setColor(0x5865F2);

        await message.reply({ embeds: [embed] });

        const filter = response => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 20000, max: 1 });

        collector.on('collect', response => {
            if (response.content.trim() === randomRakib.correct) {
                message.channel.send(`🎉 كفو يا ${message.author}! الكلمة صحيحة: **${randomRakib.correct}** 🏆`);
            } else {
                message.channel.send(`❌ خطأ! الكلمة الصحيحة كانت: **${randomRakib.correct}**`);
            }
        });
    }

    if (message.content === '!حزر') {
        const randomHazir = hazirData[Math.floor(Math.random() * hazirData.length)];
        const embed = new EmbedBuilder()
            .setTitle('🧠 لعبة حزر الألغاز')
            .setDescription(`حل اللغز:\n\n# 💡 "${randomHazir.riddle}"`)
            .setColor(0x5865F2);

        await message.reply({ embeds: [embed] });

        const filter = response => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 20000, max: 1 });

        collector.on('collect', response => {
            if (response.content.trim() === randomHazir.correct) {
                message.channel.send(`🎉 كفو يا ${message.author}! الحل صحيح: **${randomHazir.correct}** 🏆`);
            } else {
                message.channel.send(`❌ خطأ! الإجابة الصحيحة كانت: **${randomHazir.correct}**`);
            }
        });
    }
});

client.login(process.env.TOKEN);
