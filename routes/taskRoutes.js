const express = require('express');
const router = express.Router();

const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

const {
    assignTask,
    getAssignedTasks
} = require('../controllers/taskAssignmentController');

const { notifyTaskUpdate } = require('../controllers/notificationController');

const { protect, isManager, isAdmin } = require('../middlewares/authMiddleware');

router.post('/tasks', protect, createTask);
router.get('/tasks', protect, getTasks);
router.put('/tasks/:id', protect, updateTask);
router.delete('/tasks/:id', protect, deleteTask);

router.post('/tasks/assign', protect, isManager, assignTask);
router.get('/tasks/assigned', protect, getAssignedTasks);

router.post('/notifications/task-update', protect, notifyTaskUpdate);

module.exports = router;
