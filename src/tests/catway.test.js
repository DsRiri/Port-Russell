/**
 * Tests unitaires des catways
 * @module tests/catway-unit
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const { expect } = chai;

chai.use(chaiHttp);

describe('🚤 CATWAY - Tests unitaires', () => {
    let token;

    before(async () => {
        const loginRes = await chai.request(app)
            .post('/login')
            .send({
                email: 'capitainerie@port-russell.fr',
                password: 'PortRussell2026'
            });
        
        token = loginRes.body.token;
    });

    describe('Validation des données', () => {
        it('❌ Devrait rejeter création sans numéro', async () => {
            const res = await chai.request(app)
                .post('/api/catways')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    type: 'long',
                    catwayState: 'Test'
                });

            expect(res).to.have.status(400);
            expect(res.body.error).to.include('requis');
        });

        it('❌ Devrait rejeter création sans type', async () => {
            const res = await chai.request(app)
                .post('/api/catways')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    catwayNumber: 101,
                    catwayState: 'Test'
                });

            expect(res).to.have.status(400);
            expect(res.body.error).to.include('requis');
        });

        it('❌ Devrait rejeter type invalide', async () => {
            const res = await chai.request(app)
                .post('/api/catways')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    catwayNumber: 101,
                    type: 'extra-long',
                    catwayState: 'Test'
                });

            expect(res).to.have.status(400);
            expect(res.body.error).to.include('doit être "long" ou "short"');
        });
    });

    describe('Middleware d\'authentification', () => {
        it('❌ Devrait bloquer accès sans token', async () => {
            const res = await chai.request(app).get('/api/catways');
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error', 'Token requis');
        });

        it('❌ Devrait bloquer accès avec token invalide', async () => {
            const res = await chai.request(app)
                .get('/api/catways')
                .set('Authorization', 'Bearer token.invalide.123');

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error', 'Token invalide');
        });
    });
});