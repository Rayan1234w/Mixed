const inviteMsg = await message.reply({ 
            content: `<@${opponent.id}>`, 
            embeds: [new EmbedBuilder().setTitle('✂️ تحدي حجر ورق مقص').setDescription(`تحدي من <@${message.author.id}>`).setColor(0x5865F2)], 
            components: [new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('rps_ok').setLabel('وافق').setStyle(ButtonStyle.Success), 
                new ButtonBuilder().setCustomId('rps_no').setLabel('رفض').setStyle(ButtonStyle.Danger)
            )] 
        });
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
        const secret = Math.floor(Math.random() * 100) + 1;
        let attempts = 10;
        const msg = await message.reply(`🔢 لعبة تخمين الرقم!\nلقد اخترت رقماً بين **1 و 100**. لديك **${attempts}** محاولات.\nاكتب الرقم في الشات!`);
        
        const filter = m => m.author.id === message.author.id && !isNaN(m.content);
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', async m => {
            const guess = parseInt(m.content);
            attempts--;
            if (guess === secret) {
                collector.stop();
                return m.reply(`🎉 كفو! لقد فزت، الرقم كان **${secret}**.`);
            } else if (attempts === 0) {
                collector.stop();
                return m.reply(`❌ انتهت المحاولات! الرقم الصحيح كان **${secret}**.`);
            } else if (guess < secret) {
                await m.react('📈');
                m.reply(`الرقم أكبر! باقي لديك **${attempts}** محاولات.`);
            } else {
                await m.react('📉');
                m.reply(`الرقم أصغر! باقي لديك **${attempts}** محاولات.`);
            }
        });
        return;
    }

    // 5. تحدي السرعة
    if (message.content === '!سريع') {
        const words = ["تفاح", "برمجة", "ديسكورد", "حاسوب", "تطبيقات", "سرعة", "تحدي", "خوارزمية"];
        const targetWord = words[Math.floor(Math.random() * words.length)];
        
        await message.channel.send(`⚡ أول شخص يكتب هذه الكلمة يربح:\n\`\`\`${targetWord}\`\`\``);
        
        const filter = m => !m.author.bot && m.content === targetWord;
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });

        collector.on('collect', m => {
            m.reply(`🎉 كفو <@${m.author.id}>! لقد فزت بالسرعة البارقة! ⚡`);
        });
        return;
    }

    // 6. الحظ السعيد
    if (message.content === '!حظ') {
        const emojis = ['🍒', '🍋', '🍊', '🍇', '🔔', '⭐'];
        const r1 = emojis[Math.floor(Math.random() * emojis.length)];
        const r2 = emojis[Math.floor(Math.random() * emojis.length)];
        const r3 = emojis[Math.floor(Math.random() * emojis.length)];

        const embed = new EmbedBuilder()
            .setTitle('🎰 ماكينة الحظ السعيد')
            .setDescription(`[ ${r1} | ${r2} | ${r3} ]\n\n` + (r1 === r2 && r2 === r3 ? '🎉 مبروك! لقد ربحت الجائزة الكبرى!' : '❌ هارد لك، حظاً أوفر في المرة القادمة!'))
            .setColor(0x5865F2);
        return message.reply({ embeds: [embed] });
    }

    // 7. الأسئلة
    if (message.content === '!اسئلة') {
        const q = triviaData[Math.floor(Math.random() * triviaData.length)];
        const shuffledOpts = shuffleArray([...q.options]);
        
        const row = new ActionRowBuilder();
        shuffledOpts.forEach((opt, idx) => {
            row.addComponents(
                new ButtonBuilder().setCustomId(`trivia_${idx}_${opt === q.correct}`).setLabel(opt).setStyle(ButtonStyle.Secondary)
            );
        });

        const embed = new EmbedBuilder().setTitle('❓ سؤال وجواب').setDescription(q.question).setColor(0x5865F2);
        const msg = await message.reply({ embeds: [embed], components: [row] });

        const collector = msg.createMessageComponentCollector({ time: 30000 });
        collector.on('collect', async i => {
            collector.stop();
            const isCorrect = i.customId.endsWith('_true');
            if (isCorrect) {
                await i.update({ content: `✅ إجابة صحيحة يا <@${i.user.id}>!`, embeds: [], components: [] });
            } else {
                await i.update({ content: `❌ إجابة خاطئة يا <@${i.user.id}>! الإجابة الصحيحة هي: **${q.correct}**`, embeds: [], components: [] });
            }
        });
        return;
    }

    // 8. الأعلام
    if (message.content === '!اعلام') {
        const f = flagsGameData[Math.floor(Math.random() * flagsGameData.length)];
        const shuffledOpts = shuffleArray([...f.options]);

        const row = new ActionRowBuilder();
        shuffledOpts.forEach((opt, idx) => {
            row.addComponents(
                new ButtonBuilder().setCustomId(`flag_${idx}_${opt === f.country}`).setLabel(opt).setStyle(ButtonStyle.Secondary)
            );
        });

        const embed = newEmbedBuilder = new EmbedBuilder().setTitle('🌍 لعبة تخمين الأعلام').setDescription(`ما هو اسم الدولة الخاصة بهذا العلم؟\n\n# ${f.flag}`).setColor(0x5865F2);
        const msg = await message.reply({ embeds: [embed], components: [row] });

        const collector = msg.createMessageComponentCollector({ time: 30000 });
        collector.on('collect', async i => {
            collector.stop();
            const isCorrect = i.customId.endsWith('_true');
            if (isCorrect) {
                await i.update({ content: `✅ كفو <@${i.user.id}>! إجابة صحيحة.`, embeds: [], components: [] });
            } else {
                await i.update({ content: `❌ إجابة خاطئة يا <@${i.user.id}>! الدولة هي: **${f.country}**`, embeds: [], components: [] });
            }
        });
        return;
    }

    // 9. العواصم
    if (message.content === '!عواصم') {
        const c = capitalsGameData[Math.floor(Math.random() * capitalsGameData.length)];
        const shuffledOpts = shuffleArray([...c.options]);

        const row = new ActionRowBuilder();
        shuffledOpts.forEach((opt, idx) => {
            row.addComponents(
                new ButtonBuilder().setCustomId(`cap_${idx}_${opt === c.capital}`).setLabel(opt).setStyle(ButtonStyle.Secondary)
            );
        });

        const embed = new EmbedBuilder().setTitle('🏛️ لعبة العواصم').setDescription(`ما هي عاصمة دولة **${c.country}**؟`).setColor(0x5865F2);
        const msg = await message.reply({ embeds: [embed], components: [row] });

        const collector = msg.createMessageComponentCollector({ time: 30000 });
        collector.on('collect', async i => {
            collector.stop();
            const isCorrect = i.customId.endsWith('_true');
            if (isCorrect) {
                await i.update({ content: `✅ كفو <@${i.user.id}>! العاصمة صحيحة.`, embeds: [], components: [] });
            } else {
                await i.update({ content: `❌ خطأ يا <@${i.user.id}>! العاصمة هي: **${c.capital}**`, embeds: [], components: [] });
            }
        });
        return;
    }

    // 10. فكك
    if (message.content === '!فكك') {
        const item = fakkData[Math.floor(Math.random() * fakkData.length)];
        await message.channel.send(`🧩 فكك الكلمة التالية:\n\`\`\`${item.spaced}\`\`\``);

        const filter = m => !m.author.bot && m.content.replace(/\s+/g, '') === item.word;
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });

        collector.on('collect', m => {
            m.reply(`🎉 كفو <@${m.author.id}>! فككتها صح (الكلمة: **${item.word}**).`);
        });
        return;
    }

    // 11. ركب
    if (message.content === '!ركب') {
        const item = rakibData[Math.floor(Math.random() * rakibData.length)];
        await message.channel.send(`🔤 ركب الحروف لتصبح كلمة صحيحة:\n\`\`\`${item.scrambled}\`\`\``);

        const filter = m => !m.author.bot && m.content.replace(/\s+/g, '') === item.correct;
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 30000 });

        collector.on('collect', m => {
            m.reply(`🎉 كفو <@${m.author.id}>! ركبتها صح (الكلمة: **${item.correct}**).`);
        });
        return;
    }

    // 12. حزر
    if (message.content === '!حزر') {
        const item = hazirData[Math.floor(Math.random() * hazirData.length)];
        await message.channel.send(`🧠 حزر الفزورة:\n\`\`\`${item.riddle}\`\`\``);

        const filter = m => !m.author.bot && m.content.includes(item.correct);
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 40000 });

        collector.on('collect', m => {
            m.reply(`🎉 إجابة صحيحة يا <@${m.author.id}>! الحل هو: **${item.correct}**`);
        });
        return;
    }
});

client.login(process.env.TOKEN);
