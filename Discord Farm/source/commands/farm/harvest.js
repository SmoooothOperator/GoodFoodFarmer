const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const values = require("../../data_models/values");
const { Client, interaction } = require("discord.js");
const sleep = require("../../utils/delay");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const getNewLevelUnlocks = require("../../data_models/objectLevels");

let itemInfo;
let levelUp = false;

module.exports = {
  /**
   *
   * @param {*} client
   * @param {*} interaction
   */

  name: "harvest",
  description: "Harvest everything that is ready to be harvested",
  //devOnly: true,
  //testOnly: true,

  callback: async (client, interaction) => {
    try {
      //Creates an object for user checking in database
      const query = {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      };

      console.log(`harvesting...`);

      //Gets the user's data
      const val = await values.findOne(query);

      //Important Variables
      let land_total = val.landAvaliable + val.landOccupied;

      //If player is initialized
      if (val) {
        //If the player has planted anything
        if (val.planted.length === 0) {
          interaction.reply(`You don't currently have anything planted! )`);
          return;
        }
        //Checks if the player has any harvestables
        const harvestIndices = val.planted
          .map((harvest, index) => {
            if (harvest.harvestable === true) {
              return index;
            }
          })
          .filter((index) => index !== undefined);

        if (harvestIndices.length === 0) {
          interaction.reply(
            `You don't have anything ready for harvest yet, check back later.`
          );
          return;
        }

        //Harvest each planted that is ready for harvest
        if (harvestIndices.length > 0) {
          for (let i = harvestIndices.length - 1; i >= 0; i--) {
            const index = harvestIndices[i];

            //get crop name
            const crop = val.planted[index].cropName;
            //get crop number
            const cropNum = val.planted[index].cropNumber;
            //get land taken
            const land = val.planted[index].landTaken;
            //get crop info
            itemInfo = require(`../../objects/${crop}`);
            //calculate total yield
            const yield = cropNum * itemInfo.yield;
            //calculate the xp generated
            const exp = itemInfo.xp * cropNum;

            //set land status
            val.landAvaliable += land;
            val.landOccupied -= land;

            //find crop in user inventory
            const existingItemIndex = val.items.findIndex(
              (item) => item.itemName === crop
            );
            //add yield to inventory
            val.items[existingItemIndex].itemValue += yield;
            //remove the planted element
            val.planted.splice(index, 1);
            //give xp to player
            val.xp += exp;

            console.log("Right here");
            await val.save();
          }
          await interaction.deferReply({ ephemeral: true });

          //**Need to add an embed later to list out everything added to inventory**
          await interaction.editReply(
            "Successfully harvested everything! {insert embed builder here}"
          );

          //give level up to user if applicable and reset xp
          if (val.xp > calculateLevelXp(val.level)) {
            val.xp = 0;
            val.level += 1;
            levelUp = true;
            await val.save();

            console.log("Right here");

            const newUnlocks = await getNewLevelUnlocks(query);
            console.log("Right here");

            console.log(newUnlocks);
            const embed = new EmbedBuilder()
              .setTitle(`You have leveled up to 🔰**level ${val.level}**!`)
              .setDescription(`New items unlocked!`)
              .setColor("Random");

            //Main loop to add all new items
            for (const newUnlock of newUnlocks) {
              embed.addFields({
                name: `${newUnlock}`,
                value: " ",
                inline: true,
              });
            }

            await interaction.followUp({ embeds: [embed] });
          }
        }
      }
    } catch (error) {
      console.log(`There was an error:: ${error}`);
      interaction.reply("Invalid command!");
    }
  },
};
