const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fullname: { type: String},
  email: { type: String},
  description: { type: String},
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
