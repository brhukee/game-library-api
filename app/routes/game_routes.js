const express = require('express')

const passport = require('passport')

const router = express.Router()

const Game = require('./../models/game')

const customErrors = require('../../lib/custom_errors')

const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

const handle404 = require('./../../lib/custom_errors')

const removeBlanks = require('../../lib/remove_blank_fields')

router.get('/games', requireToken, (req, res, next) => {
  Game.find({ owner: req.user.id })
    .then((games) => {
      res.status(200).json({ games })
    })
    .catch(next)
})

router.get('/games/:id', requireToken, (req, res, next) => {
  Game.findById(req.params.id)
    .then(handle404)
    .then((game) => {
      res.status(200).json({ game: game.toObject() })
    })
    .catch(next)
})

router.post('/games', requireToken, (req, res, next) => {
  req.body.owner = req.user._id

  Game.create(req.body)
    .then(game => res.status(201).json({ game }))
    .catch(next)
})

router.patch('/games/:id', requireToken, removeBlanks, (req, res, next) => {
  Game.findById(req.params.id)
    .then(handle404)
    .then(game => {
      requireOwnership(req, game)

      return game.updateOne(req.body)
    })
    .then(game => res.json({ game }))
    .catch(next)
})

router.delete('/games/:id', requireToken, (req, res, next) => {
  Game.findById(req.params.id)
    .then(handle404)
    .then((game) => {
      requireOwnership(req, game)

      game.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
