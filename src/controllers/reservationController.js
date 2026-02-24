/**
 * Contrôleur des réservations
 * @module controllers/reservationController
 */

const reservationService = require('../services/reservations');
const catwayService = require('../services/catways');
const { validateReservation, validateUserId } = require('../utils/validators');

/**
 * Récupère toutes les réservations d'un catway (API)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getReservationsByCatway = async (req, res) => {
  try {
    const idError = validateUserId(req.params.id);
    if (idError) {
      return res.status(400).json({ success: false, error: idError });
    }

    const catway = await catwayService.getById(req.params.id);
    const reservations = await reservationService.getByCatway(catway.catwayNumber);
    
    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Récupère une réservation spécifique (API)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getReservationById = async (req, res) => {
  try {
    const idError = validateUserId(req.params.id);
    if (idError) {
      return res.status(400).json({ success: false, error: idError });
    }

    const idResError = validateUserId(req.params.idReservation);
    if (idResError) {
      return res.status(400).json({ success: false, error: idResError });
    }

    const catway = await catwayService.getById(req.params.id);
    const reservation = await reservationService.getByCatwayAndId(
      catway.catwayNumber, 
      req.params.idReservation
    );
    
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Crée une réservation (API)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.createReservation = async (req, res) => {
  try {
    const idError = validateUserId(req.params.id);
    if (idError) {
      return res.status(400).json({ success: false, error: idError });
    }

    const validationError = validateReservation(req.body);
    if (validationError) {
      return res.status(400).json({ 
        success: false, 
        error: validationError 
      });
    }

    const catway = await catwayService.getById(req.params.id);
    const reservation = await reservationService.create(
      catway.catwayNumber, 
      req.body
    );
    
    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Supprime une réservation (API)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.deleteReservation = async (req, res) => {
  try {
    const idError = validateUserId(req.params.id);
    if (idError) {
      return res.status(400).json({ success: false, error: idError });
    }

    const idResError = validateUserId(req.params.idReservation);
    if (idResError) {
      return res.status(400).json({ success: false, error: idResError });
    }

    const catway = await catwayService.getById(req.params.id);
    await reservationService.deleteByCatwayAndId(
      catway.catwayNumber, 
      req.params.idReservation
    );
    
    res.json({ 
      success: true, 
      message: 'Réservation supprimée avec succès' 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Affiche la liste des réservations (page web)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showReservationsPage = async (req, res) => {
  try {
    const catways = await catwayService.getAll();
    const reservations = [];
    
    for (const catway of catways) {
      const catwayReservations = await reservationService.getByCatway(catway.catwayNumber);
      reservations.push(...catwayReservations);
    }
    
    res.render('reservations', { 
      title: 'Liste des réservations',
      reservations 
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Erreur',
      message: error.message 
    });
  }
};

/**
 * Affiche les détails d'une réservation (page web)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showReservationDetailsPage = async (req, res) => {
  try {
    const idError = validateUserId(req.params.id);
    if (idError) {
      return res.status(400).render('error', {
        title: 'Erreur',
        message: idError
      });
    }

    const reservation = await reservationService.getById(req.params.id);
    res.render('reservation-details', { 
      title: 'Détails de la réservation',
      reservation 
    });
  } catch (error) {
    res.status(404).render('error', { 
      title: 'Erreur',
      message: error.message 
    });
  }
};

/**
 * Traite le formulaire de création réservation (dashboard)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.handleCreateReservationForm = async (req, res) => {
  try {
    const catway = await catwayService.getById(req.body.catwayId);
    await reservationService.create(catway.catwayNumber, req.body);
    res.redirect('/dashboard?success=Réservation créée avec succès');
  } catch (error) {
    res.redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }
};

/**
 * Traite le formulaire de suppression réservation (dashboard)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.handleDeleteReservationForm = async (req, res) => {
  try {
    await reservationService.delete(req.body.reservationId);
    res.redirect('/dashboard?success=Réservation supprimée avec succès');
  } catch (error) {
    res.redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }
};

/**
 * Traite le formulaire d'affichage détails réservation (dashboard)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.handleShowReservationDetailsForm = async (req, res) => {
  try {
    const reservation = await reservationService.getById(req.body.reservationId);
    res.render('reservation-details', { 
      title: 'Détails de la réservation',
      reservation 
    });
  } catch (error) {
    res.redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }
};