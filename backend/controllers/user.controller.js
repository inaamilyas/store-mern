import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kdjfsafajfddasjfas';

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('JWT_SECRET', JWT_SECRET);

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Create User Controller
export const createUserController = async (req, res) => {
  const { name, email, password, role, store_id } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      store_id: role === 'manager' ? store_id : null,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// View all users (admin only)
export const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude passwords
    res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a user by ID (admin only)
export const updateUserController = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, store_id } = req.body;

  try {
    const updates = {};

    if (name != null) updates.name = name;
    if (email != null) updates.email = email;
    if (role != null) updates.role = role;
    if (store_id != null) updates.store = store_id;

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user by ID (admin only)
export const deleteUserController = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
