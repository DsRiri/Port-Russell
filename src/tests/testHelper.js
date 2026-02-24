/**
 * Helpers pour les tests
 * @module tests/helpers
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const User = require('../models/User');
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');

chai.use(chaiHttp);
const { expect } = chai;

/**
 * Obtient un token d'authentification pour les tests
 * @returns {Promise<string>} Token JWT
 */
async function getAuthToken() {
    const loginRes = await chai.request(app)
        .post('/login')
        .send({
            email: process.env.ADMIN_EMAIL || 'capitainerie@port-russell.fr',
            password: process.env.ADMIN_PASSWORD || 'PortRussell2026'
        });
    
    return loginRes.body.token;
}

/**
 * Crée un catway de test
 * @param {string} token - Token JWT
 * @returns {Promise<Object>} Catway créé
 */
async function createTestCatway(token) {
    const catwayNumber = Math.floor(Math.random() * 1000) + 100;
    
    const res = await chai.request(app)
        .post('/api/catways')
        .set('Authorization', `Bearer ${token}`)
        .send({
            catwayNumber,
            type: 'long',
            catwayState: 'Catway de test'
        });
    
    return res.body.data;
}

/**
 * Crée une réservation de test
 * @param {string} token - Token JWT
 * @param {string} catwayId - ID du catway
 * @returns {Promise<Object>} Réservation créée
 */
async function createTestReservation(token, catwayId) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 30);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);
    
    const res = await chai.request(app)
        .post(`/api/catways/${catwayId}/reservations`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            clientName: 'Test Client',
            boatName: 'Test Boat',
            checkIn: startDate.toISOString(),
            checkOut: endDate.toISOString()
        });
    
    return res.body.data;
}

/**
 * Nettoie les données de test
 * @param {string} token - Token JWT
 */
async function cleanupTestData() {
    // Supprimer les catways créés pendant les tests
    await Catway.deleteMany({ catwayNumber: { $gte: 100 } });
    
    // Supprimer les utilisateurs de test
    await User.deleteMany({ email: { $regex: /test.*@test\.fr/ } });
}

module.exports = {
    getAuthToken,
    createTestCatway,
    createTestReservation,
    cleanupTestData,
    expect
};