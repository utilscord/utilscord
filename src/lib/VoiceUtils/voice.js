const {
    joinVoiceChannel,
    getVoiceConnection
} = require("@discordjs/voice")
const VoiceCommands = require('./utils//voiceCommand')

class VoiceUtilities {
    constructor(client) {
        if(!client || typeof client != 'object') throw new Error("[ Utilscord Error ] Cannot initialize voice utils without a Discord.js client.")
        this.client = client
    }

    connect(channel) {
        if(!channel || typeof channel != 'object') throw new Error("[ Utilscord Error] Cannot join a voice channel without a valid voice channel.")
        const doesConnectionExists = getVoiceConnection(channel.guild.id)
        if(doesConnectionExists) return this._getVoiceUtils(doesConnectionExists)
        const guild = channel.guild
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator
        })
        const commands = this._getVoiceUtils(connection)

        return commands
    }

    _getVoiceUtils(connection) {
        return new VoiceCommands(connection)
    }
}

module.exports = VoiceUtilities