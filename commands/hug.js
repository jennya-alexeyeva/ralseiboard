const {SlashCommandBuilder} = require("@discordjs/builders");

/**
 * Give Ralsei a hug
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("hug")
        .setDescription("Hug Ralsei"),
    async execute(interaction) {
        const firstLetter = interaction.user.tag.substring(0, 1)

        await interaction.reply(`${firstLetter}...${interaction.user.tag}!? Ummm, I don't think, um... This is what you're supposed to be doing. ...but...`)
    }
};