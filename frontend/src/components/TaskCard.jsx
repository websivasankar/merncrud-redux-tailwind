import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, deleteTask } from '../features/tasks/taskSlice';

export default function TaskCard({ task }) {
  const dispatch = useDispatch();
  const { token, role } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);

  const handleUpdate = () => {
    dispatch(updateTask({ token, id: task._id, data: { title: editTitle, description: editDesc } }));
    setEditing(false);
  };

  const handleDelete = () => {
    dispatch(deleteTask({ token, id: task._id }));
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border-l-4 border-indigo-400">
      {editing ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            rows={2}
            className="border border-gray-300 rounded px-3 py-1 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex gap-2 mt-1">
            <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 text-sm">Save</button>
            <button onClick={() => setEditing(false)} className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 text-sm">Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-base font-semibold text-gray-800">{task.title}</h3>
          <p className="text-sm text-gray-500">{task.description}</p>
          <span className="text-xs text-indigo-500 font-medium">{task.status}</span>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setEditing(true)} className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded hover:bg-indigo-200 text-sm">Edit</button>
            {role === 'admin' && (
              <button onClick={handleDelete} className="bg-red-100 text-red-600 px-4 py-1 rounded hover:bg-red-200 text-sm">Delete</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
