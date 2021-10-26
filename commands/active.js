const {SlashCommandBuilder} = require("@discordjs/builders")

/**
 * See most active users/channels/what have you. Mostly just SQL practice for when I build the webapp lol.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("active")
        .setDescription("See the activity on this server!")
        .addSubcommand(subcommand => subcommand
            .setName("channels")
            .setDescription("What are your most active channels?"))
        .addSubcommand(subcommand => subcommand
            .setName("users")
            .setDescription("Who are the most active users in this channel?")),
        async execute(interaction) {
            if (interaction.options.getSubcommand() === "channels") {
                interaction.client.connection.query(`SELECT COUNT(MessageId), Channel FROM \`messages-${interaction.guildId}\` WHERE Author=${interaction.user.id} GROUP BY Channel ORDER BY Count(MessageId) DESC;`,
                async (error, results, _) => {
                    if (error) {
                        await interaction.reply({content: `Error loading messages: ${error}.`, ephemeral: true});
                    }
                    const slicedArray = results.slice(0, 5);
                    let replyString = "";
                    for (let elt of slicedArray) {
                        replyString += `<#${elt['Channel']}>: ${elt['COUNT(MessageId)']} messages\n`;
                    }
                    await interaction.reply(replyString);
                })
            } else if (interaction.options.getSubcommand() === "users") {
                interaction.client.connection.query(`SELECT COUNT(MessageId), Author FROM \`messages-${interaction.guildId}\` WHERE Channel=${interaction.channelId} GROUP BY Author ORDER BY Count(MessageId) DESC;`,
                async (error, results, _) => {
                    if (error) {
                        await interaction.reply({content: `Error loading messages: ${error}.`, ephemeral: true});
                    }
                    const slicedArray = results.slice(0, 5);
                    let replyString = "";
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
                })
            }
        }
}