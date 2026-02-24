/**
 * Contrôleur des catways
 * @module controllers/catwayController
 */

const catwayService = require('../services/catways');
const { validateCatway, validateUserId } = require('../utils/validators');

/**
 * Récupère tous les catways (API)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getAllCatways = async (req, res) => {
  try {
    const catways = await catwayService.getAll();
    res.json({
      success: true,
      count: catways.length,
      data: catways
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Récupère un catway par ID (API)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getCatwayById = async (req, res) => {
  try {
    const idError = validateUserId(req.params.id);
    if (idError) {
      return res.status(400).json({ success: false, error: idError });
    }

    const catway = await catwayService.getById(req.params.id);
    res.json({
      success: true,
      data: catway
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Crée un catway (API)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.createCatway = async (req, res) => {
  try {
    const validationError = validateCatway(req.body);
    if (validationError) {
      return res.status(400).json({ 
        success: false, 
        error: validationError 
      });
    }

    const catway = await catwayService.create(req.body);
    res.status(201).json({
      success: true,
      data: catway
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Remplace complètement un catway (PUT)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.replaceCatway = async (req, res) => {
  try {
    const idError = validateUserId(req.params.id);
    if (idError) {
      return res.status(400).json({ success: false, error: idError });
    }

    const validationError = validateCatway(req.body);
    if (validationError) {
      return res.status(400).json({ 
        success: false, 
        error: validationError 
      });
    }

    const catway = await catwayService.replace(req.params.id, req.body);
    res.json({
      success: true,
      data: catway
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Met à jour partiellement un catway (PATCH)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.updateCatway = async (req, res) => {
  try {
    const idError = validateUserId(req.params.id);
    if (idError) {
      return res.status(400).json({ success: false, error: idError });
    }

    const catway = await catwayService.update(req.params.id, req.body);
    res.json({
      success: true,
      data: catway
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Supprime un catway (API)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.deleteCatway = async (req, res) => {
  try {
    const idError = validateUserId(req.params.id);
    if (idError) {
      return res.status(400).json({ success: false, error: idError });
    }

    await catwayService.delete(req.params.id);
    res.json({ 
      success: true, 
      message: 'Catway supprimé avec succès' 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Affiche la liste des catways (page web)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showCatwaysPage = async (req, res) => {
  try {
    const catways = await catwayService.getAll();
    res.render('catways', { 
      title: 'Liste des catways',
      catways 
    });
  } catch (error) {
    res.status(500).render('error', { 
      title: 'Erreur',
      message: error.message 
    });
  }
};

/**
 * Affiche les détails d'un catway (page web)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showCatwayDetailsPage = async (req, res) => {
  try {
    const idError = validateUserId(req.params.id);
    if (idError) {
      return res.status(400).render('error', {
        title: 'Erreur',
        message: idError
      });
    }

    const catway = await catwayService.getById(req.params.id);
    res.render('catway-details', { 
      title: `Catway ${catway.catwayNumber}`,
      catway 
    });
  } catch (error) {
    res.status(404).render('error', { 
      title: 'Erreur',
      message: error.message 
    });
  }
};

/**
 * Traite le formulaire de création catway (dashboard)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.handleCreateCatwayForm = async (req, res) => {
  try {
    await catwayService.create(req.body);
    res.redirect('/dashboard?success=Catway créé avec succès');
  } catch (error) {
    res.redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }
};

/**
 * Traite le formulaire de modification catway (dashboard)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.handleUpdateCatwayForm = async (req, res) => {
  try {
    await catwayService.update(req.body.catwayId, { 
      catwayState: req.body.catwayState 
    });
    res.redirect('/dashboard?success=État du catway modifié avec succès');
  } catch (error) {
    res.redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }
};

/**
 * Traite le formulaire de suppression catway (dashboard)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.handleDeleteCatwayForm = async (req, res) => {
  try {
    await catwayService.delete(req.body.catwayId);
    res.redirect('/dashboard?success=Catway supprimé avec succès');
  } catch (error) {
    res.redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }
};

/**
 * Traite le formulaire d'affichage détails catway (dashboard)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.handleShowCatwayDetailsForm = async (req, res) => {
  try {
    const catway = await catwayService.getById(req.body.catwayId);
    res.render('catway-details', { 
      title: `Catway ${catway.catwayNumber}`,
      catway 
    });
  } catch (error) {
    res.redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }
};