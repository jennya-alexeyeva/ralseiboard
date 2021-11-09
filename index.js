// Require the necessary discord.js classes

const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const mysql = require('mysql2');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the collection with the key as the command name and the value
    // as the exported module
    client.commands.set(command.data.name, command);
}

/*
client.connection = mysql.createConnection({
    port: process.env.port,
    host: process.env.host,
    user: process.env.username,
    password: process.env.password,
    database: process.env.database
});
client.connection.connect();

client.on('guildCreate', guild => {
    client.connection.query(`CREATE TABLE \`messages-${guild.id}\` (` +
        'MessageId text, ' +
        'Author text, ' +
        'Channel text, ' +
        'Day int, ' +
        'Time int, ' +
        'Bot boolean)'
    )
})

client.on('guildDelete', guild => {
    client.connection.query(`DROP TABLE IF EXISTS \`messages-${guild.id}\``);
})

client.on('messageCreate', msg => {
    client.connection.query(`INSERT IGNORE INTO \`messages-${msg.guildId}\` (MessageId, Author, Channel, Day, Time, Bot) VALUES('${msg.id}', '${msg.author.id}', '${msg.channel.id}', ${msg.createdAt.getDay()}, ${msg.createdAt.getHours()}, ${msg.author.bot})`)
})

client.on('messageDelete', msg => {
    client.connection.query(`DELETE FROM \`messages-${msg.guildId}\` WHERE MessageId='${msg.id}'`)
})
*/
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
})

// Login to Discord with your client's token
client.login(process.env.token);
