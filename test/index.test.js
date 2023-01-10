const { Client, GatewayIntentBits: Intents } = require("discord.js")
const { GuessTheFlag } = require("../index")

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

client.login("tkn")