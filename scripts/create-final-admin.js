const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    console.log('🔄 Connessione a MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/port_russell');
    console.log('✅ Connesso a port_russell');

    const User = require('../src/models/User');

    // Pulisci
    await User.deleteMany({ email: 'capitainerie@port-russell.fr' });
    console.log('🧹 Vecchi admin rimossi');

    // Genera NUOVO hash fresco
    const hashedPassword = await bcrypt.hash('PortRussell2026', 10);
    console.log('🔐 Nuovo hash generato:', hashedPassword);

    const admin = new User({
      name: 'Capitainerie',
      email: 'capitainerie@port-russell.fr',
      password: hashedPassword
    });

    await admin.save();
    console.log('✅ Admin creato con successo!');
    console.log('📧 Email   : capitainerie@port-russell.fr');
    console.log('🔑 Password: PortRussell2026');
    console.log('🔒 Hash    :', hashedPassword);

  } catch (err) {
    console.error('❌ ERRORE:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnesso');
  }
}

createAdmin();