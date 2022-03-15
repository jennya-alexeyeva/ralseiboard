const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { DateTime } = require('luxon');

/**
 * Set server timezone
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-timezone')
		.setDescription('Set the timezone of the server'),
	async execute(interaction) {
		await interaction.reply({
			embeds: [new MessageEmbed()
				.setColor('#4dcc8e')
				.setTitle('Set Server Timezone')
				.setDescription(
					'Please go [here](https://kevinnovak.github.io/Time-Zone-Picker/) to select a timezone.')],
			fetchReply: true,
		}).then(() => {
			const collector = interaction.channel.createMessageCollector({ filter: m => m.author.id === interaction.user.id, max: 1 });

			collector.on('collect', async message => {
				const timeZone = message.content.replace(' ', '_');
				const testTime = DateTime.now().setZone(timeZone);
				if (!testTime.isValid) {
					await interaction.followUp({ content: 'Invalid timezone.' });
				}
				else {
					interaction.client.connection.query(`UPDATE settings SET timezone = '${timeZone}' WHERE ServerId = '${interaction.guild.id}'`);
					await interaction.followUp(`Timezone set to ${timeZone}.`);
				}
			});
		});
	},
};
