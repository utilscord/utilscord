const { EmbedBuilder } = require("@discordjs/builders")
const countries = require("../constants/gtf-metadata/countries.json")
const embeds = require("../constants/gtf-metadata/embed.json")

class GuessTheFlag {
    constructor(message, options) {
        if(!message || typeof message != 'object') throw new Error("[ Utilscord Error ] Cannot start a Guess the Flag game without a valid message!")
        const embedData = options.embeds
        this.embeds = {}
        if(!embedData || typeof embedData != 'object') this.embeds = embeds
        if(!embedData?.starting) this.embeds.starting = embeds.starting
        if(!embedData?.won) this.embeds.won = embeds.won
        if(!embedData?.lost) this.embeds.lost = embeds.lost
        if(!embedData?.timeout) this.embeds.timeout = embeds.timeout

        this.isSlashCommand = options?.isSlashCommand || false

        this.isSlashCommand ? this.author = message.user : this.author = message.author

        this.randomCountry = this._getRandomCountry()

        this.givenTime = options.givenTime || 60000

        this.message = message
    }

    _getRandomCountry() {
        const country = countries[Math.floor(Math.random() * countries.length)]
        return {
            name: country,
            image: `https://countryflagsapi.com/png/${country.toLowerCase().replace(/ /g, "%20")}`
        }
    }

    async start() {
        const startingEmbed = this.embeds.starting

        const embed = new EmbedBuilder()
        .setTitle(String(startingEmbed.title))
        .setDescription(String(startingEmbed.description).replace(/{timestamp}/g, `<t:${Math.floor((Date.now() + this.givenTime) / 1000)}:R>`))
        .setImage(String(startingEmbed.image).replace(/{flag-image-url}/g, this.randomCountry.image))
        .setThumbnail(startingEmbed.thumbnail)
        .setAuthor({ name: `${String(startingEmbed.author.name).replace(/{author}/g, this.author.username)}`, iconURL: `${String(startingEmbed.author.name).replace(/{author-avatar}/g, this.author.displayAvatarURL())}`, url: startingEmbed.url })
        .setFooter(startingEmbed.footer)

        this.message.reply({ embeds: [embed] })

        const filter = m => m.author.id === this.author.id

        const collector = this.message.channel.createMessageCollector({ filter, time: this.givenTime })

        collector.on('collect', m => {
            
        })
    }
}

module.exports = GuessTheFlag