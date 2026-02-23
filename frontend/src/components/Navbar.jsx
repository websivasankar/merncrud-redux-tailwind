import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold tracking-wide">📝 Task Manager</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">{email}</span>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          role === 'admin' ? 'bg-yellow-400 text-black' : 'bg-indigo-300 text-indigo-900'
        }`}>
          {role === 'admin' ? '🔑 Admin' : '👤 User'}
        </span>
        <button
          onClick={handleLogout}
          className="bg-white text-indigo-600 text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-indigo-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
