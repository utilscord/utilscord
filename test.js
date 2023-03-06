const { EmbedBuilder } = require("discord.js")

const embed = new EmbedBuilder()
.setTitle("hello")

console.log(embed instanceof EmbedBuilder)