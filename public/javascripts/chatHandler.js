// Retrieve the username from local storage
const username = localStorage.getItem('username');
let socket = io();

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
document.addEventListener('DOMContentLoaded', function() {
    // join the chat room
    socket.emit('create or join', plantId, username);

    socket.on('chat', function(plantId, chatUsername, chatText) {
        console.log(chatText);
        addNewChat(`<strong>${chatUsername}:</strong> ${chatText}`);
    });

    document.getElementById('chatForm').addEventListener('submit', function(event) {
        event.preventDefault();
        sendChat();
    });
});

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via socket
 */
function sendChat() {
    let chatText = document.getElementById('chatText').value;
    socket.emit('chat', plantId, username, chatText);
    console.log('send chat');
    document.getElementById('chatText').value = '';
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
}

