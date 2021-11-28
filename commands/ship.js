const {SlashCommandBuilder} = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Show the best ship in the world'),
    async execute(interaction) {
        await interaction.reply({
            files: ["ralexa.png"]
        });
    }
}