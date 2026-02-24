/**
 * Tests d'authentification supplémentaires
 * @module tests/auth-extra
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const { expect } = chai;

chai.use(chaiHttp);

describe('🔐 AUTHENTIFICATION - Tests supplémentaires', () => {
    let token;
    let userId;

    before(async () => {
        const loginRes = await chai.request(app)
            .post('/login')
            .send({
                email: 'capitainerie@port-russell.fr',
                password: 'PortRussell2026'
            });
        
        token = loginRes.body.token;
    });

    describe('Validation des mots de passe', () => {
        it('❌ Devrait rejeter mot de passe trop court (moins de 6 caractères)', async () => {
            const res = await chai.request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Test User',
                    email: 'test@test.fr',
                    password: '12345'
                });

            expect(res).to.have.status(400);
            expect(res.body.error).to.include('6 caractères');
        });

        it('✅ Devrait accepter mot de passe de 6 caractères', async () => {
            const res = await chai.request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Test User',
                    email: 'test6@test.fr',
                    password: '123456'
                });

            expect(res).to.have.status(201);
            userId = res.body.data._id;
        });
    });

    describe('Session persistante', () => {
        it('✅ Devrait maintenir la session après login', async () => {
            const agent = chai.request.agent(app);
            
            await agent.post('/login').send({
                email: 'capitainerie@port-russell.fr',
                password: 'PortRussell2026'
            });

            const res = await agent.get('/dashboard');
            expect(res).to.have.status(200);
            expect(res.text).to.include('Tableau de bord');
        });
    });

    after(async () => {
        if (userId) {
            await chai.request(app)
                .delete(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);
        }
    });
});