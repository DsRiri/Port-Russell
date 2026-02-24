/**
 * Configuration JWT
 * @module config/jwt
 */

const jwt = require('jsonwebtoken');

/**
 * Génère un token JWT
 * @param {Object} payload - Données à encoder
 * @returns {string} Token JWT
 */
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

/**
 * Vérifie un token JWT
 * @param {string} token - Token à vérifier
 * @returns {Object} Payload décodé
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw new Error('Token invalide');
  }
};

/**
 * Extrait le token du header Authorization
 * @param {string} authHeader - Header Authorization
 * @returns {string|null} Token ou null
 */
const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken
};