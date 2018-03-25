const router = require("express").Router();
const Posts =  require("../models/posts");
const Users =  require("../models/Users");



router.post('/infiniteScroll', function(req, res) {
    
    if(req.user) {
          Posts
             .find({})
             .populate('postedBy')
             .exec(function (err, data) {
                 if(err) {
                     console.log(err)
                 } else {
                     return res.send(data);
                 }
             });
        } else {
            return res.redirect('/login');
        }
});



//profile Routes
router.post('/profile/:username', function(req, res) {
    if(req.user) {
        
        //get id of user
        Users.findOne({username:req.params.username}, function(err, userFound) {
             //find users post
             Posts
             .find({ postedBy: userFound._id })
             .populate('postedBy')
             .exec(function (err, data) {
                 if(err) {
                     console.log(err)
                 } else {
                     return res.send(data);
                 }
             });
        })
          
        } else {
            return res.redirect('/login');
        }
        
});




module.exports = router