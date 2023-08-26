const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const values = require("../../data_models/values");
const { Client, interaction } = require("discord.js");
const sleep = require("../../utils/delay");
let itemInfo;

module.exports = {
  /**
   *
   * @param {*} client
   * @param {*} interaction
   */

  name: "plant",
  description: "plant a thing",
  //devOnly: Boolean,
  //testOnly; Boolean,
  options: [
    {
      name: "item",
      description: "item you are planting.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "quantity",
      description: "number of item you are planting",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    try {
      //Creates an object according to the user input{name, number}
      const plantItem = {
        itemName: interaction.options.getString("item").toLowerCase(),
        itemValue: interaction.options.getNumber("quantity"),
      };

      //Creates an object for user checking in database
      const query = {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      };

      itemInfo = require(`../../objects/${plantItem.itemName}`);

      console.log(`planting ${plantItem.itemName} x${plantItem.itemValue}`);

      //Gets the user's data
      const val = await values.findOne(query);

      //Important Variables
      let land_total = val.landAvaliable + val.landOccupied;
      let land_taken_up = Math.ceil(plantItem.itemValue / itemInfo.oneTile);

      //If player is initialized
      if (val) {
        //If the player has enough land to plant
        if (val.landAvaliable < land_taken_up) {
          interaction.reply(
            `You don't have enough land avaliable! \nLandAvaliable(${val.landAvaliable}/${land_total})`
          );
          return;
        }
        //Checks if the player has the plant they want to plant
        const itemExists = val.items.some(
          (item) => item.itemName === plantItem.itemName
        );

        if (itemExists) {
          const existingItemIndex = val.items.findIndex(
            (item) => item.itemName === plantItem.itemName
          );

          if (val.items[existingItemIndex].itemValue < plantItem.itemValue) {
            interaction.reply(`You don't have enough seeds!`);
            return;
          }
          //Update planted object
          val.planted.push({
            cropName: plantItem.itemName,
            cropNumber: plantItem.itemValue,
            landTaken: land_taken_up,
            timeLeft: itemInfo.time,
          });

          //Subtract seeds
          val.items[existingItemIndex].itemValue -= plantItem.itemValue;

          //Occupy the lands
          val.landAvaliable -= land_taken_up;
          val.landOccupied += land_taken_up;

          await val.save();

          const plantIndex = val.planted.length - 1;

          interaction.reply(
            `Sucessfully planted **${plantItem.itemValue}x ${plantItem.itemName}**${itemInfo.icon}`
          );

          //Time left for this plant action
          for (let i = 0; i < itemInfo.time; i += 5) {
            await sleep(5000);
            val.planted[plantIndex].timeLeft -= 5;
            await val.save();
            // console.log(`Time left: ${val.planted[plantIndex].timeLeft}`);
            // console.log(i);
          }
          //Set harvestable status
          val.planted[plantIndex].timeLeft = 0;
          val.planted[plantIndex].harvestable = true;

          await val.save();

          //If not, then push a new object into the array with info on new item
        } else {
          interaction.reply(`You don't have the selected seeds!`);
          return;
        }
      }
    } catch (error) {
      console.log(`There was an error: ${error}`);
      interaction.reply("Invalid command!");
    }
  },
};
