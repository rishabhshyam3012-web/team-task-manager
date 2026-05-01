const express = require('express');
const router = express.Router();
const { createProject } = require('../controllers/project');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, createProject);

module.exports = router;