const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");

const messageText = "WARNING: This command will crawl through every single message sent in the server. As such, it will take a while to run, and during its runtime, it will not be able to listen to new messages. It is highly recommended that you run this when the server is inactive. Proceed anyway?";

const buttons = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('yesInit')
            .setLabel('Yes')
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('noInit')
            .setLabel('No')
            .setStyle('DANGER')
    )

async function fetch(channel) {
    let msgs = [];
    let channelMessagesMap = await channel.messages.fetch({limit: 100});
    let channelMessages = Array.from(channelMessagesMap.values())
    while (channelMessages.length > 0) {
        msgs = msgs.concat(channelMessages);
        channelMessagesMap = await channel.messages.fetch({
            limit: 100,
            before: channelMessagesMap.last().id
        })
        channelMessages = Array.from(channelMessagesMap.values())
    }
    return msgs;
}

async function fetchAllMessages(client, guildId, channelSentIn) {
    for (const channel of await client.guilds.cache.get(guildId).channels.cache) {
        let ch = channel[1];
        if (ch.type === "GUILD_TEXT") {
            let msgs = await fetch(ch);

            for (const msg of msgs) {
                client.connection.query(`INSERT INTO \`messages-${guildId}\` (MessageId, Author, Channel, Day, Time, Bot) VALUES('${msg.id}', '${msg.author.id}', '${msg.channel.id}', ${msg.createdAt.getDay()}, ${msg.createdAt.getHours()}, ${msg.author.bot})`)
            }
            await channelSentIn.send(`Processed channel ${ch["name"]}`);
            await channelSentIn.bulkDelete(1, true);
        }
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("init")
        .setDescription("Initialize the Ralseiboard database with the server's previous messages."),
    async execute(interaction) {
        await interaction.reply({content: messageText,
                components: [buttons], fetchReply: true})
            .then(message => {
                const collector = message.createMessageComponentCollector({componentType: 'BUTTON', time: 15000});

                collector.on("collect", async i => {
                    if (i.user.id !== interaction.user.id) {
                        i.reply({content: "Only the person who called the command can use the buttons.", ephemeral: true})
                    } else {
                        let buttonsCopy = message.components[0];
                        buttonsCopy.components.map(button => button.setDisabled(true));
                        await message.edit({content: messageText, components: [buttonsCopy]});

                        if (i.customId === 'yesInit') {
                            await i.reply("Beginning command.");
                            await fetchAllMessages(interaction.client, interaction.guildId, interaction.channel);
                            i.channel.send("Finished initializing.");
                        } else if (i.customId === 'noInit') {
                            await i.reply("Cancelling command.");
                        }
                    }
                })
            })
    } // TODO write init script that runs when the yes button is pressed, kind of based on my failed mostactive command
}