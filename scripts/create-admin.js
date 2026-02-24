const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function createAdmin() {
  try {
    console.log('🔄 Connessione a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connesso a MongoDB');

    const User = require('../src/models/User');

    // Rimuovi vecchio admin se esiste
    await User.deleteOne({ email: 'capitainerie@port-russell.fr' });
    console.log('🧹 Vecchio admin rimosso');

    // Crea nuovo admin con password hashata
    const hashedPassword = await bcrypt.hash('PortRussell2026', 10);
    const admin = new User({
      name: 'Capitainerie',
      email: 'capitainerie@port-russell.fr',
      password: hashedPassword
    });

    await admin.save();
    console.log('\n✅ ADMIN CREATO CON SUCCESSO!');
    console.log('📧 Email   : capitainerie@port-russell.fr');
    console.log('🔑 Password: PortRussell2026');
    console.log('🔒 Hash    :', hashedPassword);

  } catch (error) {
    console.error('❌ ERRORE:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnesso da MongoDB');
  }
}

createAdmin();