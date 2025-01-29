const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1) Connect to MongoDB using Mongoose
// Replace this with your actual MongoDB connection string from Atlas
const mongoURI = 'mongodb+srv://ashlingmccarthy:Nijmknijmk10!@trinitysexmap.yqolk.mongodb.net/?retryWrites=true&w=majority&appName=TrinitySexMap';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Check the connection status
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// 2) Define Mongoose Schemas & Models

// Node Schema
const nodeSchema = new mongoose.Schema({
  // Using `id` as a unique name for the person
  id: {
    type: String,
    required: true,
    unique: true
  }
});

// Link Schema
const linkSchema = new mongoose.Schema({
  source: { type: String, required: true },
  target: { type: String, required: true }
});

const NodeModel = mongoose.model('Node', nodeSchema);
const LinkModel = mongoose.model('Link', linkSchema);

// 3) Setup Express
const app = express();
app.use(cors());
app.use(express.json());

// 4) Define Routes

// GET entire graph
app.get('/api/graph', async (req, res) => {
  try {
    const nodes = await NodeModel.find({});
    const links = await LinkModel.find({});
    res.json({ nodes, links });
  } catch (err) {
    console.error('Error fetching graph data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST add person (node) + optional link
app.post('/api/add-person', async (req, res) => {
  const { name, connectTo } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    // Check if person already exists
    const existing = await NodeModel.findOne({ id: name });
    if (existing) {
      return res.status(400).json({ error: 'Person already exists' });
    }

    // Create new node
    const newNode = new NodeModel({ id: name });
    await newNode.save();

    // If connectTo is provided, create a link
    if (connectTo) {
      const link = new LinkModel({ source: connectTo, target: name });
      await link.save();
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error adding person:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
