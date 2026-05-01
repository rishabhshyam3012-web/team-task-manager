const { Task, Project, User } = require('../models');

const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, projectId } = req.body;

        if (!title || !assignedTo || !projectId) {
            return res.status(400).json({ message: 'Title, assignedTo, and projectId are required' });
        }

        const task = await Task.create({
            title,
            description,
            assignedTo,
            projectId,
            status: 'Pending'
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        let tasks;
        
        const includeOptions = [
            { model: Project, attributes: ['name'] },
            { model: User, as: 'Assignee', attributes: ['name', 'email'] }
        ];

        if (req.user.role === 'Admin') {
            tasks = await Task.findAll({ include: includeOptions });
        } else {
            tasks = await Task.findAll({
                where: { assignedTo: req.user.id },
                include: includeOptions
            });
        }

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (req.user.role !== 'Admin' && task.assignedTo !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        if (status && !['Pending', 'Completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        task.status = status || task.status;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createTask, getTasks, updateTaskStatus };