const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Update with your service account key path


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com' // Update with your database URL

});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint to create a new post
app.post('/posts', async (req, res) => {
  const { content } = req.body;
  const timestamp = new Date().toISOString();

  try {
    const postRef = await admin.firestore().collection('posts').add({ content, timestamp });
    res.status(201).send({ id: postRef.id, content, timestamp });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint to retrieve all posts
app.get('/posts', async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('posts').get();
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
