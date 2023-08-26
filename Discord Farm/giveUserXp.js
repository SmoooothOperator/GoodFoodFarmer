const { Client, Message } = require("discord.js");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const values = require("../../data_models/values");
const cooldowns = new Set();
function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 *
 * @param {*} client
 * @param {*} message
 */

module.exports = async (client, message) => {
  if (
    !message.inGuild() ||
    message.author.bot ||
    cooldowns.has(message.author.id)
  )
    return;

  const xpToGive = getRandomXp(5, 15);

  const query = {
    userId: message.author.id,
    guildId: message.guild.id,
  };

  try {
    const lvl = await values.findOne(query);

    if (lvl) {
      lvl.xp += xpToGive;

      if (lvl.xp > calculateLevelXp(lvl.level)) {
        lvl.xp = 0;
        lvl.level += 1;

        message.channel.send(
          `${message.member} you have leveled up to **level ${lvl.level}**!`
        );
      }
      await lvl.save().catch((e) => {
        console.log(`Error saving updated ${e}`);
        return;
      });

      /*
      cooldown block if needed
      */
      //   cooldowns.add(message.author.id);
      //   setTimeout(() => {
      //     cooldowns.delete(message.author.id);
      //   }, 60000);
    }
    // if (!lvl)
    else {
      //create new level
      const newLvl = new values({
        userId: message.author.id,
        guildId: message.guild.id,
        xp: xpToGive,
      });

      await newLvl.save();
      /*
      cooldown block if needed
      */
      //   cooldowns.add(message.author.id);
      //   setTimeout(() => {
      //     cooldowns.delete(message.author.id);
      //   }, 60000);
    }
  } catch (error) {
    console.log(`Error giving xp: ${error}`);
  }
};
