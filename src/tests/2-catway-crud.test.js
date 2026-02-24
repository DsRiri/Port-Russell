/**
 * Tests CRUD Catways
 * @module tests/catway-crud
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const { expect } = chai;

chai.use(chaiHttp);

describe('🚤 CATWAYS - CRUD Tests (5 fonctionnalités)', () => {
    let token;
    let catwayId;

    before(async () => {
        const loginRes = await chai.request(app)
            .post('/login')
            .send({
                email: 'capitainerie@port-russell.fr',
                password: 'PortRussell2026'
            });
        
        // Récupérer le token depuis la session
        token = loginRes.body.token;
    });

    // TEST 1: Créer un catway
    describe('TEST 1: POST /api/catways', () => {
        it('✅ Devrait créer un nouveau catway', async () => {
            const catway = {
                catwayNumber: 99,
                type: 'long',
                catwayState: 'Catway de test'
            };

            const res = await chai.request(app)
                .post('/api/catways')
                .set('Authorization', `Bearer ${token}`)
                .send(catway);

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('success', true);
            expect(res.body.data).to.have.property('catwayNumber', 99);
            expect(res.body.data).to.have.property('type', 'long');
            
            catwayId = res.body.data._id;
        });

        it('❌ Devrait refuser la création sans token', async () => {
            const res = await chai.request(app)
                .post('/api/catways')
                .send({
                    catwayNumber: 100,
                    type: 'short',
                    catwayState: 'Test'
                });

            expect(res).to.have.status(401);
        });

        it('❌ Devrait refuser la création avec numéro existant', async () => {
            const res = await chai.request(app)
                .post('/api/catways')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    catwayNumber: 99,
                    type: 'short',
                    catwayState: 'Test'
                });

            expect(res).to.have.status(400);
            expect(res.body.error).to.include('existe déjà');
        });
    });

    // TEST 2: Lister tous les catways
    describe('TEST 2: GET /api/catways', () => {
        it('✅ Devrait lister tous les catways', async () => {
            const res = await chai.request(app)
                .get('/api/catways')
                .set('Authorization', `Bearer ${token}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('success', true);
            expect(res.body.data).to.be.an('array');
            expect(res.body.count).to.be.at.least(1);
        });
    });

    // TEST 3: Récupérer détails d'un catway
    describe('TEST 3: GET /api/catways/:id', () => {
        it('✅ Devrait récupérer les détails d\'un catway', async () => {
            const res = await chai.request(app)
                .get(`/api/catways/${catwayId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('success', true);
            expect(res.body.data).to.have.property('_id', catwayId);
            expect(res.body.data).to.have.property('catwayNumber', 99);
        });

        it('❌ Devrait retourner 404 pour ID invalide', async () => {
            const res = await chai.request(app)
                .get('/api/catways/000000000000000000000000')
                .set('Authorization', `Bearer ${token}`);

            expect(res).to.have.status(404);
        });
    });

    // TEST 4: Modifier l'état d'un catway (PATCH)
    describe('TEST 4: PATCH /api/catways/:id', () => {
        it('✅ Devrait modifier l\'état d\'un catway', async () => {
            const update = {
                catwayState: 'État modifié par test'
            };

            const res = await chai.request(app)
                .patch(`/api/catways/${catwayId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(update);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('success', true);
            expect(res.body.data.catwayState).to.equal('État modifié par test');
        });
    });

    // TEST 5: Supprimer un catway
    describe('TEST 5: DELETE /api/catways/:id', () => {
        it('✅ Devrait supprimer un catway', async () => {
            const res = await chai.request(app)
                .delete(`/api/catways/${catwayId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('message');

            // Vérifier que le catway n'existe plus
            const getRes = await chai.request(app)
                .get(`/api/catways/${catwayId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(getRes).to.have.status(404);
        });
    });
});