const express = require('express');
const { body } = require('express-validator');
const {
  getAllServices,
  createService,
  getServiceById,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// GET /api/services → Public
router.get('/', getAllServices);

// GET /api/services/:id → Public
router.get('/:id', getServiceById);

// POST /api/services → Admin only
router.post(
  '/',
  protect,
  authorizeRoles('admin'),
  [
    body('name').trim().notEmpty().withMessage('Service name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number').custom((v) => v >= 0).withMessage('Price must be non-negative'),
    body('activeStatus').optional().isBoolean().withMessage('activeStatus must be a boolean'),
  ],
  createService
);

// PUT /api/services/:id → Admin only
router.put('/:id', protect, authorizeRoles('admin'), updateService);

// DELETE /api/services/:id → Admin only
router.delete('/:id', protect, authorizeRoles('admin'), deleteService);

module.exports = router;
