const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency'),

  async run(client, interaction) {
    await interaction.deferReply();
    const latency = Date.now() - interaction.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);
    await interaction.editReply(`Pong!\nMessage latency: **${latency}ms** | API heartbeat: **${apiLatency}ms**`);
  }
};
