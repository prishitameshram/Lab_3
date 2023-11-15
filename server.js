const express = require('express');
const multer = require('multer');
const fs = require('fs');
const admin = require('firebase-admin');
const serviceAccount = require('./lab3-752e1-firebase-adminsdk-uyg6u-885eb2cec1.json'); // Update the filename

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lab3-752e1.firebaseio.com', // Update with your Firebase project URL
});

const bucket = admin.storage().bucket();

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Example upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  const filename = req.file.originalname;
  const fileContent = req.file.buffer;

  const file = bucket.file(filename);

  file.createWriteStream({ resumable: false })
    .end(fileContent, () => {
      res.json({ message: 'File uploaded successfully.' });
    });
});

// Example delete endpoint
app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;

  const file = bucket.file(filename);

  file.delete()
    .then(() => {
      res.json({ message: 'File deleted successfully.' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error deleting file from Firebase Storage.' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
