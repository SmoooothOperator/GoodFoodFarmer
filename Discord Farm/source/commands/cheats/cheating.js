const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const values = require("../../data_models/values");
const { Client, interaction } = require("discord.js");
let itemInfo;

module.exports = {
  /**
   *
   * @param {*} client
   * @param {*} interaction
   */

  name: "cheat",
  description: "Fast track progression to test functions",
  devOnly: true,
  //testOnly; Boolean,
  options: [
    {
      name: "cheat",
      description: "Parameter to increase",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "amount",
      description: "amount of the parameter you are adding",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    // {
    //   name: "user",
    //   description: "user to target",
    //   type: ApplicationCommandOptionType.String,
    //   required: true,
    // },
  ],

  callback: async (client, interaction) => {
    try {
      //Creates an object according to the user input{name, number}
      const cheat = {
        cheatName: interaction.options.getString("cheat").toLowerCase(),
        cheatValue: interaction.options.getNumber("amount"),
      };

      //Creates an object for user checking in database
      const query = {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      };

      console.log(`CHEAT:${cheat.cheatName} | ${cheat.cheatValue}`);

      //Gets the user's data
      const val = await values.findOne(query);

      //If user is a player already, update values
      if (val) {
        val[cheat.cheatName] += cheat.cheatValue;

        await val.save();
      } else {
        interaction.reply(`No user found!`);
      }
      interaction.reply(
        `Sucessfully used Cheat **${cheat.cheatName} ${cheat.cheatValue}**`
      );
    } catch (error) {
      console.log(`There was an error: ${error}`);
      interaction.reply("Invalid command!");
    }
  },
};
