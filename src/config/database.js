/**
 * Configuration de la base de données MongoDB
 * @module config/database
 */

const mongoose = require('mongoose');

/**
 * Établit la connexion à MongoDB
 * @returns {Promise} Promesse de connexion
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connecté: ${conn.connection.host}`);
    console.log(`📦 Base de données: ${conn.connection.name}`);
    
    // Gestion des erreurs après connexion
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erreur MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB déconnecté');
    });

    return conn;
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;