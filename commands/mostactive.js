const {SlashCommandBuilder} = require("@discordjs/builders")

/*
/**
 * See most active users/channels/what have you. Mostly just SQL practice for when I build the webapp lol.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("mostactive")
        .setDescription("See the activity on this server!")
        .addSubcommand(subcommand => subcommand
            .setName("channels")
            .setDescription("What are the target's most active channels?")
            .addStringOption(option =>
                option.setName("target")
                .setDescription("The user to check. Leave blank to check yourself.")))
        .addSubcommand(subcommand => subcommand
            .setName("users")
            .setDescription("Who are the most active users in the target channel?")
            .addStringOption(option =>
                option.setName("target")
                .setDescription("The channel to check. Leave blank to check this channel."))),
        async execute(interaction) {
            let id = interaction.options.getString('target');
            let strippedId = null;
            if (id) {
                strippedId = id.replace(/\D/g, "");
                if (!strippedId) {
                    await interaction.reply({content: "Invalid input.", ephemeral: true});
                    return;
                }
            }
            if (interaction.options.getSubcommand() === "channels") {
                if (strippedId && !interaction.guild.members.cache.some(user=> user.id === strippedId)) {
                    await interaction.reply({content: "Invalid user.", ephemeral: true});
                    return;
                }
                if (!strippedId) {
                    strippedId = interaction.user.id
                }
                interaction.client.connection.query(`SELECT COUNT(MessageId), Channel FROM \`messages-${interaction.guildId}\` WHERE Author=${strippedId} GROUP BY Channel ORDER BY Count(MessageId) DESC;`,
                async (error, results, _) => {
                    if (error) {
                        await interaction.reply({content: `Error loading messages: ${error}.`, ephemeral: true});
                    }
                    const slicedArray = results.slice(0, 5);
                    // the lengths i go to avoid pinging
                    interaction.guild.members.fetch(strippedId)
                        .then(async user => {
                            let username = `${user.user.username}#${user.user.discriminator}`
                            let replyString = `${username}'s top 5 most active channels:\n`;
                            for (let elt of slicedArray) {
                                let channel;
                                try {
                                    channel = await interaction.guild.channels.fetch(elt['Channel'])
                                } catch {
                                    channel = null
                                }
                                replyString += `${channel ? `<#${channel.id}>` : "Unknown"}: ${elt['COUNT(MessageId)']} messages\n`;
                            }
                            await interaction.reply(replyString);
                        })
                })
            } else if (interaction.options.getSubcommand() === "users") {
                if (strippedId && !interaction.guild.channels.cache.some(channel => channel.id === strippedId)) {
                    await interaction.reply({content: "Invalid channel.", ephemeral: true});
                    return;
                }
                if (!strippedId) {
                    strippedId = interaction.channel.id
                }
                interaction.client.connection.query(`SELECT COUNT(MessageId), Author FROM \`messages-${interaction.guildId}\` WHERE Channel=${strippedId} GROUP BY Author ORDER BY Count(MessageId) DESC;`,
                async (error, results, _) => {
                    if (error) {
                        await interaction.reply({content: `Error loading messages: ${error}.`, ephemeral: true});
                    }
                    const slicedArray = results.slice(0, 5);
                    let replyString = `<#${strippedId}>'s 5 most active users:\n`;
                    for (let elt of slicedArray) {
                        let user;
                        try {
                            user = (await interaction.guild.members.fetch(elt['Author'])).user
                        } catch {
                            // The user has left the server.
                            user = null
                        }
                        replyString += `${user ? user.username : "Unknown"}#${user ? user.discriminator : "0000"}: ${elt['COUNT(MessageId)']} messages\n`;
                    }
                    await interaction.reply(replyString);
                }
            )
        }
    }
}