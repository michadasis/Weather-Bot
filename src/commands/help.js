const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('View all available commands'),

  async run(client, interaction) {
    const commandsPath = path.join(__dirname, '../commands');
    const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

    const commandList = files
      .map(file => {
        try {
          const cmd = require(path.join(commandsPath, file));
          if (!cmd.data?.name) return null;
          return `\`/${cmd.data.name}\` -- ${cmd.data.description}`;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const embed = new EmbedBuilder()
      .setTitle('Weather Bot -- Command List')
      .setColor(0x0099FF)
      .setDescription(commandList.join('\n'))
      .setFooter({ text: 'Made by Michh#7658', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
