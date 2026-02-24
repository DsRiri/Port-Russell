/**
 * Tests fonctionnels des catways
 * @module tests/catways-functional
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const { expect } = chai;

chai.use(chaiHttp);

describe('🚤 CATWAYS - Tests fonctionnels', () => {
    let token;
    let catwayId;

    before(async () => {
        const loginRes = await chai.request(app)
            .post('/login')
            .send({
                email: 'capitainerie@port-russell.fr',
                password: 'PortRussell2026'
            });
        
        token = loginRes.body.token;
    });

    describe('Page web des catways', () => {
        it('✅ Page /catways accessible après login', async () => {
            const agent = chai.request.agent(app);
            
            await agent.post('/login').send({
                email: 'capitainerie@port-russell.fr',
                password: 'PortRussell2026'
            });

            const res = await agent.get('/catways');
            expect(res).to.have.status(200);
            expect(res.text).to.include('Liste des catways');
        });

        it('❌ Page /catways redirige sans login', async () => {
            const res = await chai.request(app).get('/catways');
            expect(res).to.redirectTo(/\/login/);
        });
    });

    describe('Page détail catway', () => {
        beforeEach(async () => {
            // Créer un catway pour les tests
            const createRes = await chai.request(app)
                .post('/api/catways')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    catwayNumber: 102,
                    type: 'short',
                    catwayState: 'Pour test détail'
                });
            catwayId = createRes.body.data._id;
        });

        it('✅ Page /catways/:id accessible après login', async () => {
            const agent = chai.request.agent(app);
            
            await agent.post('/login').send({
                email: 'capitainerie@port-russell.fr',
                password: 'PortRussell2026'
            });

            const res = await agent.get(`/catways/${catwayId}`);
            expect(res).to.have.status(200);
            expect(res.text).to.include('Catway');
        });

        afterEach(async () => {
            if (catwayId) {
                await chai.request(app)
                    .delete(`/api/catways/${catwayId}`)
                    .set('Authorization', `Bearer ${token}`);
            }
        });
    });
});