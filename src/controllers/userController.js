/**
 * Contrôleur des utilisateurs
 * @module controllers/userController
 */

const userService = require('../services/users');
const { validateUser, validateUserId } = require('../utils/validators');

/**
 * Récupère tous les utilisateurs
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAll();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Récupère un utilisateur par ID
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.getUserById = async (req, res) => {
  try {
    const validationError = validateUserId(req.params.id);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const user = await userService.getById(req.params.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Crée un nouvel utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.createUser = async (req, res) => {
  try {
    const validationError = validateUser(req.body);
    if (validationError) {
      return res.status(400).json({ 
        success: false, 
        error: validationError 
      });
    }

    const user = await userService.create(req.body);
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Met à jour un utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.updateUser = async (req, res) => {
  try {
    const idError = validateUserId(req.params.id);
    if (idError) {
      return res.status(400).json({ success: false, error: idError });
    }

    const user = await userService.update(req.params.id, req.body);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Supprime un utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.deleteUser = async (req, res) => {
  try {
    const idError = validateUserId(req.params.id);
    if (idError) {
      return res.status(400).json({ success: false, error: idError });
    }

    await userService.delete(req.params.id);
    res.json({ 
      success: true, 
      message: 'Utilisateur supprimé avec succès' 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Traite le formulaire de création utilisateur (dashboard)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.handleCreateUserForm = async (req, res) => {
  try {
    await userService.create(req.body);
    res.redirect('/dashboard?success=Utilisateur créé avec succès');
  } catch (error) {
    res.redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }
};

/**
 * Traite le formulaire de modification utilisateur (dashboard)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.handleUpdateUserForm = async (req, res) => {
  try {
    const { userId, name, email, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;

    await userService.update(userId, updateData);
    res.redirect('/dashboard?success=Utilisateur modifié avec succès');
  } catch (error) {
    res.redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }
};

/**
 * Traite le formulaire de suppression utilisateur (dashboard)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.handleDeleteUserForm = async (req, res) => {
  try {
    await userService.delete(req.body.userId);
    res.redirect('/dashboard?success=Utilisateur supprimé avec succès');
  } catch (error) {
    res.redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }
};