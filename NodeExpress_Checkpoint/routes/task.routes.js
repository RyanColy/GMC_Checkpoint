const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { createTask, getTasks, deleteTask } = require('../controllers/task.controller');

// apply verifyToken to all routes in this file
// any request without a valid JWT cookie will be rejected before reaching the controllers
router.use(verifyToken);

router.post('/', createTask);
router.get('/', getTasks);
router.delete('/:id', deleteTask);

module.exports = router;
