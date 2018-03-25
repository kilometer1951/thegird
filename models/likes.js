var mongoose = require("mongoose");
const Schema = mongoose.Schema;


var likesSchema = mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    likedBy: {
            type: Schema.Types.ObjectId, 
            ref: 'Users'
    },
    Post_id: String
});

module.exports = mongoose.model("Likes", likesSchema);