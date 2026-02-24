/**
 * Middleware d'authentification pour les routes web
 * @module middlewares/authMiddleware
 */

/**
 * Vérifie si l'utilisateur est connecté (session)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Vérifie si l'utilisateur n'est PAS connecté
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
exports.isNotAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return next();
  }
  res.redirect('/dashboard');
};

/**
 * Vérifie si l'utilisateur a le rôle admin
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.email === process.env.ADMIN_EMAIL) {
    return next();
  }
  res.status(403).render('error', {
    title: 'Accès refusé',
    message: 'Vous n\'avez pas les droits d\'administrateur'
  });
};