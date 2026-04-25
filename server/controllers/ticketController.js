const { validationResult } = require('express-validator');
const Ticket = require('../models/Ticket');

// @desc    Get tickets (admin sees all, client sees own)
// @route   GET /api/tickets
// @access  Private
const getAllTickets = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const tickets = await Ticket.find(filter)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, description } = req.body;

  try {
    const ticket = await Ticket.create({
      title,
      description,
      userId: req.user.id,
      status: 'Open',
    });
    res.status(201).json({ success: true, message: 'Ticket created successfully', data: ticket });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('userId', 'name email');
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Clients can only view their own tickets
    if (req.user.role === 'client' && ticket.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

// @desc    Update ticket status
// @route   PUT /api/tickets/:id
// @access  Private/Admin
const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.status(200).json({ success: true, message: 'Ticket updated', data: ticket });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private/Admin
const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllTickets, createTicket, getTicketById, updateTicket, deleteTicket };
