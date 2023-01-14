# utilscord
⚒️ Utilscord. An easy-to-use and beginner friendly library that simplifies the process of bot development.

![made-with-javascript](https://user-images.githubusercontent.com/70205403/212464775-56285100-2a69-4a1f-b021-14213b3cf8ad.svg)


## Example

```js
const { Client, GatewayIntentBits: Intents } = require("discord.js")
const { GuessTheFlag } = require("utilscord")

const client = new Client({
    intents: [Intents.Guilds, Intents.GuildMessages, Intents.MessageContent, Intents.GuildMembers]
})

client.on("messageCreate", async (message) => {
    if(message.content === "!guesstheflag") {
        const gtf = new GuessTheFlag(message, {
            onGetRandomCountry: (country) => {
                console.log(country) // return -> { name: 'country', image: 'flag url' }
            }
        })
        await gtf.start()
    }
})
.on("ready", () => console.log(`${client.user.tag} is ready!`))

client.login("SUP3R-C00L-B0T-T0K3N")
```

# Templates

We also provide a lot of templates to jump start your development. An example of this is our Discord.js V-12 Styled voice template

```js
const { Client, GatewayIntentBits: Intents } = require("discord.js")
const { VoiceUtilities } = require("utilscord")

const client = new Client({
    intents: [
        Intents.Guilds,
        Intents.GuildVoiceStates, // Voice state event is important if you want to use the voice template
        Intents.MessageContent,
        Intents.GuildMessages,
        Intents.GuildPresences
    ]
})

const voiceUtils = new VoiceUtilities(client)

client.on("messageCreate", async (message) => {
    if(message.content === "!play") {
        const channel = message.member.voice.channel
        
        const utils = voiceUtils.connect(channel)

        utils.playFile('/path/to/your/file.mp3')

        const { connection, player, playFile } = utils // this is the object voice utils return when you call <VoiceUtilities>#connect
    }
})

client.login("SUP3R-C00L-B0T-T0K3N")
```