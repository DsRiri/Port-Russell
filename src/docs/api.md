# Documentation complète de l'API Port Russell

## Vue d'ensemble

API REST privée pour la gestion des catways et réservations du Port de Plaisance Russell.

**Base URL**: `https://port-russell-api.onrender.com/api`

## Authentification

Toutes les routes API (sauf `/login`) nécessitent un token JWT dans le header:
Authorization: Bearer <votre_token>

text

### Obtenir un token

**POST** `/login`

Body:
```json
{
  "email": "capitainerie@port-russell.fr",
  "password": "PortRussell2026"
}
Réponse:

json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Capitainerie",
    "email": "capitainerie@port-russell.fr"
  }
}
Routes Catways
GET /catways
Liste tous les catways

Réponse:

json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "catwayNumber": 1,
      "type": "long",
      "catwayState": "Bon état",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
GET /catways/:id
Détails d'un catway spécifique

POST /catways
Crée un nouveau catway

Body:

json
{
  "catwayNumber": 15,
  "type": "short",
  "catwayState": "Neuf"
}
PUT /catways/:id
Remplace complètement un catway

PATCH /catways/:id
Modifie partiellement un catway

DELETE /catways/:id
Supprime un catway

Routes Réservations
GET /catways/:id/reservations
Liste les réservations d'un catway

GET /catways/:id/reservations/:idReservation
Détails d'une réservation

POST /catways/:id/reservations
Crée une réservation

Body:

json
{
  "clientName": "Jean Dupont",
  "boatName": "Sea Breeze",
  "checkIn": "2026-05-01T10:00:00Z",
  "checkOut": "2026-05-08T10:00:00Z"
}
DELETE /catways/:id/reservations/:idReservation
Supprime une réservation

Routes Utilisateurs
GET /users
GET /users/:id
POST /users
PUT /users/:id
PATCH /users/:id
DELETE /users/:id
Modèles de données
Catway
json
{
  "catwayNumber": Number,
  "type": "long" | "short",
  "catwayState": String
}
Réservation
json
{
  "catwayNumber": Number,
  "clientName": String,
  "boatName": String,
  "checkIn": Date,
  "checkOut": Date
}
Utilisateur
json
{
  "name": String,
  "email": String,
  "password": String (hashé)
}
Codes d'erreur
400: Validation error

401: Non authentifié

403: Non autorisé

404: Ressource non trouvée

500: Erreur serveur

Tests
bash
npm test
12 tests unitaires couvrant les 9 fonctionnalités.

Déploiement
L'API est déployée sur Render:
https://port-russell-api.onrender.com

text

---

# 📁 **public/**

## **53. /public/css/style.css**
```css
/* ========================================
   PORT RUSSELL API - STYLES PRINCIPAUX
   ======================================== */

/* Variables */
:root {
    --primary: #0B3B5C;
    --primary-dark: #07283F;
    --secondary: #4A90E2;
    --success: #27AE60;
    --warning: #F39C12;
    --danger: #E74C3C;
    --light: #F8F9FA;
    --dark: #343A40;
    --gray: #6C757D;
    --border: #DEE2E6;
    --shadow: 0 2px 10px rgba(0,0,0,0.1);
    --radius: 8px;
}

/* Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    color: var(--dark);
    background: #F5F7FA;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    flex: 1;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.site-header {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    padding: 1rem 0;
    box-shadow: var(--shadow);
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo a {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    color: white;
}

.site-title {
    font-size: 1.5rem;
    font-weight: 600;
}

.main-nav ul {
    display: flex;
    list-style: none;
    gap: 1.5rem;
    align-items: center;
}

.main-nav a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.3s;
}

.main-nav a:hover {
    opacity: 0.8;
}

/* Sub Navigation */
.sub-nav {
    background: white;
    border-bottom: 1px solid var(--border);
    padding: 0.75rem 0;
}

.sub-nav .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sub-nav-list {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.sub-nav-list a {
    color: var(--gray);
    text-decoration: none;
    font-weight: 500;
    padding: 0.25rem 0;
    border-bottom: 2px solid transparent;
    transition: all 0.3s;
}

.sub-nav-list a:hover,
.sub-nav-list a.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
}

