# Weather Bot

A Discord bot that fetches live weather data for any city using the OpenWeatherMap API, built with discord.js v14 and slash commands.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Commands](#commands)
- [License](#license)

---

## Features

- Live weather data powered by the OpenWeatherMap API
- Temperature display in Celsius, Fahrenheit, or Kelvin (user's choice)
- Shows temperature, feels like, min/max, humidity, wind speed, pressure, and cloudiness
- Full slash command support (discord.js v14)
- Dynamic /help command that auto-generates from command files
- Auto-registers slash commands on startup
- Express keep-alive server for hosting on platforms like Glitch or Replit

---

## Project Structure

```
weatherbot/
|-- index.js              # Entry point, client setup and event routing
|-- server.js             # Express keep-alive server
|-- package.json
|-- .env                  # Your secret tokens (never commit this)
|-- .env.example          # Template for required environment variables
|-- src/
    |-- utils/
    |   |-- run.js        # Loads and registers all slash commands
    |-- commands/
        |-- weather.js    # Main weather lookup command
        |-- ping.js       # Latency check
        |-- help.js       # Dynamic help command
```
---
### Invite the bot to your server

```
https://discord.com/oauth2/authorize?client_id=793235319511318548&scope=bot+applications.commands&permissions=277025459200
```

The `applications.commands` scope is required for slash commands to work.

---

## Commands

| Command | Description |
|---|---|
| `/weather <city> [units]` | Get current weather for a city. Units can be Celsius, Fahrenheit, or Kelvin |
| `/ping` | Check bot latency and API heartbeat |
| `/help` | View all available commands |

### Weather command details

The `/weather` command returns:

- Current temperature, feels like, max and min temperature
- Humidity, wind speed, and pressure
- Cloud conditions description
- Temperature also shown in Kelvin regardless of selected units
- Weather icon from OpenWeatherMap

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
