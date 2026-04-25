const { validationResult } = require('express-validator');
const Client = require('../models/Client');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private/Admin
const getAllClients = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: clients.length, data: clients });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private/Admin
const createClient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, company, contact, planType, status } = req.body;

  try {
    const existing = await Client.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Client with this email already exists' });
    }

    const client = await Client.create({ name, email, company, contact, planType, status });
    res.status(201).json({ success: true, message: 'Client created successfully', data: client });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single client by ID
// @route   GET /api/clients/:id
// @access  Private
const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    next(err);
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private/Admin
const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.status(200).json({ success: true, message: 'Client updated', data: client });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.status(200).json({ success: true, message: 'Client deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllClients, createClient, getClientById, updateClient, deleteClient };
