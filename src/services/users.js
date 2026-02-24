/**
 * Service de gestion des utilisateurs
 * @module services/users
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Récupère tous les utilisateurs
 * @returns {Promise<Array>} Liste des utilisateurs
 */
exports.getAll = async () => {
  return await User.find().select('-password').sort({ createdAt: -1 });
};

/**
 * Récupère un utilisateur par son ID
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Utilisateur trouvé
 * @throws {Error} Si l'utilisateur n'existe pas
 */
exports.getById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  return user;
};

/**
 * Récupère un utilisateur par son email
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object>} Utilisateur trouvé
 */
exports.getByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Crée un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur
 * @returns {Promise<Object>} Utilisateur créé
 * @throws {Error} Si validation échoue
 */
exports.create = async (userData) => {
  const { name, email, password } = userData;
  
  if (!name || !email || !password) {
    throw new Error('Tous les champs sont requis (name, email, password)');
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Format d\'email invalide');
  }

  if (password.length < 6) {
    throw new Error('Le mot de passe doit contenir au moins 6 caractères');
  }

  const existingUser = await exports.getByEmail(email);
  if (existingUser) {
    throw new Error('Cet email est déjà utilisé');
  }

  const user = new User({ name, email, password });
  return await user.save();
};

/**
 * Met à jour un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Utilisateur mis à jour
 * @throws {Error} Si l'utilisateur n'existe pas
 */
exports.update = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  if (updateData.email) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(updateData.email)) {
      throw new Error('Format d\'email invalide');
    }
    
    const existingUser = await exports.getByEmail(updateData.email);
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new Error('Cet email est déjà utilisé');
    }
  }

  if (updateData.password) {
    if (updateData.password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  Object.assign(user, updateData);
  await user.save();
  
  return user.toJSON();
};

/**
 * Supprime un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Utilisateur supprimé
 * @throws {Error} Si l'utilisateur n'existe pas
 */
exports.delete = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  return user;
};

/**
 * Authentifie un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} Token et informations utilisateur
 * @throws {Error} Si authentification échoue
 */
exports.authenticate = async (email, password) => {
  // Validation des entrées
  if (!email || !password) {
    throw new Error('Email et mot de passe requis');
  }

  console.log('\n🔍 === TENTATIVO LOGIN ===');
  console.log('📧 Email ricevuta:', email);
  console.log('🔐 Password ricevuta:', password);

  // Ricerca utente
  const user = await User.findOne({ email });
  console.log('👤 Utente trovato?', !!user);
  
  if (!user) {
    console.log('❌ Utente non trovato nel DB');
    throw new Error('Email ou mot de passe incorrect');
  }

  console.log('📦 Hash nel DB:', user.password);

  // Confronto password
  const isValid = await bcrypt.compare(password, user.password);
  console.log('✅ Password corretta?', isValid);

  if (!isValid) {
    console.log('❌ Password errata');
    throw new Error('Email ou mot de passe incorrect');
  }

  console.log('🎉 Login riuscito per:', user.email);

  // Generazione token
  const token = jwt.sign(
    { 
      userId: user._id, 
      email: user.email,
      name: user.name 
    },
    process.env.SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  };
};