const { devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
  //See if the interaction is a chat command
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    //See if the commands the user used actually exists locally
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;

    //See if the command used is devs only
    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: `Only devs can use this command`,
          ephemeral: true,
        });
        return;
      }
    }

    //See if the commands are test server only
    if (commandObject.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        interaction.reply({
          content: `This command can't be ran here`,
          ephemeral: true,
        });
        return;
      }
    }

    //See if the person running the command has the perms for the command
    if (commandObject.permissionRequired?.length) {
      for (const permission of commandObject.permissionRequired)
        if (!interaction.member.permission.has(permission)) {
          interaction.reply({
            content: "Not enough permissions.",
            ephemeral: true,
          });
          return;
        }
    }

    //See if the bot has the required command (Currently Not Used)
    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "I don't have the required permissions.",
            ephemeral: true,
          });
          return;
        }
      }
    }

    //Runs the callback of each command
    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
};
