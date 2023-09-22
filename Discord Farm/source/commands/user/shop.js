const { EmbedBuilder } = require("discord.js");
const getAllLevelUnlocks = require("../../data_models/allObjectsUnlocked");
const capitalizeFirstLetter = require("../../utils/capitalizeFirstLetter");
module.exports = {
  /**
   *
   * @param {*} client
   * @param {*} interaction
   */

  name: "shop",
  description: "Gives you catalog of the farm shop",
  //devOnly: Boolean,
  //testOnly; Boolean,
  //options:

  callback: async (client, interaction) => {
    try {
      const query = {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      };

      const embed = new EmbedBuilder()
        .setTitle("Good Food Farmer Shop🧺")

        .setDescription("Happy shopping!")
        .setColor("Random");

      const allUnlocks = await getAllLevelUnlocks(query);
      console.log(allUnlocks);
      for (const unlock of allUnlocks) {
        //get crop info
        itemInfo = require(`../../objects/${unlock}`);

        let hour = Math.round(itemInfo.time / 3600);

        let min;
        if (itemInfo.time < 60) {
        } else {
          min = Math.round((itemInfo.time % 3600) / 60);
        }

        let sec = (itemInfo.time % 3600) % 60;

        embed.addFields({
          name: `${itemInfo.icon}${capitalizeFirstLetter(unlock)}`,
          value: `Cost: 🪙${itemInfo.value}x\nYield: ${itemInfo.yield}\nTime: ${
            hour !== 0 ? `${hour}h` : ""
          } ${min !== 0 ? `${min}m` : ""} ${sec !== 0 ? `${sec}s` : ""}`,
          inline: true,
        });
      }
      // embed.addFields({
      //   name: `🟫Land`,
      //   value: `Cost: 🪙x1000`,
      //   inline: true,
      // });

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(`There was an error:: ${error}`);
      interaction.reply("Invalid command!");
    }
  },
};
