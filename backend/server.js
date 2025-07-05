// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const authRoutes = require('./routes/auth');
// const notesRoutes = require('./routes/notes');

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/notes', notesRoutes);

// app.listen(5000, () => {
//     console.log('Server is running on port 5000');
// });

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const aiNotesRoutes = require('./routes/aiNotes');

const app = express();

// ✅ Setup CORS
app.use(cors({
    origin: 'http://localhost:3000',  // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // if you want to send cookies (optional)
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/ai-notes', aiNotesRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
