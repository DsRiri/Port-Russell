const reservationService = require('../services/reservations');
const catwayService = require('../services/catways');

// GET /api/catways/:id/reservations
exports.getReservationsByCatway = async (req, res) => {
  try {
    const catway = await catwayService.getById(req.params.id);
    const reservations = await reservationService.getByCatway(catway.catwayNumber);
    res.json({ success: true, data: reservations });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

// GET /api/catways/:id/reservations/:idReservation
exports.getReservationById = async (req, res) => {
  try {
    const catway = await catwayService.getById(req.params.id);
    const reservation = await reservationService.getByCatwayAndId(
      catway.catwayNumber, req.params.idReservation
    );
    res.json({ success: true, data: reservation });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

// POST /api/catways/:id/reservations
exports.createReservation = async (req, res) => {
  try {
    const catway = await catwayService.getById(req.params.id);
    const reservation = await reservationService.create(catway.catwayNumber, req.body);
    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE /api/catways/:id/reservations/:idReservation
exports.deleteReservation = async (req, res) => {
  try {
    const catway = await catwayService.getById(req.params.id);
    await reservationService.deleteByCatwayAndId(catway.catwayNumber, req.params.idReservation);
    res.json({ success: true, message: 'Réservation supprimée' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};