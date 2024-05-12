let socket = io();

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {

    // Automatically join the chat room
    socket.emit('create or join', plantId, null);

    // socket.on('joined', function(username) {
    //    addNewChat('<strong>' + username + ':</strong>' + 'joined the chat');
    // });

    socket.on('chat', function (plantId, chatUsername, chatText) {
        console.log(chatText);
        addNewChat('<strong>' + chatUsername + ': </strong>' + chatText);
    });
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via socket
 */
function sendChat() {
    let chatText = document.getElementById('chatText').value;
    let chatUsername = document.getElementById('chatUsername').value;
    socket.emit('chat', plantId, chatUsername, chatText);
    console.log('send chat');
}

/**
 * Appends the given HTML to the existing chat
 * @param chatContent: HTML content to append
 */
function addNewChat(chatContent) {
    let chatHistory = document.getElementById('chatHistory');
    let div = document.createElement('div');
    console.log('new chat added:' + chatContent);
    div.innerHTML = chatContent;
    chatHistory.appendChild(div);
    document.getElementById('chatUsername').value = '';
    document.getElementById('chatText').value = '';
}

