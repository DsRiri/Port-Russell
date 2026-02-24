const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config();

// Import middlewares
const { errorHandler, notFound } = require('./src/middlewares/errorMiddleware');
const { isAuthenticated } = require('./src/middlewares/authMiddleware');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const catwayRoutes = require('./src/routes/catwayRoutes');
const reservationRoutes = require('./src/routes/reservationRoutes');

// Initialisation Express
const app = express();

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connecté');
    console.log(`📊 Base de données: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB:', err);
    process.exit(1);
  });

// Middlewares de sécurité
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Configuration EJS
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// Middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session avec MongoDB
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Variables locales pour les vues
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.success = req.query.success || null;
  res.locals.error = req.query.error || null;
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catways', catwayRoutes);
app.use('/api/catways', reservationRoutes);

// Pages web
app.get('/documentation', (req, res) => {
  res.render('documentation', { title: 'Documentation' });
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { title: 'Dashboard', user: req.session.user });
});

app.get('/catways', isAuthenticated, async (req, res) => {
  try {
    const catwayService = require('./src/services/catways');
    const catways = await catwayService.getAll();
    res.render('catways', { title: 'Catways', catways });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
});

app.get('/catways/:id', isAuthenticated, async (req, res) => {
  try {
    const catwayService = require('./src/services/catways');
    const catway = await catwayService.getById(req.params.id);
    res.render('catway-details', { title: `Catway ${catway.catwayNumber}`, catway });
  } catch (error) {
    res.status(404).render('error', { message: error.message });
  }
});

app.get('/reservations', isAuthenticated, async (req, res) => {
  try {
    const reservationService = require('./src/services/reservations');
    const catwayService = require('./src/services/catways');
    const catways = await catwayService.getAll();
    const reservations = [];
    for (const catway of catways) {
      const catwayReservations = await reservationService.getByCatway(catway.catwayNumber);
      reservations.push(...catwayReservations);
    }
    res.render('reservations', { title: 'Réservations', reservations });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
});

app.get('/reservations/:id', isAuthenticated, async (req, res) => {
  try {
    const reservationService = require('./src/services/reservations');
    const reservation = await reservationService.getById(req.params.id);
    res.render('reservation-details', { title: 'Détails réservation', reservation });
  } catch (error) {
    res.status(404).render('error', { message: error.message });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

// 404
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;