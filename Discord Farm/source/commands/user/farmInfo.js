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
  name: "farm",
  description: "Shows activities in each of your land tiles.",
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

      //Important Variables
      let land_total = val.landAvaliable + val.landOccupied;
      let land_avaliable = val.landAvaliable;
      let farmActive;
      const user = interaction.member;
      let guildName = user.nickname;
      if (guildName === null) {
        guildName = user.user.username;
      }
      //If player is initialized
      if (!val) {
        interaction.reply("No farm found!");
        return;
      }

      //If the player has planted anything
      if (val.planted.length === 0) {
        farmActive = false;
      }

      const embed = new EmbedBuilder()
        .setTitle(`${guildName}'s Farm 🏡`)
        .setDescription(`🟫Farm's free tiles: ${land_avaliable}/${land_total}`)
        .setColor("Random");

      //Inactivity status
      if (farmActive === false) {
        embed.addFields({
          name: `Farm inactive...`,
          value: "Go plant something you lazy hidiot!",
          inline: true,
        });
        interaction.reply({ embeds: [embed] });

        return;
      }

      //Main loop to add all crops growing status
      for (const planted of val.planted) {
        const harvestable = planted.harvestable;
        let growthState;
        itemInfo = require(`../../objects/${planted.cropName}`);

        //Check if the crop is still growing
        if (harvestable === true) {
          growthState = "⛏️Ready to be harvested";
        } else {
          growthState = "🌱Growing";
        }

        embed.addFields({
          name: `${itemInfo.icon} ${planted.cropName} x${planted.cropNumber} `,
          value: `Status: ${growthState} \nTime left: ⏱️${planted.timeLeft}s`,
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
