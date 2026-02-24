/**
 * Utilitaires généraux
 * @module utils/helper
 */

/**
 * Formate une date en français
 * @param {Date|string} date - Date à formater
 * @returns {string} Date formatée
 */
exports.formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formate une date pour l'affichage (sans heure)
 * @param {Date|string} date - Date à formater
 * @returns {string} Date formatée
 */
exports.formatDateShort = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Génère un message de succès pour redirect
 * @param {string} message - Message de succès
 * @returns {string} URL avec paramètre
 */
exports.successRedirect = (message) => {
  return `/?success=${encodeURIComponent(message)}`;
};

/**
 * Génère un message d'erreur pour redirect
 * @param {string} message - Message d'erreur
 * @returns {string} URL avec paramètre
 */
exports.errorRedirect = (message) => {
  return `/?error=${encodeURIComponent(message)}`;
};

/**
 * Vérifie si une chaîne est un ID MongoDB valide
 * @param {string} id - ID à vérifier
 * @returns {boolean} True si valide
 */
exports.isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Extrait les erreurs de validation Mongoose
 * @param {Object} error - Erreur Mongoose
 * @returns {Object} Objet d'erreurs formaté
 */
exports.formatMongooseError = (error) => {
  if (error.name === 'ValidationError') {
    const errors = {};
    Object.keys(error.errors).forEach(key => {
      errors[key] = error.errors[key].message;
    });
    return errors;
  }
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return { [field]: `Cette valeur existe déjà` };
  }
  return { general: error.message };
};

/**
 * Génère un numéro de catway aléatoire pour les tests
 * @returns {number} Numéro aléatoire
 */
exports.generateRandomCatwayNumber = () => {
  return Math.floor(Math.random() * 1000) + 100;
};

/**
 * Tranque une chaîne trop longue
 * @param {string} str - Chaîne à tronquer
 * @param {number} length - Longueur max
 * @returns {string} Chaîne tronquée
 */
exports.truncate = (str, length = 50) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};