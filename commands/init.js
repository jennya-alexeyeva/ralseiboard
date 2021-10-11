const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");

const buttons = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('yesinit')
            .setLabel('Yes')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('noInit')
            .setLabel('No')
            .setStyle('SUCCESS')
    )
// TODO figure out how to make this so that only an admin can run it
// probably make another command to set an admin role that only the server owner can run?
module.exports = {
    data: new SlashCommandBuilder()
        .setName("init")
        .setDescription("Initialize the Ralseiboard database with the server's previous messages."),
    async execute(interaction) {
        await interaction.reply({content: "WARNING: This command will crawl through every single message sent in the server. As such, it will take a while to run, and during its runtime, it will not be able to listen to new messages. It is highly recommended that you run this when the server is inactive. Proceed anyway?",
                components: [buttons]});
    } // TODO write init script that runs when the yes button is pressed, kind of based on my failed mostactive command
}