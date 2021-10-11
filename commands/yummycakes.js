const {SlashCommandBuilder} = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");

/**
 * Ask Ralsei for some yummy cakes!
 */


const buttons = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('yesCakes')
            .setLabel('Yes')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('noCakes')
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
