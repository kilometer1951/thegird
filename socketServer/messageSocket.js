const Messages =  require("../models/message");

module.exports = function(io) {
        
    io.on('connection', function(socket) {
        
        console.log("User connected");
        
        
            socket.on('join', function(room, callback) {
                socket.join(room);
                callback();
            });
        
        socket.on('createMessage', function(message, callback) {
            console.log(message);
            
            
            //emit to client
            io.to(message.room).emit('newMessage', {
                message: message.message,
                from_id: message.from_id,
                to_id: message.to_id,
                room: message.room
            });
            
            //save data
         
          Messages.create({message: message.message, from: message.from_id, to: message.to_id , room: message.room}, function(err, newMessage){
             if(err) return console.log(err);
          });
            
            
            
            callback();
        });
        
         socket.on('disconnect', function(){
            console.log('user disconnected');
          });
    });

}