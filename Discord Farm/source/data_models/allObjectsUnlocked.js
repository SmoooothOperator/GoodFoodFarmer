const getFarmableObjects = require("../utils/getFarmableObjects");
const values = require("./values");
const { Client, interaction } = require("discord.js");

const getAllLevelUnlocks = async (query) => {
  let allLevelUnlocks = [];
  try {
    const val = await values.findOne(query);

    const farmableObjects = await getFarmableObjects();

    for (const farmableObject of farmableObjects) {
      const object = farmableObject;
      if (object.level <= val.level) {
        allLevelUnlocks.push(`${object.name}`);
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
  return allLevelUnlocks;
};

module.exports = getAllLevelUnlocks;

//takes in level of user, spews out new things unlocked
