/**
 * Modèle Réservation pour MongoDB
 * @module models/Reservation
 */

const mongoose = require('mongoose');

/**
 * Schéma réservation
 * @typedef {Object} ReservationSchema
 * @property {number} catwayNumber - Numéro du catway réservé
 * @property {string} clientName - Nom du client
 * @property {string} boatName - Nom du bateau
 * @property {Date} checkIn - Date de début
 * @property {Date} checkOut - Date de fin
 * @property {Date} createdAt - Date de création
 * @property {Date} updatedAt - Date de mise à jour
 */
const reservationSchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, 'Le numéro de catway est requis'],
    ref: 'Catway',
    index: true
  },
  clientName: {
    type: String,
    required: [true, 'Le nom du client est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  boatName: {
    type: String,
    required: [true, 'Le nom du bateau est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  checkIn: {
    type: Date,
    required: [true, 'La date de début est requise'],
    validate: {
      validator: function(value) {
        return value >= new Date(new Date().setHours(0,0,0,0));
      },
      message: 'La date de début ne peut pas être dans le passé'
    }
  },
  checkOut: {
    type: Date,
    required: [true, 'La date de fin est requise'],
    validate: {
      validator: function(value) {
        return value > this.checkIn;
      },
      message: 'La date de fin doit être postérieure à la date de début'
    }
  }
}, {
  timestamps: true
});

// Index pour recherche rapide
reservationSchema.index({ catwayNumber: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);