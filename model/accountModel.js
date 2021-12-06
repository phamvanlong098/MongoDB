const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Test');

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  username: String,
  password: String
});

const AccountModel = mongoose.model('Accounts', AccountSchema);

module.exports = AccountModel;