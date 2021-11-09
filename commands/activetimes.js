const {SlashCommandBuilder} = require("@discordjs/builders")

const dayOfWeek = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"]

function query(channelOrAuthor, id, interaction) {
    interaction.client.connection.query(`SELECT COUNT(MessageId), Day, Time FROM \`messages-${interaction.guildId}\` WHERE ${channelOrAuthor}=${id} GROUP BY Day, Time ORDER BY Count(MessageId) DESC;`,
            async (error, results, _) => {
                if (error) {
                    await interaction.reply({content: `Error loading messages: ${error}.`, ephemeral: true});
                }
                const top = results[0];
                const lowerBoundAm = top['Time'] < 12
                const upperBoundAm = top['Time'] + 1 < 12 || top['Time'] + 1 === 24
                const lowerBound = top['Time'] % 12 === 0 ? 12 : top['Time'] % 12
                const upperBound = (top['Time'] + 1) % 12 === 0 ? 12 : (top['Time'] + 1) % 12
                await interaction.reply(`<${channelOrAuthor === "Channel" ? "#" : "@"}${id}> is most active on ${dayOfWeek[top['Day']]} between ${lowerBound} ${lowerBoundAm ? "am" : "pm"} and ${upperBound} ${upperBoundAm ? "am" : "pm"}!`);
            })
}

/**
 * See the most active time of a user or channel. Also just SQL practice for the webapp
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("activetimes")
        .setDescription("What time is this user/channel the most active?")
        .addSubcommand(subcommand => subcommand
            .setName("channel")
            .setDescription("What time is this channel most active?")
            .addStringOption(option =>
                option.setName("target")
                    .setDescription("The channel to check. Leave blank to check this channel.")))
        .addSubcommand(subcommand => subcommand
            .setName("user")
            .setDescription("What time is this user most active?").addStringOption(option =>
                option.setName("target")
                    .setDescription("The user to check. Leave blank to check yourself."))),
    async execute(interaction) {
        await interaction.reply("This command is defunct while Jennya figures out how to host databases remotely now that Ralseiboard is on a server. Our apologies for the delay! -Jennya + Ralsei");
        /*
        let id = interaction.options.getString('target');
        let strippedId = null;
        if (id) {
            strippedId = id.replace(/\D/g,"")
            if (!strippedId) {
                await interaction.reply({content: "Invalid input.", ephemeral: true});
                return;
            }
        }
        if (interaction.options.getSubcommand() === "channel") {
            if (strippedId && !interaction.guild.channels.cache.some(channel => channel.id === strippedId)) {
                await interaction.reply({content: "Invalid channel.", ephemeral: true})
                return;
            }
            query("Channel", strippedId ?? interaction.channel.id, interaction);
        } else if (interaction.options.getSubcommand() === "user") {
            if (strippedId && !interaction.guild.members.cache.some(user => user.id === strippedId)) {
                await interaction.reply({content: "Invalid user.", ephemeral: true})
                return;
            }
            query("Author", strippedId ?? interaction.user.id, interaction);
        }
    */
    }
}