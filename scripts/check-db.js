const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function checkDB() {
  try {
    console.log('🔄 Connessione a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/port_russell');
    console.log('✅ Connesso a MongoDB');

    const User = require('../src/models/User');

    // Conta gli utenti
    const count = await User.countDocuments();
    console.log('📊 Utenti trovati nel DB:', count);

    if (count > 0) {
      const users = await User.find();
      console.log('👤 Primo utente:', users[0]);
    } else {
      console.log('❌ Nessun utente trovato! Creazione in corso...');

      const hashedPassword = await bcrypt.hash('PortRussell2026', 10);
      
      const admin = new User({
        name: 'Capitainerie',
        email: 'capitainerie@port-russell.fr',
        password: hashedPassword
      });

      await admin.save();
      console.log('✅ Admin creato con successo!');
      console.log('📧 Email   : capitainerie@port-russell.fr');
      console.log('🔑 Password: PortRussell2026');
    }

  } catch (err) {
    console.error('❌ ERRORE:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnesso da MongoDB');
  }
}

checkDB();