const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes, PermissionFlagsBits, MessageFlags } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', async () => {
    console.log(`تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);

    const commands = [
        new SlashCommandBuilder().setName('help').setDescription('عرض قائمة ألعاب وبوت التفاعلية والأوامر'),
        new SlashCommandBuilder().setName('nitro').setDescription('عرض بطاقة المهام والبروفايل الخاصة بك'),
        new SlashCommandBuilder().setName('نيترو').setDescription('عرض بطاقة المهام والبروفايل الخاصة بك'),
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

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('🎮 قائمة ألعاب وبوت التفاعلية والأوامر')
            .setDescription('اختر لعبتك المفضلة أو الأمر:')
            .addFields(
                { name: '🎟️ عرض بطاقة المهام', value: '`/nitro` أو `/نيترو`', inline: true },
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
        const profileEmbed = new EmbedBuilder()
            .setTitle('🎟️ بطاقة مهام ديسكورد')
            .setDescription(`مرحباً **${interaction.user.username}**!\n\nحالة المهام الخاصة بك نشطة وجاهزة للإنجاز.`)
            .addFields(
                { name: '⏳ الوقت المتبقي للشارة القادمة', value: '2 شهر و 14 يوم', inline: false },
                { name: '📅 التاريخ المستهدف', value: '2026-10-14', inline: false }
            )
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setColor(0x00e5ff)
            .setTimestamp();
        return await interaction.reply({ embeds: [profileEmbed] });
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
});

client.login(process.env.TOKEN);
