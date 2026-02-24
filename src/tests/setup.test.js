/**
 * Configuration des tests
 * @module tests/setup
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../../app');
require('dotenv').config();

chai.use(chaiHttp);

before(async function() {
    this.timeout(10000);
    
    // Attendre que MongoDB soit connecté
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI);
    }
    
    console.log('✅ MongoDB prêt pour les tests');
});

after(async function() {
    // Nettoyer les données de test si nécessaire
    if (process.env.NODE_ENV === 'test') {
        // Optionnel: supprimer les données créées pendant les tests
    }
    
    // Fermer la connexion MongoDB
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
});