.user-info {
    color: var(--primary);
    font-weight: 500;
}

/* Hero Section */
.hero {
    min-height: 500px;
    display: flex;
    align-items: center;
    padding: 4rem 0;
    background: linear-gradient(135deg, #F5F7FA 0%, #E9ECEF 100%);
}

.hero-content {
    flex: 1;
    max-width: 600px;
}

.hero h1 {
    font-size: 3rem;
    color: var(--primary);
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.25rem;
    color: var(--gray);
    margin-bottom: 2rem;
}

.features-list {
    list-style: none;
    margin: 2rem 0;
}

.features-list li {
    padding: 0.5rem 0;
    font-size: 1.1rem;
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius);
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.3s;
    font-size: 1rem;
}

.btn-primary {
    background: var(--primary);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: var(--shadow);
}

.btn-secondary {
    background: white;
    color: var(--primary);
    border: 2px solid var(--primary);
}

.btn-secondary:hover {
    background: var(--primary);
    color: white;
}

.btn-danger {
    background: var(--danger);
    color: white;
}

.btn-warning {
    background: var(--warning);
    color: white;
}

.btn-success {
    background: var(--success);
    color: white;
}

.btn-outline {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--gray);
}

.btn-outline:hover {
    background: var(--light);
    color: var(--dark);
}

.btn-block {
    display: block;
    width: 100%;
}

.btn-sm {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
}

/* Forms */
.auth-container {
    max-width: 400px;
    margin: 4rem auto;
    padding: 2rem;
    background: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
}

.auth-card h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--primary);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--dark);
}

.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 1rem;
    transition: border-color 0.3s;
}

.form-control:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(11, 59, 92, 0.1);
}

textarea.form-control {
    min-height: 100px;
    resize: vertical;
}

/* Dashboard */
.dashboard-header {
    margin: 2rem 0;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--border);
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

.dashboard-section {
    background: white;
    border-radius: var(--radius);
    padding: 1.5rem;
    box-shadow: var(--shadow);
}

.dashboard-section h2 {
    color: var(--primary);
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--border);
}

.forms-grid {
    display: grid;
    gap: 1.5rem;
}

.form-card {
    background: var(--light);
    padding: 1.5rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
}

.form-card h3 {
    color: var(--dark);
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

/* Tables */
.table-responsive {
    overflow-x: auto;
    margin: 2rem 0;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
}

.data-table th {
    background: var(--primary);
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 500;
}

.data-table td {
    padding: 1rem;
    border-bottom: 1px solid var(--border);
}

.data-table tr:hover {
    background: var(--light);
}

/* Badges */
.badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
}

.badge-long {
    background: #D4EDDA;
    color: #155724;
}

.badge-short {
    background: #D1ECF1;
    color: #0C5460;
}

/* Alerts */
.alert {
    padding: 1rem;
    border-radius: var(--radius);
    margin: 1rem 0;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.alert-success {
    background: #D4EDDA;
    color: #155724;
    border: 1px solid #C3E6CB;
}

.alert-error {
    background: #F8D7DA;
    color: #721C24;
    border: 1px solid #F5C6CB;
}

.alert-icon {
    font-size: 1.25rem;
}

/* Stats */
.stats-section {
    padding: 4rem 0;
    background: white;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.stat-card {
    text-align: center;
    padding: 2rem;
    background: var(--light);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
}

.stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary);
}

.stat-label {
    color: var(--gray);
    margin-top: 0.5rem;
}

/* Documentation */
.doc-container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
}

.doc-toc {
    background: var(--light);
    padding: 1.5rem;
    border-radius: var(--radius);
    margin: 2rem 0;
}

.doc-toc ul {
    list-style: none;
    margin-top: 1rem;
}

.doc-toc li {
    padding: 0.25rem 0;
}

.doc-section {
    margin: 3rem 0;
    padding-top: 1rem;
}

