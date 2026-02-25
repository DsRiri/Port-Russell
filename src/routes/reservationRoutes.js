const express = require('express');
const router = express.Router({ mergeParams: true });
const reservationController = require('../controllers/reservationController');
const auth = require('../middlewares/auth');

// Toutes les routes nécessitent une authentification
router.use(auth);

// Routes pour les réservations (sous-ressource des catways)
router.get('/:id/reservations', reservationController.getReservationsByCatway);
router.get('/:id/reservations/:idReservation', reservationController.getReservationById);
router.post('/:id/reservations', reservationController.createReservation);
router.delete('/:id/reservations/:idReservation', reservationController.deleteReservation);

module.exports = router;