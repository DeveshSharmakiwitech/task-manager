const User = require('../models/User');
const Task = require('../models/Task');
const sendNotification = require('../utils/sendNotification');

// Send Notification on Task Update
const notifyTaskUpdate = async (req, res) => {
    const { taskId, status } = req.body;
    const userId = req.user.id;

    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.status = status;
        await task.save();

        const assignedUser = await User.findById(task.assignedTo);

        // Send notification to the assigned user
        await sendNotification(assignedUser.email, 'Task Status Updated', `The task "${task.title}" has been updated to status: ${status}.`);

        res.status(200).json({ message: 'Notification sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send notification', error: error.message });
    }
};

module.exports = { notifyTaskUpdate };
