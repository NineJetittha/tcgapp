const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  set: { type: String, required: true },
  rarity: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  image_url: { type: String },
  tier: { type: String, enum: ['S', 'A', 'B', 'C', 'D', 'F', 'Unranked'], default: 'Unranked' }
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);