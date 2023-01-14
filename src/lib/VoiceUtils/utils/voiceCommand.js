const fs = require("fs")
const {
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior
} = require("@discordjs/voice")

class VoiceCommands {
    constructor(connection) {
        this.voice = connection
        this.player = undefined
    }

    get connection() {
        return this.voice
    }

    set connection(connection) {
        if(!connection || typeof connection != 'object') throw new TypeError(`[ Utilscord Error ] Voice Connection must be a type of object. Got ${typeof connection} instead.`)

        this.voice = connection
    }

    playFile(path) {
        if(!path) throw new Error("[ Utilscord Error ] Cannot play audio without a file path")
        if(fs.existsSync(path)) throw new Error("[ Utilscord Error ] path must be a valid file path.")

        const stream = fs.createReadStream(path)

        const resource = createAudioResource(stream)

        const player = this.player ? this.player : createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        })

        this.connection.subscribe(player)

        player.play(resource)
    }
}

module.exports = VoiceCommands