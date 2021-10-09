const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Returns info about the user"),
    async execute(interaction) {
        await interaction.reply(`Your tag: ${interaction.user.tag}\nYour URL: ${interaction.user.avatarURL()}`)
    }
};