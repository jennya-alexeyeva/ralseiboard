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

const messageText = "I baked you some yummy cakes! Do you want them?"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("yummycakes")
        .setDescription("Will you accept some yummy cakes from Ralsei?"),
    async execute(interaction) {
        await interaction.reply({content: messageText, 
            components: [buttons], fetchReply: true})
            .then(message => {
                const collector = message.createMessageComponentCollector({componentType: 'BUTTON', time: 15000});

                collector.on("collect", async i => {
                    if (i.user.id !== interaction.user.id) {
                        i.reply({content: "Only the person who called the command can use the buttons.", ephemeral: true});
                    } else {
                        let buttonsCopy = message.components[0];
                        buttonsCopy.components.map(button => button.setDisabled(true));
                        await message.edit({ content: messageText, components: [buttonsCopy] });
                    
                        if (i.customId === 'yesCakes') {
                            await i.reply("Yay! I'll give you one right now :D 🎂")
                        }
                        else if (i.customId === 'noCakes') {
                            await i.reply("Aw :( Maybe some other time?");
                        }
                    }
                })
            })
    }
};
