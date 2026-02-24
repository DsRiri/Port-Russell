/**
 * Middleware de gestion des erreurs
 * @module middlewares/errorMiddleware
 */

/**
 * Gestionnaire d'erreurs 404
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
exports.notFound = (req, res, next) => {
  const error = new Error(`Non trouvé - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Gestionnaire d'erreurs global
 * @param {Object} err - Erreur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Erreur:', {
      message: err.message,
      stack: err.stack,
      status: statusCode,
      url: req.url,
      method: req.method
    });
  }

  if (req.url.startsWith('/api')) {
    return res.status(statusCode).json({
      success: false,
      error: err.message || 'Erreur serveur',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  res.status(statusCode).render('error', {
    title: `Erreur ${statusCode}`,
    message: err.message || 'Une erreur est survenue',
    error: process.env.NODE_ENV === 'development' ? err : null
  });
};