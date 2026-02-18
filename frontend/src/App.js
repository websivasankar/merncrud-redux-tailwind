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

  const createTask = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/tasks', 
      { title, description },
      { headers: { Authorization: token } }  // ✅ Send token
    );
    setTitle('');
    setDescription('');
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setTasks([]);
  };

  // ✅ Show login page if no token
  if (!token) {
    return <Auth setToken={setToken} />;
  }

  return (
    <div>
      <h1>Todo App</h1>
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
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;