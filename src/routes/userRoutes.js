/**
 * Routes API des utilisateurs
 * @module routes/userRoutes
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

// Routes pour les formulaires du dashboard
router.post('/dashboard/create', auth, userController.handleCreateUserForm);
router.post('/dashboard/update', auth, userController.handleUpdateUserForm);
router.post('/dashboard/delete', auth, userController.handleDeleteUserForm);

// Routes API (protégées)
router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.post('/', auth, userController.createUser);
router.put('/:id', auth, userController.updateUser);
router.patch('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;