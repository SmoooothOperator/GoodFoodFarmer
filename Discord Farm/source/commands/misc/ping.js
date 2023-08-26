module.exports = {
  name: "ping",
  description: "Ping",
  //devOnly: Boolean,
  //testOnly; Boolean,
  //options:

  callback: (client, interaction) => {
    interaction.reply(` ${client.ws.ping}ms`);
  },
};
