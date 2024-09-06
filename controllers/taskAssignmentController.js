const Task = require('../models/Task');

// Assign Task to User
const assignTask = async (req, res) => {
    const { taskId, userId } = req.body;
    const managerId = req.user.id; // Assuming manager is logged in

    try {
        const task = await Task.findById(taskId);

        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Logic to ensure manager can only assign within their team
        // Assuming you have a Team/Manager relation

        task.assignedTo = userId;
        await task.save();

        res.status(200).json({ message: 'Task assigned successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// View Assigned Tasks
const getAssignedTasks = async (req, res) => {
    const userId = req.user.id;

    try {
        const tasks = await Task.find({ assignedTo: userId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { assignTask, getAssignedTasks };