.doc-section h2 {
    color: var(--primary);
    margin-bottom: 1.5rem;
}

.doc-section h3 {
    margin: 2rem 0 1rem;
    color: var(--dark);
}

.doc-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
}

.doc-table th,
.doc-table td {
    padding: 0.75rem;
    border: 1px solid var(--border);
    text-align: left;
}

.doc-table th {
    background: var(--primary);
    color: white;
}

.method-get { color: #61AFFE; }
.method-post { color: #49CC90; }
.method-put { color: #FCA130; }
.method-patch { color: #50E3C2; }
.method-delete { color: #F93E3E; }

pre {
    background: #2D2D2D;
    color: #F8F8F2;
    padding: 1rem;
    border-radius: var(--radius);
    overflow-x: auto;
    margin: 1.5rem 0;
}

code {
    font-family: 'Fira Code', monospace;
    font-size: 0.9rem;
}

/* Error Pages */
.error-page {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.error-content h1 {
    font-size: 6rem;
    color: var(--primary);
}

.error-content h2 {
    font-size: 2rem;
    color: var(--gray);
    margin: 1rem 0;
}

.error-stack {
    max-width: 600px;
    margin: 2rem auto;
    text-align: left;
    background: #F8D7DA;
    color: #721C24;
    padding: 1rem;
    border-radius: var(--radius);
    font-size: 0.85rem;
    overflow-x: auto;
}

.error-actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
}

/* Footer */
.site-footer {
    background: var(--primary-dark);
    color: white;
    padding: 2rem 0;
    margin-top: 4rem;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.footer-links {
    display: flex;
    gap: 2rem;
}

.footer-links a {
    color: white;
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.3s;
}

.footer-links a:hover {
    opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
    .hero h1 {
        font-size: 2rem;
    }
    
    .header-content {
        flex-direction: column;
        gap: 1rem;
    }
    
    .main-nav ul {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
    
    .footer-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .footer-links {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .sub-nav .container {
        flex-direction: column;
        gap: 0.5rem;
    }
}

/* Loading States */
.loading {
    opacity: 0.5;
    pointer-events: none;
}

.loading::after {
    content: "...";
    animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
    0%, 20% { content: "."; }
    40% { content: ".."; }
    60%, 100% { content: "..."; }
}

/* Empty States */
.empty-state {
    text-align: center;
    padding: 4rem;
    background: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
}

.empty-state p {
    color: var(--gray);
    margin-bottom: 1rem;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 0.5rem;
}

/* Search Bar */
.search-bar {
    margin: 2rem 0;
}

/* Filter Bar */
.filter-bar {
    margin: 1rem 0;
    display: flex;
    gap: 1rem;
    align-items: center;
}

/* Detail Card */
.detail-card {
    background: white;
    border-radius: var(--radius);
    padding: 2rem;
    box-shadow: var(--shadow);
    margin: 2rem 0;
}

.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--border);
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
}

.detail-item {
    padding: 1rem;
    background: var(--light);
    border-radius: var(--radius);
}

.detail-label {
    font-weight: 600;
    color: var(--primary);
    display: block;
    margin-bottom: 0.5rem;
}

.detail-actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

/* Update Form */
.update-form,
.delete-confirm {
    background: white;
    border-radius: var(--radius);
    padding: 2rem;
    margin: 2rem 0;
    box-shadow: var(--shadow);
    border-left: 4px solid var(--warning);
}

.delete-confirm {
    border-left-color: var(--danger);
}

.warning {
    color: var(--danger);
    font-weight: 500;
    margin: 1rem 0;
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

/* Page Header */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem 0;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--border);
}

.header-actions {
    display: flex;
    gap: 1rem;
}

/* Table Info */
.table-info {
    margin-top: 1rem;
    color: var(--gray);
    font-size: 0.9rem;
}

/* Responsive Tables */
@media (max-width: 600px) {
    .data-table {
        font-size: 0.9rem;
    }
    
    .data-table th,
    .data-table td {
        padding: 0.5rem;
    }
    
    .action-buttons {
        flex-direction: column;
    }
}