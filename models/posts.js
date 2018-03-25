const mongoose = require("mongoose");
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;


var PostsSchema = new mongoose.Schema({
   createdAt: { type: Date, default: Date.now },
   postText: String,
   postImage: String,
   postedBy: {
            type: Schema.Types.ObjectId, 
            ref: 'Users'
   },
   Comments: [{
           type: Schema.Types.ObjectId, 
            ref: 'Comments'
   }],
   Likes: [{
           type: Schema.Types.ObjectId, 
            ref: 'Likes'
   }]
   
});

PostsSchema.plugin(deepPopulate);


module.exports = mongoose.model('Posts', PostsSchema);