document.addEventListener('DOMContentLoaded', function() {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
        let usernameModal = new bootstrap.Modal(document.getElementById('usernameModal'), {
            backdrop: 'static',   // Disable clicking outside the modal to close
            keyboard: false       // Disable using the keyboard to close
        });
        usernameModal.show();

        document.getElementById('usernameForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            console.log('Username set:', username);
            localStorage.setItem('username', username);
            usernameModal.hide();
        });
    } else {
        console.log('Username already set:', storedUsername);
    }
});
