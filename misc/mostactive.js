const {SlashCommandBuilder} = require("@discordjs/builders");
/**
 * Gets the given user's most active channel. Not currently useable as a command, but I'm keeping the code because it has a good
 * foundation for the future webapp.
 */

/**
 * Fetches all messages from the given channel and filters them by whether the author is the same as the person who called the command.
 * @param {*} channel the channel being crawled
 * @param {*} userId the ID of the author of the messages
 * @returns the number of messages that the person who called the command sent in the given channel
 */
async function fetch(channel, userId) {
    let msgs = 0;
    let channelMessages = await channel.messages.fetch({limit: 100});

    while (channelMessages.size > 0) {
        msgs += channelMessages.filter(msg => msg.author.id == userId).size
        channelMessages = await channel.messages.fetch({
            limit: 100,
            before: channelMessages.last().id
        });
    }
    return msgs;
}

/**
 * Fetches all messages sent by the given user and maps them to their corresponding channel
 * @param {*} userId the ID of the user sending the command
 * @param {*} client the discord.js client
 * @param {*} guildId the ID of the server the command was sent in
 * @returns a map of each channel to the number of messages the user sent in it
 */
async function fetchAllMessages(userId, client, guildId) {
    let channelToNumMessages = {}

    for (const channel of await client.guilds.cache.get(guildId).channels.cache) {
        let ch = channel[1];
        if (ch.type === 'GUILD_TEXT') {
            let msgCount = await fetch(ch, userId);           
            channelToNumMessages[ch] = msgCount
            console.log(`${ch.name}: ${msgCount} messages`)   
        }
    }
    return channelToNumMessages;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mostactive")
        .setDescription("See the channels you're the most active in!"),
    async execute(interaction, client) {
        let userId = interaction.user.id
        let guildId = interaction.guild.id
        let channel = interaction.channel
        await interaction.reply("I'll take a while to calculate this! Be patient!");
        await fetchAllMessages(userId, client, guildId).then(async channelToNumMessages => {
            var channels = Object.keys(channelToNumMessages).map(key => {
                return [key, channelToNumMessages[key]];
            });
            channels.sort((first, second) => {
                return second[1] - first[1];
            })
            let replyCount = Math.min(5, )
            let replyString = "Your top 5 channels:\n"
            for (let i = 0; i < replyCount; i++) {
                replyString += `${channels[i][0]}: ${channels[i][1]} messages\n`
            }
            await channel.send(replyString);
        })
    }
}
