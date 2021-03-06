const { SlashCommandBuilder } = require('@discordjs/builders');

/**
 * Queries the Undertale text box generator found here: https://www.demirramon.com/generators/undertale_text_box_generator
 * to generate a text box with something that Ralsei totally said
 */


const listOfExpressions = ['default', 'looking-down', 'looking-down-blush',
	'shocked', 'sad', 'smile', 'blush', 'happy', 'angry', 'concerned'];

// Expressions mapped to a name and value. Used to bulk add choices.
const listOfExpressionsMapped = listOfExpressions.map(value => {
	return [value, value];
});

const expressionsToHatRalsei = {
	'default': 'default',
	'looking-down': 'looking-down',
	'looking-down-blush': 'looking-down-blush',
	'shocked': 'shocked',
	'sad': 'sad',
	'smile': 'smile',
	'blush': 'smile-blush',
	'happy': 'happy',
	'angry': 'angry',
	'concerned': 'disappointed',
};

const expressionsToHatlessRalsei = {
	'default': 'default',
	'looking-down': 'looking-down',
	'looking-down-blush': 'blush-looking-down',
	'shocked': 'shocked',
	'sad': 'sad',
	'smile': 'smiling',
	'blush': 'blush',
	'happy': 'happy',
	'angry': 'angry',
	'concerned': 'concerned',
};

function buildRalseiUrl(type, expression, text) {
	return `https://www.demirramon.com/gen/undertale_text_box.png?text=${encodeURIComponent(text)}&box=deltarune&boxcolor=ffffff&character=${type === 'hat' ? 'deltarune-ralseidisguise' : 'deltarune-ralsei'}&expression=${expression}&charcolor=colored&font=determination&asterisk=ffffff&mode=darkworld`;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('textbox')
		.setDescription('Make Ralsei say anything you want!')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('Hat (chapter 1) or hatless (chapter 2) Ralsei?')
				.addChoice('hat', 'hat')
				.addChoice('hatless', 'hatless')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('expression')
				.setDescription('What expression will Ralsei have in the textbox?')
				.addChoices(listOfExpressionsMapped)
				.setRequired(true))
		.addStringOption(option =>
			option.setName('text')
				.setDescription('What will Ralsei say in the text box?')
				.setRequired(true)),
	async execute(interaction) {
		const ralseiType = interaction.options.getString('type');
		const ralseiExpression = (ralseiType === 'hat' ?
			expressionsToHatRalsei[interaction.options.getString('expression')] :
			expressionsToHatlessRalsei[interaction.options.getString('expression')]);
		const ralseiText = interaction.options.getString('text');

		const url = buildRalseiUrl(ralseiType, ralseiExpression, ralseiText);
		await interaction.reply({
			files: [url],
		});
	},
};
