const EventEmitter = require("node:events")
const GiveawayBuilder = require("./utils/Builder")

class Giveaways extends EventEmitter {
    constructor(client) {
        if(!client || typeof client != 'object') throw new TypeError(`Utilscord Error: A valid discord.js client must be provided. Expected the type 'object', got ${typeof client} instead!`)

        this.client = client

        this.giveaways = {}

        setInterval(() => {
            const currentDate = Date.now()

            for(const giveaway in this.giveaways) {
                if(this.giveaways[giveaway].giveawayDuration >= currentDate) {
                    this.emit("giveawayEnded", this.giveaways[giveaway])
                    delete this.giveaways[giveaway]
                } 
            }
        }, 150_00)
    }

    registerGiveaway(giveawayBuilder) {
        if(!giveawayBuilder instanceof GiveawayBuilder) throw new Error("Utilscord Error: giveawayBuilder must be an instance of GiveawayBuilder")

        const giveaway = giveawayBuilder._compile()
        this.giveaways[String(Date.now() + giveaway.giveawayDuration)] = giveaway
    }

    unregisterGiveaway(guildId) {
        if(!guildId) throw new Error('Utilscord Error: Guild ID is required to delete giveaways')

        if(this.giveaways[guildId]) delete this.giveaways[guildId]
    }

    dayToMS(days) {
        if(!days || typeof days != 'number') throw new TypeError("Utilscord Error: Cannot convert days to MS using the '"+typeof days+"' type.")

        return days * 8.64e+7
    }

    hourToMS(hour) {
        if(!hour || typeof hour != 'number') throw new TypeError("Utilscord Error: Cannot convert hours to MS using the '" + typeof hour + "' type")

        return (hour * 60) * 1000
    }


}

module.exports = Giveaways