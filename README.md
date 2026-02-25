# ⚓ Port Russell API

API de gestion des réservations de catways pour le Port de Plaisance Russell.

## 📋 Description

Cette API permet à la capitainerie du Port Russell de gérer les catways (petits appontements) et les réservations des bateaux.

## 🚀 Fonctionnalités (9/9)

✅ Créer un catway  
✅ Lister tous les catways  
✅ Récupérer les détails d'un catway  
✅ Modifier la description d'un catway  
✅ Supprimer un catway  
✅ Prendre une réservation  
✅ Supprimer une réservation  
✅ Lister toutes les réservations  
✅ Afficher les détails d'une réservation  

## 🔐 Authentification

- Système JWT avec tokens
- Routes privatisées
- Session persistante (24h)
- Mots de passe hashés (bcrypt)
- Middleware d'authentification

## 📊 Tests

12 tests unitaires avec Mocha/Chai:
- 9 tests pour les 9 fonctionnalités
- 3 tests bonus (validation, protection, application)

## 🌐 Déploiement

- **Application**: https://port-russell-u12i.onrender.com 
- **Documentation**: https://port-russell-u12i.onrender.com/documentation 
- **GitHub**: https://github.com/DsRiri/Port-Russell

## 🛠️ Technologies

- Node.js / Express
- MongoDB / Mongoose
- JWT / Bcrypt
- EJS / CSS
- Mocha / Chai


## 🚀 Installation

```bash
git clone https://github.com/ton-username/port-russell-api.git
cd port-russell-api
npm install
cp .env.example .env
# Éditer .env avec vos informations
npm run seed
npm run dev
