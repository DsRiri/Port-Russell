/**
 * Utilitaires de validation
 * @module utils/validators
 */

/**
 * Valide un email
 * @param {string} email - Email à valider
 * @returns {boolean} True si valide
 */
exports.isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Valide un mot de passe (min 6 caractères)
 * @param {string} password - Mot de passe à valider
 * @returns {boolean} True si valide
 */
exports.isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Valide les données de connexion
 * @param {string} email - Email
 * @param {string} password - Mot de passe
 * @returns {string|null} Message d'erreur ou null
 */
exports.validateLogin = (email, password) => {
  if (!email || !password) {
    return 'Email et mot de passe requis';
  }
  if (!exports.isValidEmail(email)) {
    return 'Format d\'email invalide';
  }
  if (!exports.isValidPassword(password)) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }
  return null;
};

/**
 * Valide les données d'un utilisateur
 * @param {Object} userData - Données utilisateur
 * @returns {string|null} Message d'erreur ou null
 */
exports.validateUser = (userData) => {
  const { name, email, password } = userData;
  
  if (!name || !email || !password) {
    return 'Tous les champs sont requis (name, email, password)';
  }
  if (name.length < 2) {
    return 'Le nom doit contenir au moins 2 caractères';
  }
  if (!exports.isValidEmail(email)) {
    return 'Format d\'email invalide';
  }
  if (!exports.isValidPassword(password)) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }
  return null;
};

/**
 * Valide les données d'un catway
 * @param {Object} catwayData - Données catway
 * @returns {string|null} Message d'erreur ou null
 */
exports.validateCatway = (catwayData) => {
  const { catwayNumber, type, catwayState } = catwayData;
  
  if (!catwayNumber || !type || !catwayState) {
    return 'Tous les champs sont requis (catwayNumber, type, catwayState)';
  }
  if (isNaN(catwayNumber) || catwayNumber < 1) {
    return 'Le numéro de catway doit être un nombre positif';
  }
  if (!['long', 'short'].includes(type)) {
    return 'Le type doit être "long" ou "short"';
  }
  return null;
};

/**
 * Valide les données d'une réservation
 * @param {Object} reservationData - Données réservation
 * @returns {string|null} Message d'erreur ou null
 */
exports.validateReservation = (reservationData) => {
  const { clientName, boatName, checkIn, checkOut } = reservationData;
  
  if (!clientName || !boatName || !checkIn || !checkOut) {
    return 'Tous les champs sont requis (clientName, boatName, checkIn, checkOut)';
  }
  
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return 'Format de date invalide';
  }
  
  if (startDate >= endDate) {
    return 'La date de fin doit être postérieure à la date de début';
  }
  
  return null;
};

/**
 * Valide un ID MongoDB
 * @param {string} id - ID à valider
 * @returns {string|null} Message d'erreur ou null
 */
exports.validateUserId = (id) => {
  if (!id) {
    return 'ID requis';
  }
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return 'Format d\'ID invalide';
  }
  return null;
};