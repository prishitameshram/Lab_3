// public/app.js
document.addEventListener('DOMContentLoaded', () => {
  refreshFileList();
});

function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const fileList = fileInput.files;

  if (fileList.length > 0) {
    const formData = new FormData();
    formData.append('file', fileList[0]);

    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      showNotification('File uploaded successfully.', 'success');
      refreshFileList();
    })
    .catch(error => {
      console.error(error);
      showNotification('Error uploading file.', 'error');
    });
  }
}

function refreshFileList() {
  fetch('http://localhost:3000/files')
    .then(response => response.json())
    .then(data => {
      const fileListElement = document.getElementById('fileList');
      fileListElement.innerHTML = '';

      data.files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteFile(file);

        listItem.appendChild(deleteButton);
        fileListElement.appendChild(listItem);
      });
    })
    .catch(error => console.error(error));
}

function deleteFile(filename) {
  fetch(`/delete/${filename}`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    showNotification('File deleted successfully.', 'success');
    refreshFileList();
  })
  .catch(error => {
    console.error(error);
    showNotification('Error deleting file.', 'error');
  });
}

function showNotification(message, type) {
  const notificationsElement = document.getElementById('notifications');
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  notificationsElement.appendChild(notification);

  // Automatically remove the notification after a few seconds
  setTimeout(() => {
    notificationsElement.removeChild(notification);
  }, 3000);
}
