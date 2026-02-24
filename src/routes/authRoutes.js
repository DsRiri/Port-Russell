/**
 * Routes d'authentification
 * @module routes/authRoutes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isNotAuthenticated } = require('../middlewares/authMiddleware');

// Page d'accueil
router.get('/', authController.showHomePage);

// Page de login
router.get('/login', isNotAuthenticated, authController.showLoginPage);

// Traitement du login
router.post('/login', isNotAuthenticated, authController.login);

// Déconnexion
router.get('/logout', authController.logout);

module.exports = router;