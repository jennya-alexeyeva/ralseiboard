/**
 * Deletes all commands. Change applicationGuildCommands(clientId, guildId) to
 * applicationCommands(clientId) to delete commands for all servers.
 */
const { REST } = require('@discordjs/rest'); 
const { Routes } = require('discord-api-types/v9');
const { token, clientId, guildId } = require('./config.json');
    

const rest = new REST({ version: '9' }).setToken(token);
rest.get(Routes.applicationGuildCommands(clientId, guildId))
    .then(data => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises);
    })
    