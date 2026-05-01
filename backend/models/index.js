const sequelize = require('../config/database');
const User = require('./user');
const Project = require('./project');
const Task = require('./task');

Project.hasMany(Task, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId' });

User.hasMany(Task, { foreignKey: 'assignedTo', onDelete: 'SET NULL' });
Task.belongsTo(User, { as: 'Assignee', foreignKey: 'assignedTo' });

module.exports = {
    sequelize,
    User,
    Project,
    Task
};