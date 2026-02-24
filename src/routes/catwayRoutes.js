/**
 * Routes API des catways
 * @module routes/catwayRoutes
 */

const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const auth = require('../middlewares/auth');

// Routes pour les formulaires du dashboard
router.post('/dashboard/create', auth, catwayController.handleCreateCatwayForm);
router.post('/dashboard/update', auth, catwayController.handleUpdateCatwayForm);
router.post('/dashboard/delete', auth, catwayController.handleDeleteCatwayForm);
router.post('/dashboard/details', auth, catwayController.handleShowCatwayDetailsForm);

// Routes API (protégées)
router.get('/', auth, catwayController.getAllCatways);
router.get('/:id', auth, catwayController.getCatwayById);
router.post('/', auth, catwayController.createCatway);
router.put('/:id', auth, catwayController.replaceCatway);
router.patch('/:id', auth, catwayController.updateCatway);
router.delete('/:id', auth, catwayController.deleteCatway);

module.exports = router;