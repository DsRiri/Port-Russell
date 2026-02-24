const bcrypt = require('bcrypt');

const password = 'PortRussell2026';
const hashDalDB = '$2b$10$ev.CIXe5bfr5X1Hzm3AcZOWPmjfgW7nn.DoiBu/.6jGnJme7URB5K';

console.log('🔐 Test password:', password);
console.log('📦 Hash dal DB:', hashDalDB);

bcrypt.compare(password, hashDalDB).then(result => {
  console.log('✅ La password corrisponde?', result);
});