/**
 * Routes API des réservations
 * @module routes/reservationRoutes
 */

const express = require('express');
const router = express.Router({ mergeParams: true });
const reservationController = require('../controllers/reservationController');
const auth = require('../middlewares/auth');

// Routes pour les formulaires du dashboard
router.post('/dashboard/create', auth, reservationController.handleCreateReservationForm);
router.post('/dashboard/delete', auth, reservationController.handleDeleteReservationForm);
router.post('/dashboard/details', auth, reservationController.handleShowReservationDetailsForm);

// Routes API (protégées) - sous-ressources des catways
router.get('/:id/reservations', auth, reservationController.getReservationsByCatway);
router.get('/:id/reservations/:idReservation', auth, reservationController.getReservationById);
router.post('/:id/reservations', auth, reservationController.createReservation);
router.delete('/:id/reservations/:idReservation', auth, reservationController.deleteReservation);

module.exports = router;