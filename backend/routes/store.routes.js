import { Router } from 'express';
import {
  createStoreController,
  getAllStoresController,
  updateStoreController,
  deleteStoreController,
  getManagerStoreController,
} from '../controllers/store.controller.js';
import { authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/stores:
 *   post:
 *     summary: Create a new store (Admin only)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               floor:
 *                 type: number
 *               manager:
 *                 type: string
 *                 description: Manager user ID (optional)
 *     responses:
 *       201:
 *         description: Store created
 *       400:
 *         description: Invalid input
 */
router.post('/', authorizeRoles(['admin']), createStoreController);

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: Get all stores (Admin only)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stores
 */
router.get('/', authorizeRoles(['admin']), getAllStoresController);

/**
 * @swagger
 * /api/stores/{id}:
 *   put:
 *     summary: Update a store (Admin only)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               floor:
 *                 type: number
 *               manager:
 *                 type: string
 *     responses:
 *       200:
 *         description: Store updated
 *       404:
 *         description: Store not found
 */
router.put('/:id', authorizeRoles(['admin']), updateStoreController);

/**
 * @swagger
 * /api/stores/{id}:
 *   delete:
 *     summary: Delete a store (Admin only)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store deleted
 *       404:
 *         description: Store not found
 */
router.delete('/:id', authorizeRoles(['admin']), deleteStoreController);

/**
 * @swagger
 * /api/stores/my-store:
 *   get:
 *     summary: Get the manager's assigned store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Store details
 *       404:
 *         description: No store assigned
 */
router.get('/my-store', authorizeRoles(['manager']), getManagerStoreController);

export default router;
