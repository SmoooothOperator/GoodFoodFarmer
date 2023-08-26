const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const values = require("../../data_models/values");
const { Client, interaction } = require("discord.js");
const calculateLevelXp = require("../../utils/calculateLevelXp");

let itemInfo;

module.exports = {
  /**
   *
   * @param {*} client
   * @param {*} interaction
   */
  name: "inventory",
  description: "Shows a player's inventory",
  //devOnly: Boolean,
  //testOnly; Boolean,
  //options:

  callback: async (client, interaction) => {
    try {
      //Creates an object for user checking in database
      const query = {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      };

      //Gets the user's data
      const val = await values.findOne(query);

      //If player is initialized
      if (!val) {
        interaction.reply("No profile found!");
        return;
      }

      //Important Variables
      let land_total = val.landAvaliable + val.landOccupied;
      let land_avaliable = val.landAvaliable;
      let farmActive;
      const user = interaction.member;
      let guildName = user.nickname;
      if (guildName === null) {
        guildName = user.user.username;
      }

      //If the player has planted anything
      if (val.planted.length === 0) {
        farmActive = false;
      }

      const items = val.items;
      const embed = new EmbedBuilder()
        .setTitle(`📦${guildName}'s inventory`)
        .setDescription("inventory details:")
        .setColor("Random");

      for (const item of items) {
        itemInfo = require(`../../objects/${item.itemName}`);

        embed.addFields({
          name: `${itemInfo.icon}${item.itemName}`,
          value: `x${item.itemValue}`,
          inline: true,
        });
      }

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(`There was an error: ${error}`);
      interaction.reply("Invalid command!");
    }
  },
};
