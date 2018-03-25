const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var CommentsSchema = new mongoose.Schema({
   createdAt: { type: Date, default: Date.now },
   comment: String,
   commentedBy: {
            type: Schema.Types.ObjectId, 
            ref: 'Users'
   }
});



module.exports = mongoose.model('Comments', CommentsSchema);