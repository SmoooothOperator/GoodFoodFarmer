const getFarmableObjects = require("../utils/getFarmableObjects");
const values = require("./values");
const { Client, interaction } = require("discord.js");

const getNewLevelUnlocks = async (query) => {
  let newLevelUnlocks = [];
  try {
    const val = await values.findOne(query);

    const farmableObjects = getFarmableObjects();

    for (const farmableObject of farmableObjects) {
      const object = farmableObject;
      console.log(object);
      if (object.level === val.level) {
        newLevelUnlocks.push(`${object.icon}${object.name}`);
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
  return newLevelUnlocks;
};

module.exports = getNewLevelUnlocks;

//takes in level of user, spews out new things unlocked
