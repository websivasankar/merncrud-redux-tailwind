import { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState(localStorage.getItem('role'));   // ✅ Load saved role

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: token }  // ✅ Send token
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

const validate = () => {
  const newErrors = {};
  if (!title.trim()) newErrors.title = 'Title is required.';
  else if (title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters.';
  if (description.length > 200) newErrors.description = 'Description max 200 characters.';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const createTask = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await axios.post('http://localhost:5000/api/tasks', 
      { title, description },
      { headers: { Authorization: token } }  // ✅ Send token
    );
    setTitle('');
    setDescription('');
    setErrors({});
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {  // ✅ Fixed syntax + token
      headers: { Authorization: token }
    });
    fetchTasks();
  };

  const updateTask = async (id) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, {  // ✅ Fixed syntax
      title: editTitle,
      description: editDescription
    }, {
      headers: { Authorization: token }  // ✅ Send token
    });
    setEditId(null);
    fetchTasks();
  };

  // ✅ Accept role from Auth component on login
  const handleLogin = (newToken, newRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    setTasks([]);

  };

  if (!token) {
    return <Auth setToken={handleLogin} />;
  }

  return (
    <div>
      <h1>Todo App</h1>
      <p>Logged in as: <strong>{role === 'admin' ? '🔑 Admin' : '👤 User'}</strong></p>
      <button onClick={handleLogout}>Logout</button>  {/* ✅ Logout button */}
      
      {/* CREATE FORM */}
      <form onSubmit={createTask}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {errors.title && <p style={{ color: 'red' }}>{errors.title}</p>}
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
        <button type="submit">Add Task</button>
      </form>

      {/* TASK LIST */}
      {tasks.map((task) => (
        <div key={task._id}>
          {editId === task._id ? (
            // EDIT MODE
            <div>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <button onClick={() => updateTask(task._id)}>Save</button>
              <button onClick={() => setEditId(null)}>Cancel</button>
            </div>
          ) : (
            // VIEW MODE
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>{task.status}</p>
              <button onClick={() => {
                setEditId(task._id);
                setEditTitle(task.title);
                setEditDescription(task.description);
              }}>Edit</button>
             {role === 'admin' && (
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;