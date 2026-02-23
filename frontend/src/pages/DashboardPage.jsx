import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../features/tasks/taskSlice';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { items: tasks, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (token) dispatch(fetchTasks(token));
  }, [token, dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <TaskForm />
        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No tasks yet. Add one above!</p>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
