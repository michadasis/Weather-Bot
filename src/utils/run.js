const { Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const ascii = require('ascii-table');
const express = require('express');
require('dotenv').config();

const app = express();
app.all('/', (req, res) => {
  res.send('<p>Hosting Active</p>');
});

module.exports = async (client) => {
  app.listen(3000, () => console.log('Server is online!'));

  let table = new ascii('Commands');
  table.setHeading('Command', 'Load status');

  client.commands = new Collection();
  const slashCommands = [];

  const files = fs.readdirSync('./src/commands').filter(f => f.endsWith('.js'));
  for (const file of files) {
    try {
      const command = require(`../commands/${file}`);
      if (!command.data?.name) {
        table.addRow(file, 'skipped');
        continue;
      }
      client.commands.set(command.data.name, command);
      slashCommands.push(command.data.toJSON());
      table.addRow(file, 'OK');
    } catch (err) {
      console.error(`Failed to load ${file}:`, err.message);
      table.addRow(file, 'error');
    }
  }

  console.log(table.toString());

  const rest = new REST({ version: '10' }).setToken(process.env.token);
  try {
    console.log(`Registering ${slashCommands.length} slash commands...`);
    await rest.put(
      Routes.applicationCommands(process.env.clientId),
      { body: slashCommands }
    );
    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Failed to register slash commands:', error);
  }
};