import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const userName = localStorage.getItem('name');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        window.location.reload();
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow">
                <h1 className="text-2xl font-bold">Welcome, {userName} ({role})</h1>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </div>
            {role === 'Admin' ? <AdminView /> : <MemberView />}
        </div>
    );
}

//ADMIN 
function AdminView() {
    const [projectData, setProjectData] = useState({ name: '', description: '' });
    const [taskData, setTaskData] = useState({ title: '', description: '', assignedTo: '', projectId: '' });
    
    // manually type IDs .
    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects', projectData);
            alert('Project Created!');
            setProjectData({ name: '', description: '' });
        } catch (error) {
            alert('Failed to create project');
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', taskData);
            alert('Task Created!');
            setTaskData({ title: '', description: '', assignedTo: '', projectId: '' });
        } catch (error) {
            alert('Failed to create task');
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Create Project</h2>
                <form onSubmit={handleCreateProject} className="space-y-4">
                    <input type="text" placeholder="Project Name" required className="w-full p-2 border rounded"
                        value={projectData.name} onChange={e => setProjectData({...projectData, name: e.target.value})} />
                    <textarea placeholder="Description" className="w-full p-2 border rounded"
                        value={projectData.description} onChange={e => setProjectData({...projectData, description: e.target.value})} />
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create Project</button>
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Assign Task</h2>
                <form onSubmit={handleCreateTask} className="space-y-4">
                    <input type="text" placeholder="Task Title" required className="w-full p-2 border rounded"
                        value={taskData.title} onChange={e => setTaskData({...taskData, title: e.target.value})} />
                    <textarea placeholder="Description" className="w-full p-2 border rounded"
                        value={taskData.description} onChange={e => setTaskData({...taskData, description: e.target.value})} />
                    
                    <input type="number" placeholder="User ID (Assigned To)" required className="w-full p-2 border rounded"
                        value={taskData.assignedTo} onChange={e => setTaskData({...taskData, assignedTo: e.target.value})} />
                    <input type="number" placeholder="Project ID" required className="w-full p-2 border rounded"
                        value={taskData.projectId} onChange={e => setTaskData({...taskData, projectId: e.target.value})} />
                    
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Task</button>
                </form>
            </div>
        </div>
    );
}

//MEMBER
function MemberView() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks');
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks');
        }
    };

    const toggleStatus = async (taskId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
            await api.patch(`/tasks/${taskId}`, { status: newStatus });
            fetchTasks(); 
        } catch (error) {
            alert('Failed to update task');
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">My Assigned Tasks</h2>
            {tasks.length === 0 ? <p>No tasks assigned yet.</p> : (
                <div className="space-y-4">
                    {tasks.map(task => (
                        <div key={task.id} className="border p-4 rounded flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg">{task.title}</h3>
                                <p className="text-gray-600 text-sm">{task.description}</p>
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded mt-2 inline-block">
                                    Project: {task.Project?.name || `ID: ${task.projectId}`}
                                </span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className={`font-semibold ${task.status === 'Completed' ? 'text-green-600' : 'text-orange-500'}`}>
                                    {task.status}
                                </span>
                                <button 
                                    onClick={() => toggleStatus(task.id, task.status)}
                                    className={`px-4 py-2 rounded text-white ${task.status === 'Pending' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}>
                                    {task.status === 'Pending' ? 'Mark Done' : 'Undo'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}