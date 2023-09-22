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

  name: "sell",
  description: "Sells an item.",
  //devOnly: Boolean,
  //testOnly; Boolean,
  options: [
    {
      name: "item",
      description: "item you are selling.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "quantity",
      description: "number of item you are selling",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    try {
      //Creates an object according to the user input{name, number}
      const newItem = {
        itemName: interaction.options.getString("item").toLowerCase(),
        itemValue: interaction.options.getNumber("quantity"),
      };

      //Creates an object for user checking in database
      const query = {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      };

      itemInfo = require(`../../objects/${newItem.itemName}`);

      console.log(`${newItem.itemName} | ${newItem.itemValue}`);

      //Gets the user's data
      const val = await values.findOne(query);

      //If user is a player already, update values
      if (val) {
        //Checks if the player has the new item in their inventory already
        const itemExists = val.items.some(
          (item) => item.itemName === newItem.itemName
        );

        //If they do have the item in inventory, begin sale
        console.log("selling...");
        if (itemExists) {
          const existingItemIndex = val.items.findIndex(
            (item) => item.itemName === newItem.itemName
          );
          //check if the player has enough to sell
          if (val.items[existingItemIndex].itemValue < newItem.itemValue) {
            interaction.reply(`You don't have enough of this item!`);
            return;
          }

          //decrement item value
          val.items[existingItemIndex].itemValue -= newItem.itemValue;

          //calculate how much money the sale makes
          const cash = itemInfo.value * newItem.itemValue;

          //add cash to player's money
          val.money += cash;

          await val.save();
        } else {
          interaction.reply(
            `You don't have any ${newItem.itemName} in your inventory!`
          );
        }

        //If use is a new player, initiate their database instance
      } else {
        interaction.reply(
          "Please initialize your farmer first by buying an item from /shop!"
        );

        await newVal.save();
      }
      interaction.reply(
        `Successfully sold **${newItem.itemValue} ${newItem.itemName}**${itemInfo.icon}`
      );
    } catch (error) {
      console.log(`There was an error: ${error}`);
      interaction.reply("Invalid command!");
    }
  },
};
