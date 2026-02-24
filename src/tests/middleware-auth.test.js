/**
 * Tests des middlewares d'authentification
 * @module tests/middleware-auth
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const { expect } = chai;

chai.use(chaiHttp);

describe('🛡️ MIDDLEWARE AUTH - Tests', () => {
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

    describe('Middleware API (auth.js)', () => {
        const protectedRoutes = [
            { method: 'get', url: '/api/catways' },
            { method: 'post', url: '/api/catways' },
            { method: 'get', url: '/api/users' },
            { method: 'post', url: '/api/users' }
        ];

        protectedRoutes.forEach(route => {
            it(`❌ ${route.method.toUpperCase()} ${route.url} - sans token`, async () => {
                const res = await chai.request(app)[route.method](route.url);
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error', 'Token requis');
            });

            it(`✅ ${route.method.toUpperCase()} ${route.url} - avec token`, async () => {
                const res = await chai.request(app)[route.method](route.url)
                    .set('Authorization', `Bearer ${token}`);
                expect(res.status).to.not.equal(401);
            });
        });
    });

    describe('Middleware Session (authMiddleware.js)', () => {
        const protectedPages = [
            '/dashboard',
            '/catways',
            '/reservations'
        ];

        protectedPages.forEach(page => {
            it(`❌ ${page} - sans session`, async () => {
                const res = await chai.request(app).get(page);
                expect(res).to.redirectTo(/\/login/);
            });

            it(`✅ ${page} - avec session`, async () => {
                const agent = chai.request.agent(app);
                
                await agent.post('/login').send({
                    email: 'capitainerie@port-russell.fr',
                    password: 'PortRussell2026'
                });

                const res = await agent.get(page);
                expect(res).to.have.status(200);
            });
        });
    });
});