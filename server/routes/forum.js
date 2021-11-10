const express = require('express');
const router = express.Router();
const Thread = require('../models/ThreadModel.js');

router.post('/:category', (req, res, next) => {

});

router.post('/:category/:thread', (req, res) => {
  return res.status(200).json({ msg: "Data Recieved", data: req.body });
});

module.exports = router;
