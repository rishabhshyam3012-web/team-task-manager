const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus } = require('../controllers/task');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, getTasks);

router.post('/', protect, admin, createTask);

router.patch('/:id', protect, updateTaskStatus);

module.exports = router;