const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function createAdminNow() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/port_russell');
    console.log('✅ Connesso a MongoDB');

    const User = require('../src/models/User');

    // Elimina eventuali admin esistenti
    await User.deleteMany({ email: 'capitainerie@port-russell.fr' });

    // Hash FRESCO della password "PortRussell2026"
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

  } catch (err) {
    console.error('❌ Errore:', err);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminNow();