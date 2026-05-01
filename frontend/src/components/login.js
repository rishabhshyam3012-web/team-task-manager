import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/signup';
            const { data } = await api.post(endpoint, formData);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userId', data.id);
            localStorage.setItem('name', data.name);
            
            window.location.href = '/dashboard'; 
        } catch (error) {
            alert(error.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <>
                        <input type="text" placeholder="Name" required className="w-full p-2 border rounded"
                            onChange={e => setFormData({...formData, name: e.target.value})} />
                        <select className="w-full p-2 border rounded" 
                            onChange={e => setFormData({...formData, role: e.target.value})}>
                            <option value="Member">Member</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </>
                )}
                <input type="email" placeholder="Email" required className="w-full p-2 border rounded"
                    onChange={e => setFormData({...formData, email: e.target.value})} />
                <input type="password" placeholder="Password" required className="w-full p-2 border rounded"
                    onChange={e => setFormData({...formData, password: e.target.value})} />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-sm text-blue-600">
                {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
            </button>
        </div>
    );
}