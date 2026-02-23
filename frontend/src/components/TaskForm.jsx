import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../features/tasks/taskSlice';

export default function TaskForm() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    else if (title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters.';
    if (description.length > 200) newErrors.description = 'Max 200 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(createTask({ token, data: { title, description } }));
    setTitle('');
    setDescription('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">➕ Add New Task</h2>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
      <div className="mb-3">
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
      >
        Add Task
      </button>
    </form>
  );
}
