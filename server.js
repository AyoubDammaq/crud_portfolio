const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/routes');
const path = require('path');
const Contact = require('./models/contacts');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/contacts';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Routes
app.use('/contacts', contactRoutes);

// Your existing route for serving the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Route for creating a new contact
app.post('/api/contacts', async (req, res) => {
  const newContact = new Contact({
    fullname: req.body.fullname,
    email: req.body.email,
    description: req.body.description,
  });

  try {
    const savedContact = await newContact.save();
    console.log(savedContact);
    res.status(201).json(savedContact); // Use 201 status code for resource creation
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route for getting all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const allContacts = await Contact.find();
    res.status(200).json(allContacts);
  } catch (err) {
    console.error('Error getting contacts:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route for getting a specific contact by ID
app.get('/api/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).send('Contact not found');
    }
    res.status(200).json(contact);
  } catch (err) {
    console.error('Error getting contact:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route for updating a contact by ID
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedContact) {
      return res.status(404).send('Contact not found');
    }
    res.status(200).json(updatedContact);
  } catch (err) {
    console.error('Error updating contact:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route for deleting a contact by ID
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).send('Contact not found');
    }
    res.status(200).json(deletedContact);
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
