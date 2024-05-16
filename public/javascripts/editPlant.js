document.addEventListener('DOMContentLoaded', function() {
    const originalUser = document.getElementById('plantUsername').value;
    const currentUser = localStorage.getItem('username');

    if (currentUser === originalUser) {
        document.getElementById('editButton').style.display = 'block';
    }

    document.getElementById('editButton').addEventListener('click', toggleEditMode);
    document.getElementById('saveChangesButton').addEventListener('click', saveChanges);
    document.getElementById('cancelChangesButton').addEventListener('click', cancelChanges);
});

function toggleEditMode() {
    const nameField = document.getElementById('plantName');
    const statusField = document.getElementById('plantStatus');
    const editButton = document.getElementById('editButton');
    const saveCancelButtons = document.getElementById('saveCancelButtons');

    const isEditing = editButton.style.display === 'none';

    if (isEditing) {
        // Switch back to view mode
        const nameInput = document.getElementById('nameInput');
        const statusSelect = document.getElementById('statusSelect');

        if (nameInput && statusSelect) {
            nameField.innerText = nameInput.value;
            statusField.innerText = statusSelect.value;
        } else {
            console.error('Input fields not found when switching back to view mode');
        }

        editButton.style.display = 'block';
        saveCancelButtons.style.display = 'none';
    } else {
        // Switch to edit mode
        nameField.innerHTML = `<input type="text" id="nameInput" class="form-control" value="${nameField.getAttribute('data-original-value')}">`;
        statusField.innerHTML = `
            <select id="statusSelect" class="form-control">
                <option value="In-progress" ${statusField.getAttribute('data-original-value') === 'In-progress' ? 'selected' : ''}>In-progress</option>
                <option value="Completed" ${statusField.getAttribute('data-original-value') === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
        `;
        editButton.style.display = 'none';
        saveCancelButtons.style.display = 'block';
    }
}

function saveChanges() {
    const plantId = document.getElementById('plantId').value;
    const newName = document.getElementById('nameInput').value;
    const newStatus = document.getElementById('statusSelect').value;

    console.log('Sending update request:', { name: newName, nameStatus: newStatus });

    fetch(`${plantId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: plantId, name: newName, nameStatus: newStatus }),
    })
        .then(response => {
            console.log('response:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Received response:', data);
            document.getElementById('plantName').setAttribute('data-original-value', newName);
            document.getElementById('plantStatus').setAttribute('data-original-value', newStatus);
            toggleEditMode(); // Switch back to view mode with updated values
        })
        .catch(err => {
            console.error('Fetch error:', err);  // Debug statement
            alert('Failed to update plant details');
        });
}

function cancelChanges() {
    const nameField = document.getElementById('plantName');
    const statusField = document.getElementById('plantStatus');
    nameField.innerHTML = nameField.getAttribute('data-original-value');
    statusField.innerHTML = statusField.getAttribute('data-original-value');
    document.getElementById('editButton').style.display = 'block';
    document.getElementById('saveCancelButtons').style.display = 'none';
}
