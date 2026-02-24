/**
 * Tests d'authentification
 * @module tests/auth
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const { expect } = chai;

chai.use(chaiHttp);

describe('🔐 AUTHENTIFICATION - Tests', () => {
    
    describe('POST /login', () => {
        it('✅ Devrait connecter un utilisateur avec email et mot de passe valides', async () => {
            const res = await chai.request(app)
                .post('/login')
                .send({
                    email: 'capitainerie@port-russell.fr',
                    password: 'PortRussell2026'
                });

            expect(res).to.have.status(200);
            expect(res).to.redirectTo(/\/dashboard/);
        });

        it('❌ Devrait refuser la connexion avec mot de passe invalide', async () => {
            const res = await chai.request(app)
                .post('/login')
                .send({
                    email: 'capitainerie@port-russell.fr',
                    password: 'mauvais-mot-de-passe'
                });

            expect(res).to.have.status(200);
            expect(res.text).to.include('Email ou mot de passe incorrect');
        });

        it('❌ Devrait refuser la connexion avec email invalide', async () => {
            const res = await chai.request(app)
                .post('/login')
                .send({
                    email: 'email@inexistant.fr',
                    password: 'PortRussell2026'
                });

            expect(res).to.have.status(200);
            expect(res.text).to.include('Email ou mot de passe incorrect');
        });

        it('❌ Devrait refuser la connexion sans email', async () => {
            const res = await chai.request(app)
                .post('/login')
                .send({
                    password: 'PortRussell2026'
                });

            expect(res).to.have.status(200);
            expect(res.text).to.include('requis');
        });
    });

    describe('GET /logout', () => {
        it('✅ Devrait déconnecter l\'utilisateur', async () => {
            const agent = chai.request.agent(app);
            
            // D'abord login
            await agent.post('/login').send({
                email: 'capitainerie@port-russell.fr',
                password: 'PortRussell2026'
            });

            // Puis logout
            const res = await agent.get('/logout');
            expect(res).to.redirectTo('/');
        });
    });

    describe('Protection des routes', () => {
        it('❌ Devrait rediriger vers login si non authentifié', async () => {
            const res = await chai.request(app)
                .get('/dashboard');

            expect(res).to.redirectTo(/\/login/);
        });

        it('❌ Devrait retourner 401 pour API sans token', async () => {
            const res = await chai.request(app)
                .get('/api/catways');

            expect(res).to.have.status(401);
            expect(res.body).to.have.property('success', false);
            expect(res.body).to.have.property('error', 'Token requis');
        });
    });
});