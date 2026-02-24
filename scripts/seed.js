/**
 * Script d'initialisation de la base de données
 * Crée l'admin par défaut et importe les données
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import des modèles
const User = require('../src/models/User');
const Catway = require('../src/models/Catway');
const Reservation = require('../src/models/Reservation');

/**
 * Initialise la base de données
 */
async function seed() {
  try {
    console.log('🚀 Début de l\'initialisation de la base de données...');
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // 1. Créer l'administrateur
    await seedAdmin();
    
    // 2. Importer les catways
    await seedCatways();
    
    // 3. Importer les réservations
    await seedReservations();

    console.log('\n🎉 Initialisation terminée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Déconnecté de MongoDB');
  }
}

/**
 * Crée l'administrateur par défaut
 */
async function seedAdmin() {
  console.log('\n--- Utilisateurs ---');
  
  const adminEmail = process.env.ADMIN_EMAIL || 'capitainerie@port-russell.fr';
  const adminPassword = process.env.ADMIN_PASSWORD || 'PortRussell2026';
  
  const existingAdmin = await User.findOne({ email: adminEmail });
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const admin = new User({
      name: 'Capitainerie',
      email: adminEmail,
      password: hashedPassword
    });
    
    await admin.save();
    console.log('✅ Admin créé');
    console.log(`   📧 Email: ${adminEmail}`);
    console.log(`   🔑 Mot de passe: ${adminPassword}`);
  } else {
    console.log('✅ Admin déjà existant');
  }
}

/**
 * Importe les catways depuis le fichier JSON
 */
async function seedCatways() {
  console.log('\n--- Catways ---');
  
  try {
    const catwaysData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/catways.json'), 'utf8')
    );
    
    let count = 0;
    for (const catwayData of catwaysData) {
      const existing = await Catway.findOne({ catwayNumber: catwayData.catwayNumber });
      if (!existing) {
        const catway = new Catway(catwayData);
        await catway.save();
        count++;
      }
    }
    
    console.log(`✅ ${count} nouveaux catways importés`);
    console.log(`📊 Total: ${await Catway.countDocuments()} catways`);
    
  } catch (error) {
    console.error('❌ Erreur import catways:', error.message);
  }
}

/**
 * Importe les réservations depuis le fichier JSON
 */
async function seedReservations() {
  console.log('\n--- Réservations ---');
  
  try {
    const reservationsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/reservations.json'), 'utf8')
    );
    
    let count = 0;
    for (const resData of reservationsData) {
      // Vérifier si le catway existe
      const catway = await Catway.findOne({ catwayNumber: resData.catwayNumber });
      if (catway) {
        const existing = await Reservation.findOne({
          catwayNumber: resData.catwayNumber,
          checkIn: new Date(resData.checkIn),
          clientName: resData.clientName
        });
        
        if (!existing) {
          const reservation = new Reservation({
            ...resData,
            checkIn: new Date(resData.checkIn),
            checkOut: new Date(resData.checkOut)
          });
          await reservation.save();
          count++;
        }
      }
    }
    
    console.log(`✅ ${count} nouvelles réservations importées`);
    console.log(`📊 Total: ${await Reservation.countDocuments()} réservations`);
    
  } catch (error) {
    console.error('❌ Erreur import réservations:', error.message);
  }
}

// Exécuter le script
seed();