const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Get current weather information for a city')
    .addStringOption(opt =>
      opt.setName('city')
        .setDescription('The city name to look up')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('units')
        .setDescription('Temperature units (default: Celsius)')
        .addChoices(
          { name: 'Celsius', value: 'metric' },
          { name: 'Fahrenheit', value: 'imperial' },
          { name: 'Kelvin', value: 'standard' },
        )
    ),

  async run(client, interaction) {
    await interaction.deferReply();

    const city = interaction.options.getString('city');
    const units = interaction.options.getString('units') || 'metric';
    const unitSymbol = units === 'metric' ? 'C' : units === 'imperial' ? 'F' : 'K';

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${process.env.apikey}`
      );

      const d = response.data;
      const currentTemp = Math.ceil(d.main.temp);
      const maxTemp = d.main.temp_max;
      const minTemp = d.main.temp_min;
      const feelsLike = d.main.feels_like;
      const humidity = d.main.humidity;
      const wind = d.wind.speed;
      const pressure = d.main.pressure;
      const cloudness = d.weather[0].description;
      const icon = d.weather[0].icon;
      const country = d.sys.country;
      const cityName = d.name;

      // Also show Kelvin conversions if user picked Celsius or Fahrenheit
      const tempC = units === 'metric' ? currentTemp : units === 'imperial' ? ((currentTemp - 32) * 5) / 9 : currentTemp - 273.15;
      const kelvin = (tempC + 273.15).toFixed(2);
      const maxKelvin = (parseFloat(maxTemp) + (units === 'metric' ? 273.15 : units === 'imperial' ? 255.372 : 0)).toFixed(2);
      const minKelvin = (parseFloat(minTemp) + (units === 'metric' ? 273.15 : units === 'imperial' ? 255.372 : 0)).toFixed(2);

      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setAuthor({ name: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTitle(`${cityName}, ${country} -- ${currentTemp}\u00B0${unitSymbol}`)
        .setDescription(`**${cloudness.charAt(0).toUpperCase() + cloudness.slice(1)}**`)
        .setThumbnail(`https://openweathermap.org/img/w/${icon}.png`)
        .addFields(
          { name: 'Temperature', value: `${currentTemp}\u00B0${unitSymbol}`, inline: true },
          { name: 'Feels Like', value: `${Math.ceil(feelsLike)}\u00B0${unitSymbol}`, inline: true },
          { name: '\u200B', value: '\u200B', inline: true },
          { name: 'Max Temp', value: `${maxTemp}\u00B0${unitSymbol}`, inline: true },
          { name: 'Min Temp', value: `${minTemp}\u00B0${unitSymbol}`, inline: true },
          { name: '\u200B', value: '\u200B', inline: true },
          { name: 'Humidity', value: `${humidity}%`, inline: true },
          { name: 'Wind Speed', value: `${wind} m/s`, inline: true },
          { name: 'Pressure', value: `${pressure} hPa`, inline: true },
          { name: 'Temp in Kelvin', value: `${kelvin} K`, inline: true },
          { name: 'Max in Kelvin', value: `${maxKelvin} K`, inline: true },
          { name: 'Min in Kelvin', value: `${minKelvin} K`, inline: true },
        )
        .setFooter({ text: 'Powered by OpenWeatherMap | Made by Michh#7658' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      if (err.response?.status === 404) {
        await interaction.editReply({ content: `Could not find a city called **${city}**. Please check the spelling and try again.`, ephemeral: true });
      } else {
        console.error(err);
        await interaction.editReply({ content: 'Something went wrong fetching weather data. Try again later.', ephemeral: true });
      }
    }
  }
};
