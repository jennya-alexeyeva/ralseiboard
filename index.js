// calculated very scientifically using heroku file size limits
const MAX_TABLE_SIZE = 18000;

// Require the necessary classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const mysql = require('mysql2');
const { DateTime } = require('luxon');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

// initialize event files
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
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


client.connection = mysql.createConnection(process.env.JAWSDB_URL);
client.connection.connect();

client.on('guildCreate', guild => {
	client.connection.query(`CREATE TABLE \`messages-${guild.id}\` (` +
        'MessageId varchar(18), ' +
        'Author text, ' +
        'Channel text, ' +
        'Day int, ' +
        'Time int, ' +
        'Bot boolean, PRIMARY KEY (MessageId))',
	);
	client.connection.query(`INSERT IGNORE INTO settings (ServerId, Timezone) VALUES ('${guild.id}', 'America/New_York')`);
});

client.on('guildDelete', guild => {
	client.connection.query(`DROP TABLE IF EXISTS \`messages-${guild.id}\``);
});

function getZone(guildId) {
	let timezone;
	client.connection.query(`SELECT timezone FROM settings WHERE ServerId = ${guildId}`,
		// eslint-disable-next-line no-unused-vars
		async (error, results, _) => {
			if (error) {
				console.log(error);
				return;
			}
			timezone = results[0]['timezone'];
		});
	return timezone;
}

client.on('messageCreate', msg => {
	const time = DateTime.fromMillis(msg.createdTimestamp);
	time.setZone(getZone(msg.guildId));
	client.connection.query(`INSERT IGNORE INTO \`messages-${msg.guildId}\` (MessageId, Author, Channel, Day, Time, Bot) VALUES('${msg.id}', '${msg.author.id}', '${msg.channel.id}', ${time.weekday}, ${time.hour}, ${msg.author.bot})`);
	client.connection.query(`SELECT COUNT(*) FROM \`messages-${msg.guildId}\``,
		async (error, results) => {
			if (error) {
				console.log(error);
				return;
			}
			if (results[0]['COUNT(*)'] > MAX_TABLE_SIZE) {
				client.connection.query(`DELETE FROM \`messages-${msg.guildId}\` ORDER BY MessageId ASC LIMIT 1`);
			}
		});
});

client.on('messageDelete', msg => {
	client.connection.query(`DELETE FROM \`messages-${msg.guildId}\` WHERE MessageId='${msg.id}'`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(process.env.token);
