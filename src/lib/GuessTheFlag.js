const { EmbedBuilder, AttachmentBuilder } = require("discord.js")
const countries = require("../constants/gtf-metadata/countries.json")
const embeds = require("../constants/gtf-metadata/embed.json")
const EventEmitter = require("node:events")

class GuessTheFlag extends EventEmitter {
    constructor(message, options) {
        if(!message || typeof message != 'object') throw new Error("[ Utilscord Error ] Cannot start a Guess the Flag game without a valid message!")
        super()
        const embedData = options?.embeds
        this.embeds = {}
        if(!embedData || typeof embedData != 'object') this.embeds = embeds
        if(!embedData?.starting) this.embeds.starting = embeds.starting
        if(!embedData?.won) this.embeds.won = embeds.won
        if(!embedData?.lost) this.embeds.lost = embeds.lost
        if(!embedData?.timeout) this.embeds.timeout = embeds.timeout

        this.isSlashCommand = options?.isSlashCommand || false

        this.isSlashCommand ? this.author = message.user : this.author = message.author

        this.randomCountry = this._getRandomCountry()

        if(options?.onGetRandomCountry && typeof options?.onGetRandomCountry == 'function')
            options.onGetRandomCountry(this.randomCountry)

        this.givenTime = options?.givenTime || 60000

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
        .setAuthor({ name: `${String(startingEmbed.author.name).replace(/{author}/g, this.author.username)}`, iconURL: `${String(startingEmbed.author.iconURL).replace(/{author-avatar}/g, this.author.displayAvatarURL())}` })
        .setFooter(startingEmbed.footer)

        if(startingEmbed.thumbnail)
            embed.setThumbnail(startingEmbed.thumbnail)

        this.message.reply({ embeds: [embed] })

        const filter = m => m.author.id === this.author.id

        const collector = this.message.channel.createMessageCollector({ filter, idle: this.givenTime })

        collector.on('collect', m => {
            if(m.content.toLowerCase() === this.randomCountry.name.toLowerCase()) {
                this._sendWonEmbed(m)
                this.emit('sessionEnded', "won")
                collector.stop()
            } else {
                this._sendLostEmbed(m)
                collector.stop()
            }
        })
        collector.on('end', (_, reason) => {
            if(reason === 'idle') {
                this._sendIdleEmbed(message)
            }
        })
    }

    _sendWonEmbed(message) {
        const embed = new EmbedBuilder()
        .setTitle(this.embeds.won.title)
        .setDescription(String(this.embeds.won.description).replace(/{author}/g, this.author.username))
        .setImage(String(this.embeds.won.image).replace(/{flag-image-url}/g, this.randomCountry.image))
        .setFooter(this.embeds.won.footer)

        try {
            embed.setAuthor({ name: `${String(this.embeds.won.author.name).replace(/{author}/g, this.author.username)}`, iconURL: `${String(this.embeds.won.author.iconURL).replace(/{author-avatar}/g, this.author.displayAvatarURL())}` })
        } catch {}

        if(this.embeds.won.thumbnail)
            embed.setThumbnail(this.embeds.won.thumbnail)

        message.reply({ embeds: [embed] })
    }

    _sendLostEmbed(message) {
        const embed = new EmbedBuilder()
        .setTitle(this.embeds.lost.title)
        .setDescription(String(this.embeds.lost.description).replace(/{author}/g, this.author.username).replace(/{country}/g, this.randomCountry.name))
        .setImage(String(this.embeds.lost.image).replace(/{flag-image-url}/g, this.randomCountry.image))
        .setAuthor({ name: `${String(this.embeds.lost.author.name).replace(/{author}/g, this.author.username)}`, iconURL: `${String(this.embeds.lost.author.iconURL).replace(/{author-avatar}/g, this.author.displayAvatarURL())}` })
        .setFooter(this.embeds.lost.footer)

        if(this.embeds.lost.thumbnail) 
            embed.setThumbnail(this.embeds.lost.thumbnail)

        message.reply({ embeds: [embed] })
    }

    _sendIdleEmbed(message) {
        const embed = new EmbedBuilder()
        .setTitle(this.embeds.idle.title)
        .setDescription(String(this.embeds.idle.description).replace(/{author}/g, this.author.username).replace(/{country}/g, this.randomCountry.name))
        .setImage(String(this.embeds.idle.image).replace(/{flag-image-url}/g, this.randomCountry.image))
        .setAuthor({ name: `${String(this.embeds.idle.author.name).replace(/{author}/g, this.author.username)}`, iconURL: `${String(this.embeds.idle.author.iconURL).replace(/{author-avatar}/g, this.author.displayAvatarURL())}` })
        .setFooter(this.embeds.idle.author.footer)

        if(this.embeds.idle.thumbnail) 
            embed.setThumbnail(this.embeds.idle.thumbnail)

        message.reply({ embeds: [embed] })
    }

    get country() {
        const country = this.randomCountry ? this.randomCountry : this._getRandomCountry()
        return country
    }

    set country({ name, image }) {
        this.randomCountry = {
            name: name,
            image: image
        }
    }
}

module.exports = GuessTheFlag