/**
 * Tests complets du projet Port Russell
 * @module tests/port-russell
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const { expect } = chai;

chai.use(chaiHttp);

describe('⚓ PORT RUSSELL - Tests complets', () => {
    let token;
    let catwayId;
    let reservationId;

    before(async () => {
        const loginRes = await chai.request(app)
            .post('/login')
            .send({
                email: 'capitainerie@port-russell.fr',
                password: 'PortRussell2026'
            });
        
        token = loginRes.body.token;
    });

    // TEST 1: Créer un catway
    it('TEST 1: Création catway', async () => {
        const res = await chai.request(app)
            .post('/api/catways')
            .set('Authorization', `Bearer ${token}`)
            .send({
                catwayNumber: 200,
                type: 'long',
                catwayState: 'Test complet'
            });

        expect(res).to.have.status(201);
        catwayId = res.body.data._id;
    });

    // TEST 2: Lister catways
    it('TEST 2: Liste catways', async () => {
        const res = await chai.request(app)
            .get('/api/catways')
            .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
    });

    // TEST 3: Détails catway
    it('TEST 3: Détails catway', async () => {
        const res = await chai.request(app)
            .get(`/api/catways/${catwayId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(200);
        expect(res.body.data).to.have.property('_id', catwayId);
    });

    // TEST 4: Modifier état catway
    it('TEST 4: Modification état catway', async () => {
        const res = await chai.request(app)
            .patch(`/api/catways/${catwayId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ catwayState: 'État modifié' });

        expect(res).to.have.status(200);
        expect(res.body.data.catwayState).to.equal('État modifié');
    });

    // TEST 5: Créer réservation
    it('TEST 5: Création réservation', async () => {
        const res = await chai.request(app)
            .post(`/api/catways/${catwayId}/reservations`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                clientName: 'Test Client',
                boatName: 'Test Boat',
                checkIn: '2026-06-01T10:00:00Z',
                checkOut: '2026-06-08T10:00:00Z'
            });

        expect(res).to.have.status(201);
        reservationId = res.body.data._id;
    });

    // TEST 6: Lister réservations
    it('TEST 6: Liste réservations', async () => {
        const res = await chai.request(app)
            .get(`/api/catways/${catwayId}/reservations`)
            .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
    });

    // TEST 7: Détails réservation
    it('TEST 7: Détails réservation', async () => {
        const res = await chai.request(app)
            .get(`/api/catways/${catwayId}/reservations/${reservationId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(200);
        expect(res.body.data.clientName).to.equal('Test Client');
    });

    // TEST 8: Supprimer réservation
    it('TEST 8: Suppression réservation', async () => {
        const res = await chai.request(app)
            .delete(`/api/catways/${catwayId}/reservations/${reservationId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(200);
    });

    // TEST 9: Supprimer catway
    it('TEST 9: Suppression catway', async () => {
        const res = await chai.request(app)
            .delete(`/api/catways/${catwayId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res).to.have.status(200);
    });

    // TEST BONUS 10: Validation mot de passe
    it('TEST 10: Validation mot de passe (min 6 caractères)', async () => {
        const res = await chai.request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test',
                email: 'test@test.fr',
                password: '12345'
            });

        expect(res).to.have.status(400);
        expect(res.body.error).to.include('6 caractères');
    });

    // TEST BONUS 11: Application fonctionnelle
    it('TEST 11: Page d\'accueil accessible', async () => {
        const res = await chai.request(app).get('/');
        expect(res).to.have.status(200);
    });
});