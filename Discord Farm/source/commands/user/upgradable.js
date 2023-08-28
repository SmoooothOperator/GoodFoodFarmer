const { EmbedBuilder } = require("discord.js");
const capitalizeFirstLetter = require("../../utils/capitalizeFirstLetter");
const getAllUpgrades = require("../../data_models/allUpgrades");
const values = require("../../data_models/values");

module.exports = {
  /**
   *
   * @param {*} client
   * @param {*} interaction
   */

  name: "upgradables",
  description: "Gives you catalog of the avaliable upgrades",
  //devOnly: Boolean,
  //testOnly; Boolean,
  //options:

  callback: async (client, interaction) => {
    try {
      const query = {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      };

      const val = await values.findOne(query);

      const embed = new EmbedBuilder()
        .setTitle("Farm Upgrades ⬆️")

        .setDescription("Have money must upgrade, no money go away.")
        .setColor("Random");

      const allUnlocks = await getAllUpgrades(query);
      console.log(allUnlocks);
      for (const unlock of allUnlocks) {
        //get crop info
        itemInfo = require(`../../upgrades/${unlock}`);
        embed.addFields({
          name: `${itemInfo.icon}${capitalizeFirstLetter(unlock)}`,
          value: `Cost: 🪙${Math.round(
            itemInfo.value * Math.exp((1 / 8) * val.level)
          )}x`,
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
