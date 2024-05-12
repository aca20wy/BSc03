const plantsController = require('./plants');

exports.init = function(io) {
  io.sockets.on('connection', function (socket) {
    console.log("try");
    try {
      // join chat room
      socket.on('create or join', function (plantId, chatUsername) {
        socket.join(plantId);
        // io.sockets.to(plantId).emit('joined', plantId, chatUsername);
      });

      socket.on('chat', function (plantId, chatUsername, chatText) {
        console.log(`Received message from ${chatUsername} in room ${plantId}: ${chatText}`);
        io.sockets.to(plantId).emit('chat', plantId, chatUsername, chatText);

        let chatData = {
          plantId: plantId,
          chatUsername: chatUsername,
          chatText: chatText
        };
        console.log('Chat Data: ' + chatData);
        plantsController.saveChat(chatData);
        console.log('Chat saved!');
      });

      socket.on('disconnect', function(){
        console.log('someone disconnected');
      });
    } catch (e) {
      console.log(e);
    }
  });
}
