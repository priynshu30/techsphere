const express = require('express');
const { body } = require('express-validator');
const {
  getAllTickets,
  createTicket,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// All ticket routes require authentication
router.use(protect);

// GET /api/tickets → Admin sees all, client sees own
router.get('/', getAllTickets);

// POST /api/tickets → Any authenticated user
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Ticket title is required').isLength({ max: 200 }).withMessage('Title max 200 characters'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],
  createTicket
);

// GET /api/tickets/:id → Authenticated user (client can only view own)
router.get('/:id', getTicketById);

// PUT /api/tickets/:id → Admin only
router.put(
  '/:id',
  authorizeRoles('admin'),
  [body('status').optional().isIn(['Open', 'In Progress', 'Resolved']).withMessage('Invalid status value')],
  updateTicket
);

// DELETE /api/tickets/:id → Admin only
router.delete('/:id', authorizeRoles('admin'), deleteTicket);

module.exports = router;
