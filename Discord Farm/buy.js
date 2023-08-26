const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const values = require("../../data_models/values");
const { Client, interaction } = require("discord.js");

/**
 *
 * @param {*} client
 * @param {*} interaction
 */

const newItem = {
  itemName: interaction.options.get("item"),
  itemValue: interaction.options.get("quantity"),
};
const query = {
  userId: message.author.id,
  guildId: message.guild.id,
};

module.exports = {
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
      description: "number of item you are buying.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    try {
      const val = await values.findOne(query);
      if (val) {
        val.updateOne({ query }, { $push: { items: newItem } });
        console.log(`Updated Items`);

        await val.save();
      } else {
        const newVal = new values({
          userId: message.author.id,
          guildId: message.guild.id,
          items: { newItem },
        });

        await newVal.save();
      }
    } catch (error) {
      console.log(`There was an error: ${error}`);
    }
  },
};
