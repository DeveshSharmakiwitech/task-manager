const Task = require('../models/Task');

// Create Task
const createTask = async (req, res) => {
    const { title, description, dueDate, priority } = req.body;
    const userId = req.user.id;

    try {
        const task = await Task.create({
            title,
            description,
            dueDate,
            priority,
            createdBy: userId
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Read Tasks with Filtering and Sorting
const getTasks = async (req, res) => {
    const userId = req.user.id;
    const { status, priority, sortBy, order } = req.query;

    let filter = { createdBy: userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    let sortOptions = {};
    if (sortBy && order) {
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;
    }

    try {
        const tasks = await Task.find(filter).sort(sortOptions);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, priority, status } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(id, {
            title,
            description,
            dueDate,
            priority,
            status
        }, { new: true });

        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.status(200).json(task);
    } catch (error) {
        console.log("Error: ", error)
        
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete Task
const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByIdAndDelete(id);

        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
