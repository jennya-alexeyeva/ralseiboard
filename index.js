// Require the necessary discord.js classes
// noinspection JSIgnoredPromiseFromCall

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
    // Set a new item in the collection with the key as the command name and the value
    // as the exported module
    client.commands.set(command.data.name, command);
}

client.on('guildCreate', guild => {
    // add code to make database
    // TODO make optional init command that crawls through channels and adds all message info to database
})

client.on('guildDelete', guild => {
    // add code to delete database
})

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) await commandExecute(interaction)
    if (interaction.isButton()) await buttonExecute(interaction)
	})

async function commandExecute(interaction) {
    const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}

async function buttonExecute(interaction) {
    // TODO figure out a way to optimize this without an endless if else like i'm fucking yandev
    let buttons = interaction.message.components[0]
    buttons.components.map(button => button.setDisabled(true))
    await interaction.message.edit({content: 'I baked you some yummy cakes! Do you want them?', components: [buttons]})

    if (interaction.customId === 'yesCakes') {
        await interaction.reply("Yay! I'll give you one right now :D 🎂")
    }
    else if (interaction.customId === 'noCakes') {
        await interaction.reply("Aw :( Maybe some other time?");
    }
}

// Login to Discord with your client's token
client.login(token);
