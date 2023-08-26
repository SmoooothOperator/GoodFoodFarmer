const { Schema, model } = require("mongoose");

const levelSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0,
  },
  money: {
    type: Number,
    default: 10,
  },
  landAvaliable: {
    type: Number,
    default: 2,
  },
  landOccupied: {
    type: Number,
    default: 0,
  },
  planted: [
    {
      cropName: {
        type: String,
      },
      cropNumber: {
        type: Number,
      },
      landTaken: {
        type: Number,
      },
      timeLeft: {
        type: Number,
      },
      harvestable: {
        type: Boolean,
        default: false,
      },
    },
  ],
  items: [
    {
      itemName: String,

      itemValue: {
        type: Number,
        default: 0,
      },
    },
  ],
});

module.exports = model("values", levelSchema);
