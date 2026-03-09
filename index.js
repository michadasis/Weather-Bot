const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const run = require('./src/utils/run');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

client.on('clientReady', async () => {
  console.log(`${client.user.username} is online.`);
  await run(client);
  client.user.setActivity('the weather | /help', { type: ActivityType.Watching });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.run(client, interaction);
  } catch (error) {
    console.error(error);
    const msg = { content: 'There was an error running this command.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg);
    } else {
      await interaction.reply(msg);
    }
  }
});

client.login(process.env.token);
