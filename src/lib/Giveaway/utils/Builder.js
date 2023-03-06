const { EmbedBuilder, GuildMember, User, Guild } = require("discord.js")

class GiveawayBuilder {
    constructor() {
        this.giveawayDuration = 172_800_000 + Date.now() // 2 days
        this.prize = undefined
    }

    setDuration(durationInMS) {
        if(!durationInMS || typeof durationInMS != 'number') throw new TypeError(`Utilscord Giveaway Error: Expected duration to be a number, got ${typeof durationInMS} instead`)

        this.giveawayDuration = durationInMS + Date.now()
    }

    setEmbed(embed) {
        if(!embed || embed instanceof EmbedBuilder) throw new TypeError(`Utilscord Giveaway Error: Expected embed to be an EmbedBuilder`)

        this.embed = embed.toJSON()
    }

    setPrize(prize) {
        if(!prize || typeof prize != "string") throw new Error("Utilscord Giveaway Error: Prize cannot be undefined")
        
        this.prize = prize

        return this
    }

    setHost(host) {
        if(host instanceof GuildMember || host instanceof User) throw new Error(`Utilscord Giveaway Error: Host of the giveaway must be an instence of GuildMember or a User`)

        host instanceof GuildMember ? this.host = host.user : this.host = host

        return this
    }

    setGuild(guild) {
        if(guild instanceof Guild) throw new Error(`Utilscord Giveaway Error: Guild must be an instance of Guild`)
        
        this.guild = guild

        return this
    }

    #getDefaultEmbed() {
        return new EmbedBuilder()
        .setTitle("A new giveaway is starting!")
        .setDescription(`Prize: **${this.prize}**\nEnding in: <t:${Math.floor((Date.now()) + this.giveawayDuration / 1000)}`)
        .setColor("Blurple")
        .addFields(
            { name: "Hosted By", value: this.host.username, inline: true }
        )
        .toJSON()
    }

    _compile() {
        if(!this?.prize) throw new Error('Error during compiling giveaway for registry. Prize cannot be undefined')

        if(!this.embed) this.embed = this.#getDefaultEmbed()

        return this
    }
}

module.exports = GiveawayBuilder