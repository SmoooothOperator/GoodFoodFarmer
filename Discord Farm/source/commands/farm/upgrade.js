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

  name: "upgrade",
  description: "Buys an upgrade.",
  //devOnly: Boolean,
  //testOnly; Boolean,
  options: [
    {
      name: "upgrade",
      description: "upgrade you are buying.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    try {
      //Creates an object according to the user input{name, number}
      const newItem = {
        itemName: interaction.options.getString("upgrade").toLowerCase(),
      };

      //Creates an object for user checking in database
      const query = {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      };

      itemInfo = require(`../../upgrades/${newItem.itemName}`);

      console.log(`${newItem.itemName}`);

      //Gets the user's data
      const val = await values.findOne(query);

      //If user is a player already, update values
      if (val) {
        //If upgrade's value is less than player's money, return
        if (val.money < itemInfo.value) {
          interaction.reply(`You don't have enough money.`);
          return;
        }
        //If the upgrade's level is higher than player level
        if (val.level < itemInfo.level) {
          interaction.reply(
            `Your level is not high enough! \nThe upgrade you selected requires level ${itemInfo.level}.`
          );
        }
        //Apply upgrades and take away money
        let upgrade;
        if (newItem.itemName === "land") {
          upgrade = "landAvaliable";
        }
        val[upgrade] += 1;
        val.money -= itemInfo.value;

        await val.save();

        interaction.reply(
          `Successfully upgraded **${newItem.itemName}**${itemInfo.icon}`
        );

        //FOR FUTURE DEVELOPMENT: check what level the upgrade is

        //If val is NULL, return
      } else {
        interaction.reply(
          `Your farm is not initiated! Buy an item using /buy to start farming.`
        );
        return;
      }

      //If use is a new player, initiate their database instance
    } catch (error) {
      console.log(`There was an error: ${error}`);
      interaction.reply("Invalid command!");
    }
  },
};
