const mongoose = require('mongoose') // Mongoose is the ODM (Object Data Modeling) library that lets us define schemas and interact with MongoDB using JavaScript objects

// Define the shape and rules for documents in the 'Slugcats' collection
const SlugcatSchema = mongoose.Schema(
  {
    slugType: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    imageBackUp: {
      type: String
    },
  },
  { timestamps: true }
)

// Compile the schema into a Model and export it.
// Mongoose will map this to a MongoDB collection named 'notes' (lowercased + pluralized automatically).
// Other files import this to query, create, update, or delete notes: e.g. await Note.create({...})
module.exports = mongoose.model('Slugcat', SlugcatSchema)