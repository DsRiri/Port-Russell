/**
 * Service de gestion des réservations
 * @module services/reservations
 */

const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

/**
 * Récupère toutes les réservations d'un catway
 * @param {number} catwayNumber - Numéro du catway
 * @returns {Promise<Array>} Liste des réservations
 */
exports.getByCatway = async (catwayNumber) => {
  return await Reservation.find({ catwayNumber }).sort({ checkIn: -1 });
};

/**
 * Récupère une réservation par son ID
 * @param {string} reservationId - ID de la réservation
 * @returns {Promise<Object>} Réservation trouvée
 * @throws {Error} Si la réservation n'existe pas
 */
exports.getById = async (reservationId) => {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    throw new Error('Réservation non trouvée');
  }
  return reservation;
};

/**
 * Récupère une réservation par catway et ID
 * @param {number} catwayNumber - Numéro du catway
 * @param {string} reservationId - ID de la réservation
 * @returns {Promise<Object>} Réservation trouvée
 * @throws {Error} Si la réservation n'existe pas pour ce catway
 */
exports.getByCatwayAndId = async (catwayNumber, reservationId) => {
  const reservation = await Reservation.findOne({ 
    _id: reservationId, 
    catwayNumber 
  });
  
  if (!reservation) {
    throw new Error('Réservation non trouvée pour ce catway');
  }
  return reservation;
};

/**
 * Vérifie les conflits de réservation
 * @param {number} catwayNumber - Numéro du catway
 * @param {Date} checkIn - Date de début
 * @param {Date} checkOut - Date de fin
 * @param {string} excludeId - ID à exclure
 * @returns {Promise<boolean>} True si conflit
 */
const checkConflicts = async (catwayNumber, checkIn, checkOut, excludeId = null) => {
  const query = {
    catwayNumber,
    $or: [
      { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
    ]
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflicts = await Reservation.find(query);
  return conflicts.length > 0;
};

/**
 * Crée une nouvelle réservation
 * @param {number} catwayNumber - Numéro du catway
 * @param {Object} reservationData - Données de la réservation
 * @returns {Promise<Object>} Réservation créée
 * @throws {Error} Si validation échoue
 */
exports.create = async (catwayNumber, reservationData) => {
  const { clientName, boatName, checkIn, checkOut } = reservationData;

  if (!clientName || !boatName || !checkIn || !checkOut) {
    throw new Error('Tous les champs sont requis (clientName, boatName, checkIn, checkOut)');
  }

  const catway = await Catway.findOne({ catwayNumber });
  if (!catway) {
    throw new Error('Catway non trouvé');
  }

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Format de date invalide');
  }

  if (startDate >= endDate) {
    throw new Error('La date de fin doit être postérieure à la date de début');
  }

  if (startDate < new Date()) {
    throw new Error('La date de début ne peut pas être dans le passé');
  }

  const hasConflict = await checkConflicts(catwayNumber, startDate, endDate);
  if (hasConflict) {
    throw new Error('Ce catway est déjà réservé pour ces dates');
  }

  const reservation = new Reservation({
    catwayNumber,
    clientName,
    boatName,
    checkIn: startDate,
    checkOut: endDate
  });

  return await reservation.save();
};

/**
 * Met à jour une réservation
 * @param {string} reservationId - ID de la réservation
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Réservation mise à jour
 * @throws {Error} Si validation échoue
 */
exports.update = async (reservationId, updateData) => {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    throw new Error('Réservation non trouvée');
  }

  const checkIn = updateData.checkIn ? new Date(updateData.checkIn) : reservation.checkIn;
  const checkOut = updateData.checkOut ? new Date(updateData.checkOut) : reservation.checkOut;

  if (checkIn >= checkOut) {
    throw new Error('La date de fin doit être postérieure à la date de début');
  }

  if (updateData.checkIn || updateData.checkOut) {
    const hasConflict = await checkConflicts(
      reservation.catwayNumber,
      checkIn,
      checkOut,
      reservationId
    );
    if (hasConflict) {
      throw new Error('Ce catway est déjà réservé pour ces dates');
    }
  }

  Object.assign(reservation, updateData);
  return await reservation.save();
};

/**
 * Supprime une réservation
 * @param {string} reservationId - ID de la réservation
 * @returns {Promise<Object>} Réservation supprimée
 * @throws {Error} Si la réservation n'existe pas
 */
exports.delete = async (reservationId) => {
  const reservation = await Reservation.findByIdAndDelete(reservationId);
  if (!reservation) {
    throw new Error('Réservation non trouvée');
  }
  return reservation;
};

/**
 * Supprime une réservation par catway et ID
 * @param {number} catwayNumber - Numéro du catway
 * @param {string} reservationId - ID de la réservation
 * @returns {Promise<Object>} Réservation supprimée
 * @throws {Error} Si la réservation n'existe pas pour ce catway
 */
exports.deleteByCatwayAndId = async (catwayNumber, reservationId) => {
  const reservation = await Reservation.findOneAndDelete({ 
    _id: reservationId, 
    catwayNumber 
  });
  
  if (!reservation) {
    throw new Error('Réservation non trouvée pour ce catway');
  }
  return reservation;
};