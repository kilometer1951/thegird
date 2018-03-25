const router = require("express").Router();
const Posts =  require("../models/posts");
const Comments =  require("../models/comments");
const Likes =  require("../models/likes");
const Users =  require("../models/Users");
const Messages =  require("../models/message");
var io = require("socket.io")


router.get('/', function(req, res) {
    
    if(req.user) {
      
       return res.render("desktop/home", { title: 'The Gird || Home'});
            
    } else {
        return res.redirect('/login');
    }
});



//image upload

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dtfyfl4kz', 
  api_key: '223622844967433', 
  api_secret: 'r20BlHgHcoH8h-EznEJPQmG6sZ0'
});





//upload data to feed
router.post('/upload', upload.single('fileupload'), function(req, res) {
   cloudinary.uploader.upload(req.file.path, function(result) {
   //save image to db
   var postImage = result.secure_url
   var postText = req.body.feed_des;
   var postedBy = req.user._id;
  
   var newData = { postText: postText, postImage: postImage, postedBy };
   Posts.create(newData, function(err, newlyCreated) {
        if(err) 
         return console.log(err);
       else 
         //get single post data
         Posts.find({ _id: newlyCreated._id })
         .populate("postedBy")
         .exec(function(err, data){
             // console.log(data);
              return res.send(data);
         })
   });
  
  });
});

//end upload

//get feed data
router.get("/comments/:id", function(req, res) {
   Posts.findById(req.params.id)  
   .populate("postedBy")
   .populate("Comments")
   .populate("Likes")
   .deepPopulate("Comments.commentedBy Likes.likedBy")
   .exec(function(err, foundData) {
      if(err) {
          return console.log(err);
      } else {
         // console.log(foundData);
          return res.send(foundData);
      }
   });
});


//submit feed comment
router.post("/comments/:id", function(req, res) {
  //check if post exist
  Posts.findById(req.params.id, function(err, posts) {
        if(err) {
            return console.log(err);
        } else {
            //create comment
            Comments.create({comment: req.body.comment_text, commentedBy: req.user._id}, function(err, newComment) {
                if(err) {
                    return console.log(err);
                } else {
                    //push comment id to post
                    //console.log(newComment);
                    posts.Comments.push(newComment._id);
                    //save post
                    posts.save(function(err, updated_post) {
                  //      console.log(posts);
                        return res.send(updated_post);
                    });
                    
                }
            });
        }
         
  });
});


//like
router.post("/like/:id", function(req, res) {
  //check if post exist
  Posts.findById(req.params.id, function(err, posts) {
        if(err) {
            return console.log(err);
        } else {
            //create comment
            Likes.create({likedBy: req.user._id, Post_id: req.params.id}, function(err, newLike) {
                if(err) {
                    return console.log(err);
                } else {
                    //push comment id to post
                    //console.log(newComment);
                    posts.Likes.push(newLike._id);
                    //save post
                    posts.save(function(err, updated_post) {
                        //console.log(updated_post);
                        return res.send(updated_post);
                    });
                    
                }
            });
        }
         
  });
});

//unlike
router.delete("/unlike/:id", function(req, res) {
  //check if Like exist
  Likes.find({ Post_id: req.params.id, likedBy: req.user._id }, function(err, likes) {
      
      //remove from post
      //mongoose method
      Posts.update({}, { $pull: { Likes:  likes[0]._id }}, function(err, updated){
            //console.log(updated);
      });
      //delete like data
      Likes.findByIdAndRemove(likes[0]._id, function(err, removed) {
          if(err) {
            console.log(err);
        } else {
             res.send(removed);
        } 
      });
  });
});


//unlike
router.delete("/comment/:id/delete", function(req, res) {
  //check if Like exist
  Comments.find({ _id: req.params.id }, function(err, comments) {
      //console.log(comments)
      //remove from post
      //mongoose method
      Posts.update({}, { $pull: { Comments:  comments[0]._id }}, function(err, updated){
            //console.log(updated);
      });
      //delete Comment data
      Comments.findByIdAndRemove(comments[0]._id, function(err, removed) {
          if(err) {
            console.log(err);
        } else {
             res.send(removed);
        } 
      });
  });
});
//edit post route
router.get('/editPost/:id', function(req, res) {
    if(req.user) {
          Posts.findById(req.params.id , function(err, foundPost) {

             return res.render("desktop/edit_post", { title: 'The Gird || Edit Post', layout: false, foundPost: foundPost});
             
          });
           
        } else {
            return res.redirect('/login');
        }
        
});

router.put('/editPost/:id', upload.single('fileupload'), function(req, res) {
    if(req.file) {
           cloudinary.uploader.upload(req.file.path, function(result) {
           //save image to db
           var postImage = result.secure_url
           var postText = req.body.feed_des;
        
           var updatedDate = { postText: postText, postImage: postImage };
           Posts.findByIdAndUpdate(req.params.id ,updatedDate, function(err, newlyUpdated) {
                if(err) 
                 return console.log(err);
               else 
                 //get single post data
                // console.log(newlyUpdated);
                 return res.redirect("/");
            });
          
          });
    } else {
       
           //save image to db
           var postText = req.body.feed_des;
        
           var updatedDate = { postText: postText };
           Posts.findByIdAndUpdate(req.params.id ,updatedDate, function(err, newlyUpdated) {
                if(err) 
                 return console.log(err);
               else 
                 //get single post data
                // console.log(newlyUpdated);
                 return res.redirect("/");
            });
          
      
    }
});
//end

///render post route

//profile Routes
router.get('/profile/:username', function(req, res) {
    if(req.user) {
          Users.find({username:req.params.username})
          .exec(function(err, userFound) {
             return res.render("desktop/profile", { title: 'The Gird || '+ req.user.first_name +'', userFound: userFound[0]});
          });
           
        } else {
            return res.redirect('/login');
        }
        
});


//message
router.get('/message/:id', function(req, res){
    Users.find({ _id: {$ne: req.user._id}}, function(err, allUsers) {
        //user messaging
        Users.find({ _id: req.params.id}, function(err, singleUser){
            //find their messages
            
            var room = (req.user._id + '/' + req.params.id).split('').sort().join('');
            Messages.find({ room: room }, function(err, messagesFound) {
                console.log(messagesFound);
                 if(req.params.id === "newMessage"){
                    res.render('desktop/message', { title: "The Gird || Message", allUsers: allUsers, singleUser: "newMessage", messagesFound: messagesFound });
                } else {
                    console.log(singleUser.length);
                    res.render('desktop/message', { title: "The Gird || Message", allUsers: allUsers, singleUser: singleUser, messagesFound: messagesFound });
                }
               
            });
        });
    });
  
});


module.exports = router