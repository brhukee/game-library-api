const mongoose = require('mongoose')
const User = require('./user')

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  console: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game
