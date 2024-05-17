// Retrieve the username and plant id from local storage
const username = localStorage.getItem('username');
const plantId = localStorage.getItem('viewing_plant')
let offline = false;

let socket = io();

// Handle socket connection errors
socket.io.on("error", (error) => {
    console.log("Chat error")
    socket.disconnect()
    offline = true;
})

/**
 * Called when the DOM content is fully loaded
 * Initializes the interface and the expected socket messages plus the associated actions
 */
document.addEventListener('DOMContentLoaded', function() {
    // Join the chat room
    socket.emit('create or join', plantId, username);

    // Listen for incoming chat messages
    socket.on('chat', function(plantId, chatUsername, chatText) {
        console.log(chatText);
        addNewChat(`<strong>${chatUsername}:</strong> ${chatText}`);
    });

    // Add event listener to the chat form for submitting new messages
    document.getElementById('chatForm').addEventListener('submit', function(event) {
        event.preventDefault();
        sendChat();
    });
});

/**
 * Called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via socket
 */
document.getElementById("chatForm").addEventListener('onsubmit', function() {
    sendChat()
    return false
} )

/**
 * Sends chat messages offline by adding them to the screen and IndexedDB
 */
function sendOfflineChat() {
    let chatText = document.getElementById('chatText').value;
    addNewOfflineChat(chatText) // Add chat to the screen
    document.getElementById('chatText').value = '';

    let plantId = localStorage.getItem("viewing_plant");
    if (plantId.length === 24) {
        let chatData = {
            chatUsername: localStorage.getItem("username"),
            chatText: chatText,
            chatTimeStamp: new Date(),
            plantId: plantId
        };

        openChatIDB().then((chatIDB) => {
            // Add chat to IndexedDB for regular chats
            addNewChatToIDB(chatIDB, chatData)
        });
    } else {
        let chatData = {
            chatUsername: localStorage.getItem("username"),
            chatText: chatText,
            chatTimeStamp: new Date(),
            plantId: plantId
        };
        // Add chat to IndexedDB for sync chats
        openSyncChatIDB().then((chatIDB) => {
            addNewSyncChatToIDB(chatIDB, chatData)
        })
    }
}

/**
 * Sends chat messages online or offline based on the connection status
 */
function sendChat() {
    if(!offline)
    {
        let chatText = document.getElementById('chatText').value;
        socket.emit('chat', plantId, username, chatText);
        console.log('send chat');
        document.getElementById('chatText').value = '';
    }
    else
    {
        sendOfflineChat()
    }

}

/**
 * Appends the given HTML to the existing chat
 * @param chatContent: HTML content to append
 */
function addNewChat(chatContent) {
    let chatHistory = document.getElementById('chatHistory');
    let div = document.createElement('div');
    // console.log('new chat added:' + chatContent);
    div.innerHTML = chatContent;
    chatHistory.appendChild(div);
}

/**
 * Adds new offline chat message to the chat history
 * @param chatText: Text content of the chat message
 */
function addNewOfflineChat(chatText){
    let chatHistory = document.getElementById('chatHistory');
    let chat_template = document.getElementById("chat_template").cloneNode(true);
    chat_template.removeAttribute("id");
    chat_template.innerHTML = "<strong>"+localStorage.getItem("username")+":</strong> " + chatText;
    chatHistory.appendChild(chat_template);
}

