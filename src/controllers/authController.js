/**
 * Contrôleur d'authentification
 * @module controllers/authController
 */

const userService = require('../services/users');
const { validateLogin } = require('../utils/validators');

/**
 * Affiche la page de login
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showLoginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login', { 
    title: 'Connexion - Port Russell',
    error: null 
  });
};

/**
 * Affiche la page d'accueil
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showHomePage = (req, res) => {
  res.render('index', { 
    title: 'Port Russell - Accueil',
    user: req.session.user || null
  });
};

/**
 * Traite la connexion
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validationError = validateLogin(email, password);
    if (validationError) {
      return res.render('login', { 
        title: 'Connexion - Port Russell',
        error: validationError 
      });
    }

    const result = await userService.authenticate(email, password);

    req.session.user = result.user;
    req.session.token = result.token;
    req.session.save((err) => {
      if (err) {
        console.error('Erreur session:', err);
      }
      res.redirect('/dashboard');
    });

  } catch (error) {
    res.render('login', { 
      title: 'Connexion - Port Russell',
      error: error.message 
    });
  }
};

/**
 * Déconnexion
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};