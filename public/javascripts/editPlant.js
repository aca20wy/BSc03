document.addEventListener('DOMContentLoaded', function() {
    const originalUser = document.getElementById('plantUsername').value;
    const currentUser = localStorage.getItem('username');
    const plantStatus = document.getElementById('plantStatus').innerText;

    // Show edit button only to the original user and if the status is still in-progress
    if (currentUser === originalUser && plantStatus === 'In-progress') {
        document.getElementById('editBtn').style.display = 'block';
    }

    document.getElementById('editBtn').addEventListener('click', toggleEditMode);
    document.getElementById('saveChangesBtn').addEventListener('click', saveChanges);
    document.getElementById('cancelChangesBtn').addEventListener('click', cancelChanges);
});

function toggleEditMode() {
    const nameField = document.getElementById('plantName');
    const statusField = document.getElementById('plantStatus');
    const editBtn = document.getElementById('editBtn');
    const saveCancelBtns = document.getElementById('saveCancelBtns');

    const isEditing = editBtn.style.display === 'none';

    if (isEditing) {
        // Switch back to view mode
        const nameInput = document.getElementById('nameInput');
        const statusSelect = document.getElementById('statusSelect');

        if (nameInput && statusSelect) {
            nameField.innerText = nameInput.value;
            statusField.innerText = statusSelect.value;

            // Show edit button again if the status is still in-progress
            if (statusSelect.value === 'In-progress') editBtn.style.display = 'block';
        }
        else {
            console.error('Input fields not found when switching back to view mode');
        }
        saveCancelBtns.style.display = 'none';
    } else {
        // Switch to edit mode
        nameField.innerHTML = `<input type="text" id="nameInput" class="form-control" value="${nameField.getAttribute('data-original-value')}">`;
        statusField.innerHTML = `
            <select id="statusSelect" class="form-control">
                <option value="In-progress" ${statusField.getAttribute('data-original-value') === 'In-progress' ? 'selected' : ''}>In-progress</option>
                <option value="Completed" ${statusField.getAttribute('data-original-value') === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
        `;
        editBtn.style.display = 'none';
        saveCancelBtns.style.display = 'block';
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
    document.getElementById('editBtn').style.display = 'block';
    document.getElementById('saveCancelBtns').style.display = 'none';
}
