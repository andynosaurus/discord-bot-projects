require('dotenv').config();

const fetch = require('node-fetch');

const Discord = require('discord.js');

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const getCatPicture = async () => {
  const result = await fetch('https://api.thecatapi.com/v1/images/search');
  const json = await result.json();
  const url = await json[0].url;

  return url;
}

const getMtgRandomCard = async () => {
  try {
    const result = await fetch(`https://api.scryfall.com/cards/random`);
    const json = await result.json();
    const imageUrl = await json.image_uris.normal;

    return imageUrl;
  } catch (e) {
    console.log(e.message);
  }
}

const getMtgCardByName = async (name) => {
  try {
    const result = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${name}`);

    const json = await result.json();

    console.log(json);

    if (json.object === 'error') {
      return json.details;
    }
    const imageUrl = await json.image_uris.normal;

    return imageUrl;
  } catch (e) {
    console.log(e.message);
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on('messageCreate', async msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  } else if (msg.content === '!Olá, Robô') {
    msg.reply(`Olá, ${msg.author}!`);
  } else if (msg.content === '!Adeus, Robô') {
    msg.reply(`Adeus, ${msg.author}!`);
  } else if (msg.content === '!cat') {
    msg.channel.send({
      content: 'Um gatinho para alegrar o seu dia!',
      files: [await getCatPicture()]
    });
  } else if (msg.content === '!randomCard') {
    msg.channel.send({
      files: [await getMtgRandomCard()]
    });
  } else if (msg.content.includes('!card', 0)) {
    const name = msg.content.slice(6);

    console.log(name)

    const card = await getMtgCardByName(name);

    if (name === '' || card.includes('No cards found matching')) {
      msg.channel.send(card);
    } else {
      msg.channel.send({
        files: [card]
      });
    }
  }
});

client.login(process.env.TOKEN);
