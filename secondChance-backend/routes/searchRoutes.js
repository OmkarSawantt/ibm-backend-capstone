const express = require('express')
const router = express.Router()
const connectToDatabase = require('../models/db')

// Search for gifts
router.get('/', async (req, res, next) => {
  try {
    // Connect to MongoDB using connectToDatabase database
    const db = await connectToDatabase()
    const collection = db.collection(process.env.MONGO_COLLECTION)

    // Initialize the query object
    const query = {}

    if (req.query.name && req.query.name.trim() !== '') {
      query.name = { $regex: req.query.name, $options: 'i' } // Using regex for partial match, case-insensitive
    }
    if (req.query.category) {
      query.category = req.query.category
    }
    if (req.query.condition) {
      query.condition = req.query.condition
    }
    if (req.query.age_years) {
      // {{insert code here}}
      query.age_years = { $lte: parseInt(req.query.age_years) }
    }
    const gifts = await collection.find(query).toArray()
    res.json(gifts)
  } catch (e) {
    next(e)
  }
})

module.exports = router
