 
const asyncHandler = require('express-async-handler')
 
const Slugcat = require('../model/SlugcatModel')
const User = require('../model/userModel') // for update and delete

// http://localhost:5555/api/Slugcats/
const getSlugcats = asyncHandler(async (req, res) =>{
  
  
    const Slugcats = await Slugcat.find()
 
    res.status(200).json(Slugcats)
})

// ===== CREATE A SLUGCAT =====
const setSlugcat = asyncHandler(async(req, res) => {

    // Validate that the request body contains a 'text' field 
    //  without this check, we'd save empty/useless Slugcats to the database
    if(!req.body.text){
        // Set status to 400 (Bad Request) 
        //  tells the client they sent invalid data
        res.status(400)
        // Throw an error with a helpful message 
        //  asyncHandler catches this and passes it to our errorMiddleware
        throw new  Error("Please add a 'text' field. ")
    }


    // Insert a new Slugcat document into MongoDB 
    //  .create() both builds and saves the document in one step
    const Slugcat_created = await Slugcat.create(
        {
            // Set the text field to whatever the client sent in the request body
            text: req.body.text,
            user: req.user.id // adding which user created the Slugcat
            
        }
    )

    // Send back the newly created Slugcat as JSON 
    //  the client gets confirmation of what was saved, 
    // including the auto-generated _id
    res.status(200).json(Slugcat_created)
})

// ===== UPDATE A SLUGCAT =====
const updateSlugcat =  asyncHandler(async(req, res) => {

    // if we need to update any Slugcat - we need an id
    // Look up the Slugcat by the id from the URL parameter (e.g., /api/Slugcats/abc123) 
    //  we first check if it exists before trying to update
    const Slugcat = await Slugcat.findById(req.params.id) // this will find our Slugcat

    // If no Slugcat was found with that id, send a 400 error 
    //  prevents updating a non-existent document
    if(!Slugcat){
        res.status(400)
        throw new Error("Slugcat not found")
    }

    //-------Only authorized user can update their Slugcat---------------
    const user = await User.findById(req.user.id)
    // we want to check if useer exist or not, if yes then they can only update and delete their Slugcats
    if(!user){
        res.status(401)
        throw new Error(' user not found')
    }

    // Only the Slugcats that belong to the user should be modified by that user.
    if (Slugcat.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
     }

    //--------------------------------------------


    // now lets update the Slugcat 
    // Find the Slugcat by id and update its text field in one operation
    const updatedSlugcat = await Slugcat.findByIdAndUpdate(
        req.params.id,          // which Slugcat to update
        {text: req.body.text},  // the new data to apply
        {new: true}             // return the updated document instead of the old one 
        //  without this, Mongoose returns the document as it was BEFORE the update
    )

    // Send back the updated Slugcat so the client can see the changes took effect
    res.status(200).json(updatedSlugcat)
})

// ===== DELETE A SLUGCAT =====
const deleteSlugcat = asyncHandler(async (req, res) => {

    // Find the Slugcat first 
    //  we need the document object to call .deleteOne() on it
    const Slugcat = await Slugcat.findById(req.params.id) // this will find our Slugcat

    // If the Slugcat doesn't exist, tell the client 
    //  prevents trying to delete something that's already gone
    if(!Slugcat){
        res.status(400)
        throw new Error("Slugcat not found")
    }


    //-------Only authorized user can update their Slugcat ---------------
    const user = await User.findById(req.user.id)
    // we want to check if useer exist or not, if yes then they can only update and delete their Slugcats
    if(!user){
        res.status(401)
        throw new Error(' user not found')
    }

    // check if the Slugcat has the user field, because we are adding the user key in the database
    if (Slugcat.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
     }

    //--------------------------------

    // Remove the Slugcat from the database 
    //  .deleteOne() is called on the document instance we found above
    await Slugcat.deleteOne()

    // Send back a confirmation message with the deleted Slugcat's id 
    //  lets the client know which Slugcat was removed
    res.status(200).json({ message: `Delete Slugcat ${req.params.id}` })
}
)

// Export all four functions so SlugCatRoutes.js can attach them to the corresponding HTTP endpoints
module.exports = {
    getSlugcats,
    setSlugcat,
    updateSlugcat,
    deleteSlugcat
}