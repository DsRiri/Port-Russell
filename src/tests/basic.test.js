/**
 * Tests de base de l'application
 * @module tests/basic
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const { expect } = chai;

chai.use(chaiHttp);

describe('🌐 APPLICATION - Tests de base', () => {
    
    describe('Routes publiques', () => {
        it('✅ Page d\'accueil accessible', async () => {
            const res = await chai.request(app).get('/');
            expect(res).to.have.status(200);
            expect(res.text).to.include('Port Russell');
        });

        it('✅ Page de login accessible', async () => {
            const res = await chai.request(app).get('/login');
            expect(res).to.have.status(200);
            expect(res.text).to.include('Connexion');
        });

        it('✅ Documentation accessible', async () => {
            const res = await chai.request(app).get('/documentation');
            expect(res).to.have.status(200);
            expect(res.text).to.include('Documentation');
        });
    });

    describe('Gestion des erreurs', () => {
        it('✅ Page 404 pour route inexistante', async () => {
            const res = await chai.request(app).get('/route-qui-n-existe-pas');
            expect(res).to.have.status(404);
            expect(res.text).to.include('Page non trouvée');
        });
    });

    describe('Fichiers statiques', () => {
        it('✅ CSS accessible', async () => {
            const res = await chai.request(app).get('/css/style.css');
            expect(res).to.have.status(200);
            expect(res).to.have.header('content-type', /css/);
        });

        it('✅ JavaScript accessible', async () => {
            const res = await chai.request(app).get('/js/main.js');
            expect(res).to.have.status(200);
            expect(res).to.have.header('content-type', /javascript/);
        });
    });
});