/**
 * Service de gestion des catways
 * @module services/catways
 */

const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');

/**
 * Récupère tous les catways
 * @returns {Promise<Array>} Liste des catways
 */
exports.getAll = async () => {
  return await Catway.find().sort({ catwayNumber: 1 });
};

/**
 * Récupère un catway par son ID
 * @param {string} catwayId - ID du catway
 * @returns {Promise<Object>} Catway trouvé
 * @throws {Error} Si le catway n'existe pas
 */
exports.getById = async (catwayId) => {
  const catway = await Catway.findById(catwayId);
  if (!catway) {
    throw new Error('Catway non trouvé');
  }
  return catway;
};

/**
 * Récupère un catway par son numéro
 * @param {number} catwayNumber - Numéro du catway
 * @returns {Promise<Object>} Catway trouvé
 */
exports.getByNumber = async (catwayNumber) => {
  return await Catway.findOne({ catwayNumber });
};

/**
 * Crée un nouveau catway
 * @param {Object} catwayData - Données du catway
 * @returns {Promise<Object>} Catway créé
 * @throws {Error} Si validation échoue
 */
exports.create = async (catwayData) => {
  const { catwayNumber, type, catwayState } = catwayData;

  if (!catwayNumber || !type || !catwayState) {
    throw new Error('Tous les champs sont requis (catwayNumber, type, catwayState)');
  }

  if (!['long', 'short'].includes(type)) {
    throw new Error('Le type doit être "long" ou "short"');
  }

  const existing = await exports.getByNumber(catwayNumber);
  if (existing) {
    throw new Error('Ce numéro de catway existe déjà');
  }

  const catway = new Catway({ catwayNumber, type, catwayState });
  return await catway.save();
};

/**
 * Met à jour complètement un catway (PUT)
 * @param {string} catwayId - ID du catway
 * @param {Object} catwayData - Nouvelles données
 * @returns {Promise<Object>} Catway mis à jour
 * @throws {Error} Si le catway n'existe pas
 */
exports.replace = async (catwayId, catwayData) => {
  const { catwayNumber, type, catwayState } = catwayData;

  if (!catwayNumber || !type || !catwayState) {
    throw new Error('Tous les champs sont requis pour le remplacement');
  }

  if (!['long', 'short'].includes(type)) {
    throw new Error('Le type doit être "long" ou "short"');
  }

  if (catwayNumber) {
    const existing = await Catway.findOne({ 
      catwayNumber, 
      _id: { $ne: catwayId } 
    });
    if (existing) {
      throw new Error('Ce numéro de catway est déjà utilisé');
    }
  }

  const catway = await Catway.findByIdAndUpdate(
    catwayId,
    { catwayNumber, type, catwayState },
    { new: true, runValidators: true }
  );

  if (!catway) {
    throw new Error('Catway non trouvé');
  }

  return catway;
};

/**
 * Met à jour partiellement un catway (PATCH)
 * @param {string} catwayId - ID du catway
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Catway mis à jour
 * @throws {Error} Si le catway n'existe pas
 */
exports.update = async (catwayId, updateData) => {
  if (updateData.type && !['long', 'short'].includes(updateData.type)) {
    throw new Error('Le type doit être "long" ou "short"');
  }

  if (updateData.catwayNumber) {
    const existing = await Catway.findOne({ 
      catwayNumber: updateData.catwayNumber, 
      _id: { $ne: catwayId } 
    });
    if (existing) {
      throw new Error('Ce numéro de catway est déjà utilisé');
    }
  }

  const catway = await Catway.findByIdAndUpdate(
    catwayId,
    updateData,
    { new: true, runValidators: true }
  );

  if (!catway) {
    throw new Error('Catway non trouvé');
  }

  return catway;
};

/**
 * Supprime un catway
 * @param {string} catwayId - ID du catway
 * @returns {Promise<Object>} Catway supprimé
 * @throws {Error} Si le catway n'existe pas
 */
exports.delete = async (catwayId) => {
  const catway = await Catway.findById(catwayId);
  if (!catway) {
    throw new Error('Catway non trouvé');
  }

  await Reservation.deleteMany({ catwayNumber: catway.catwayNumber });
  await Catway.findByIdAndDelete(catwayId);

  return catway;
};