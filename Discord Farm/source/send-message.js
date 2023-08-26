require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const roles = [
  {
    id: "1135747187721113623",
    label: "Red",
  },
  {
    id: "1128939704998436894",
    label: "Green",
  },
];

//Sends a console message when bot is online
client.on("ready", async (c) => {
  try {
    const channel = await client.channels.cache.get("1135748379675218010");
    if (!channel) return;

    const row = new ActionRowBuilder();

    roles.forEach((role) => {
      row.components.push(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Primary)
      );
    });

    await channel.send({
      content: "Claim or remove a role below.",
      components: [row],
    });
    process.exit();
  } catch (error) {
    console.log(error);
  }
});

//login
client.login(process.env.TOKEN);
