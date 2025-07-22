import Store from '../models/Store.js';
import User from '../models/User.js';

// Create store (Admin)
export const createStoreController = async (req, res) => {
  const { name, category, floor, manager } = req.body;

  try {
    // Check if manager exists and is a manager
    if (manager) {
      const managerUser = await User.findById(manager);
      if (!managerUser || managerUser.role !== 'manager') {
        return res.status(400).json({ message: 'Invalid manager ID' });
      }
    }

    const store = new Store({ name, category, floor, manager });
    await store.save();

    res.status(201).json({ message: 'Store created', store });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// View all stores (Admin)
export const getAllStoresController = async (req, res) => {
  try {
    const stores = await Store.find().populate('manager', 'name email');
    res.status(200).json(stores);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// View manager's own store
export const getManagerStoreController = async (req, res) => {
  try {
    const store = await Store.findOne({ _id: req.user.store }).populate(
      'manager',
      'name email',
    );
    if (!store)
      return res.status(404).json({ message: 'No store assigned to you' });

    res.status(200).json(store);
  } catch (error) {
    console.error('Get manager store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update store (Admin)
export const updateStoreController = async (req, res) => {
  const { id } = req.params;
  const { name, category, floor, manager } = req.body;

  try {
    const store = await Store.findById(id);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    if (manager) {
      const managerUser = await User.findById(manager);
      if (!managerUser || managerUser.role !== 'manager') {
        return res.status(400).json({ message: 'Invalid manager ID' });
      }
    }

    store.name = name ?? store.name;
    store.category = category ?? store.category;
    store.floor = floor ?? store.floor;
    store.manager = manager ?? store.manager;

    await store.save();
    res.status(200).json({ message: 'Store updated', store });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete store (Admin)
export const deleteStoreController = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Store.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Store not found' });

    res.status(200).json({ message: 'Store deleted' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
