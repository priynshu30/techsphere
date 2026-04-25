const express = require('express');
const { body } = require('express-validator');
const {
  getAllClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// All client routes require authentication
router.use(protect);

// GET /api/clients → Admin only
router.get('/', authorizeRoles('admin'), getAllClients);

// POST /api/clients → Admin only
router.post(
  '/',
  authorizeRoles('admin'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('company').trim().notEmpty().withMessage('Company name is required'),
    body('planType').optional().isIn(['Basic', 'Standard', 'Premium']).withMessage('Invalid plan type'),
    body('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid status'),
  ],
  createClient
);

// GET /api/clients/:id → Admin or authenticated user
router.get('/:id', getClientById);

// PUT /api/clients/:id → Admin only
router.put('/:id', authorizeRoles('admin'), updateClient);

// DELETE /api/clients/:id → Admin only
router.delete('/:id', authorizeRoles('admin'), deleteClient);

module.exports = router;
