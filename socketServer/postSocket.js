const Posts =  require("../models/posts");

module.exports = function(io) {
        
    io.on('connection', function(socket) {
      
        
        socket.on('newPost', function(postSocketData){
            // socket.broadcast.emit('newPost', postSocketData);
             
             io.emit('newPost', postSocketData);
             socket.broadcast.emit('newPost_Uploaded', postSocketData);
             
          });
          
          socket.on('join', function(post_id, callback) {
              socket.join(post_id);
              callback();
          });
          
          
          socket.on('createComment', function(data) {
            // console.log(data); 
             //emit data back to client
             io.to(data.post_id).emit('newComment', {
                     first_name: data.first_name,
                     img: data.img,
                     comment_text: data.comment_text,
                     post_id: data.post_id,
                     com_num: data.com_num,
                     users_username: data.users_username
             });
          });
          
        
         socket.on('disconnect', function(){
            console.log('user disconnected');
          });
    });

}