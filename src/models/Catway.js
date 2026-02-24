/**
 * Modèle Catway pour MongoDB
 * @module models/Catway
 */

const mongoose = require('mongoose');

/**
 * Schéma catway
 * @typedef {Object} CatwaySchema
 * @property {number} catwayNumber - Numéro du pont (unique)
 * @property {string} type - Type du catway (long/short)
 * @property {string} catwayState - Description de l'état
 * @property {Date} createdAt - Date de création
 * @property {Date} updatedAt - Date de mise à jour
 */
const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, 'Le numéro de catway est requis'],
    unique: true,
    min: [1, 'Le numéro doit être positif']
  },
  type: {
    type: String,
    required: [true, 'Le type est requis'],
    enum: {
      values: ['long', 'short'],
      message: 'Le type doit être "long" ou "short"'
    }
  },
  catwayState: {
    type: String,
    required: [true, 'La description de l\'état est requise'],
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Catway', catwaySchema);