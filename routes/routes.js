const express = require('express');
const router = express.Router();
const Contact = require('../models/contacts');

// Handle POST request to /contact
router.post('/', async (req, res) => {
  const { name, email, description } = req.body;

  try {
    const newContact = new Contact({ name, email, description });
    await newContact.save();

    res.status(201).json({ message: 'Contact form submitted successfully.' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
