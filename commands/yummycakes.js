const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageActionRow, MessageButton, Interaction } = require("discord.js");

const buttons = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('yes')
            .setLabel('Yes')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('no')
            .setLabel('No')
            .setStyle('DANGER')
    )

module.exports = {
    data: new SlashCommandBuilder()
        .setName("yummycakes")
        .setDescription("Will you accept some yummy cakes from Ralsei?"),
    async execute(interaction) {
        await interaction.reply({content: 'I baked you some yummy cakes! Do you want them?', 
            components: [buttons]})
    }
};