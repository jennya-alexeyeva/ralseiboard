// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

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
    // Set a new item in the collection with the key as the commmand name and the value
    // as the exported module
    client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) commandExecute(interaction)
    if (interaction.isButton()) buttonExecute(interaction)
	})

async function commandExecute(interaction) {
    const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}

async function buttonExecute(interaction) {
    console.log(interaction);
    if (interaction.customId == 'yes') {
        await interaction.reply("Yay! I'll give you one right now :D 🎂")
    }
    else if (interaction.customId == 'no') {
        await interaction.reply("Aw :( Maybe some other time?");
    }
}

// Login to Discord with your client's token
client.login(token);