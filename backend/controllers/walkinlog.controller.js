// controllers/walkinlog.controller.js
import WalkInLog from '../models/WalkInLog.js';
import Store from '../models/Store.js';

export const createWalkInLogController = async (req, res) => {
  try {
    const user = req.user;

    // If manager, restrict to their store
    let storeId = req.body.storeId;
    if (user.role === 'manager') {
      const store = await Store.findOne({ _id: user.store });
      if (!store || store._id.toString() !== storeId) {
        return res
          .status(403)
          .json({ message: 'Unauthorized to log for this store' });
      }
    }

    const walkin = new WalkInLog({
      storeId,
      estimatedCustomerCount: req.body.estimatedCustomerCount,
    });

    await walkin.save();
    res.status(201).json(walkin);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error creating walk-in log', error: err.message });
  }
};

export const getWalkInLogsController = async (req, res) => {
  try {
    const user = req.user;

    let logs;
    if (user.role === 'admin') {
      logs = await WalkInLog.find().populate('storeId');
    } else {
      const store = await Store.findOne({ _id: user.store });
      if (!store) {
        return res.status(404).json({ message: 'No store assigned' });
      }
      logs = await WalkInLog.find({ storeId: store._id }).populate('storeId');
    }

    res.status(200).json(logs);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching walk-in logs', error: err.message });
  }
};
