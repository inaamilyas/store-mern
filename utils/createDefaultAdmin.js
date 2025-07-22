import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const createDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ role: 'admin' });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new User({
      name: 'Default Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    console.log('Default admin user created: admin@example.com / admin123');
  } else {
    console.log('Admin user already exists');
  }
};
