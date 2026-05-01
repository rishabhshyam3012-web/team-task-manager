const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./models'); 

// Import Routes
const auth = require('./routes/auth');
const project = require('./routes/project');
const task = require('./routes/task');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/projects', project);
app.use('/api/tasks', task);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Team Task Manager API is running...');
});

sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ PostgreSQL connected and models synced successfully.');
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Unable to connect to the database or sync models:', err);
    });