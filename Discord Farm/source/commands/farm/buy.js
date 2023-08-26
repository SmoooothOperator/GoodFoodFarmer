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

  name: "buy",
  description: "Buys an item.",
  //devOnly: Boolean,
  //testOnly; Boolean,
  options: [
    {
      name: "item",
      description: "item you are buying.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "quantity",
      description: "number of item you are buying",
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
        if (val.money < newItem.itemValue * itemInfo.value) {
          interaction.reply(`You don't have enough money.`);
          return;
        }

        //Checks if the player has the new item in their inventory already
        const itemExists = val.items.some(
          (item) => item.itemName === newItem.itemName
        );

        //If they do have the item in inventory, increment the value
        if (itemExists) {
          const existingItemIndex = val.items.findIndex(
            (item) => item.itemName === newItem.itemName
          );
          val.items[existingItemIndex].itemValue += newItem.itemValue;
          val.money -= newItem.itemValue * itemInfo.value;

          await val.save();

          //If not, then push a new object into the array with info on new item
        } else {
          val.items.push({
            itemName: newItem.itemName,
            itemValue: newItem.itemValue,
          });

          val.money -= newItem.itemValue * itemInfo.value;
          await val.save();
        }

        console.log(`Updated Items`);
        console.log(`${val.money}`);

        //If use is a new player, initiate their database instance
      } else {
        if (10 < newItem.itemValue * itemInfo.value) {
          interaction.reply(
            `You only have 🪙10x to start.. Please choose a lesser value to buy!`
          );
          return;
        }
        const newVal = new values({
          userId: interaction.user.id,
          guildId: interaction.guild.id,
          money: 10 - itemInfo.value * newItem.itemValue,
          items: { itemName: newItem.itemName, itemValue: newItem.itemValue },
        });

        await newVal.save();
      }
      interaction.reply(
        `Sucessfully bought **${newItem.itemValue} ${newItem.itemName}**${itemInfo.icon}`
      );
    } catch (error) {
      console.log(`There was an error: ${error}`);
      interaction.reply("Invalid command!");
    }
  },
};
