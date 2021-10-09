const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Gives information about the server'),
    async execute(interaction) {
        await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members ${interaction.guild.memberCount}\nHash of the icon: ${interaction.guild.icon}`);
    }
};