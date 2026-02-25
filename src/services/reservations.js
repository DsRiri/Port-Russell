const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

exports.getByCatway = async (catwayNumber) => {
  return await Reservation.find({ catwayNumber }).sort({ checkIn: -1 });
};

exports.getById = async (id) => {
  const reservation = await Reservation.findById(id);
  if (!reservation) throw new Error('Réservation non trouvée');
  return reservation;
};

exports.getByCatwayAndId = async (catwayNumber, id) => {
  const reservation = await Reservation.findOne({ _id: id, catwayNumber });
  if (!reservation) throw new Error('Réservation non trouvée');
  return reservation;
};

exports.create = async (catwayNumber, data) => {
  const { clientName, boatName, checkIn, checkOut } = data;
  
  if (!clientName || !boatName || !checkIn || !checkOut) {
    throw new Error('Tous les champs sont requis');
  }
  
  const catway = await Catway.findOne({ catwayNumber });
  if (!catway) throw new Error('Catway non trouvé');
  
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  
  if (start >= end) throw new Error('checkOut doit être > checkIn');
  if (start < new Date()) throw new Error('checkIn ne peut pas être dans le passé');
  
  const conflicts = await Reservation.find({
    catwayNumber,
    $or: [{ checkIn: { $lt: end }, checkOut: { $gt: start } }]
  });
  
  if (conflicts.length > 0) throw new Error('Catway déjà réservé');
  
  const reservation = new Reservation({
    catwayNumber, clientName, boatName, checkIn: start, checkOut: end
  });
  return await reservation.save();
};

exports.delete = async (id) => {
  const reservation = await Reservation.findByIdAndDelete(id);
  if (!reservation) throw new Error('Réservation non trouvée');
  return reservation;
};

exports.deleteByCatwayAndId = async (catwayNumber, id) => {
  const reservation = await Reservation.findOneAndDelete({ _id: id, catwayNumber });
  if (!reservation) throw new Error('Réservation non trouvée');
  return reservation;
};