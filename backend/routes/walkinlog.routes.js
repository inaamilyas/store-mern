// routes/walkinlog.routes.js
import { Router } from 'express';
import {
  createWalkInLogController,
  getWalkInLogsController,
} from '../controllers/walkinlog.controller.js';
import { authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/walkin-logs:
 *   post:
 *     summary: Create a walk-in log (Manager only)
 *     tags: [WalkInLogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storeId:
 *                 type: string
 *               estimatedCustomerCount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Walk-in log created
 *       403:
 *         description: Unauthorized to log for this store
 */
router.post('/', authorizeRoles(['manager']), createWalkInLogController);

/**
 * @swagger
 * /api/walkin-logs:
 *   get:
 *     summary: Get all walk-in logs (Admin or Manager)
 *     tags: [WalkInLogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of walk-in logs
 */
router.get('/', authorizeRoles(['admin', 'manager']), getWalkInLogsController);

export default router;
