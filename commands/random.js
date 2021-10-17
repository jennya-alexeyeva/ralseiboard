const {SlashCommandBuilder} = require("@discordjs/builders")
const { execute } = require("./textbox")

const listOfImages = ["https://cdn.shopify.com/s/files/1/0014/1962/products/product_DR_ralsei_plush_photo3.png?v=1550098980",
                      "https://static.wikia.nocookie.net/deltarune/images/b/b5/Ralsei_battle_wan.png",
                      "https://static.wikia.nocookie.net/deltarune/images/e/e1/Ralsei_battle_nurse.png",
                      "https://static.wikia.nocookie.net/deltarune/images/a/a9/Ralsei_battle_shocked.png",
                      "https://static.wikia.nocookie.net/deltarune/images/b/b8/Ralsei_overworld_shocked.png",
                      "https://static.wikia.nocookie.net/deltarune/images/9/98/Ralsei_artwork_body.jpg"]

const listOfMemes = ["https://pbs.twimg.com/media/FBrLGZqXoAQtFZ4.png",
                     "https://pbs.twimg.com/media/CsxIqkWWAAA7KBO.jpg",
                     "https://c.tenor.com/AbqZsnE1y4wAAAAC/ralsei-gun.gif",
                     "https://i.kym-cdn.com/entries/icons/facebook/000/038/462/Untitled_2.jpg",
                     "https://media.discordapp.net/attachments/852037066027040789/899099620066603018/image0.png",
                     "https://media.discordapp.net/attachments/895457995952111677/898180317893001266/image0.jpg",
                     "https://tenor.com/view/deltarune-ralsei-help-gif-23230382",
                     "https://tenor.com/view/ralsei-deltarune-gif-23259488"]

const listOfGifs = ["https://media.riffsy.com/images/e0e41e0f9a34ed17aed6cbdeea888739/tenor.gif",
                    "https://media.riffsy.com/images/847ee5097ba852c0ad97e44c2e6dc108/tenor.gif",
                    "https://media.riffsy.com/images/1a026cf833570fb1c2e76a26146f297a/tenor.gif",
                    "https://static.wikia.nocookie.net/deltarune/images/f/fb/Ralsei_battle_guard_hatless.gif"]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Brighten your day with some random Ralsei!')
        .addSubcommand(subcommand => subcommand
            .setName('image')
            .setDescription('Sends a random image of Ralsei'))
        .addSubcommand(subcommand => subcommand
            .setName('meme')
            .setDescription('Sends a random meme of Ralsei'))
        .addSubcommand(subcommand => subcommand
            .setName('gif')
            .setDescription('Sends a random GIF of Ralsei')),
        async execute(interaction) {
            let randNum = Math.random()
            if (interaction.options.getSubcommand() === 'image') {
                await interaction.reply({
                    files: [listOfImages[Math.floor(randNum*listOfImages.length)]]
                });
            } else if (interaction.options.getSubcommand() === 'meme') {
                await interaction.reply({
                    files: [listOfMemes[Math.floor(randNum*listOfMemes.length)]]
                });
            } else if (interaction.options.getSubcommand() === 'gif') {
                await interaction.reply({
                    files: [listOfGifs[Math.floor(randNum*listOfGifs.length)]]
                });
            }
        }
}