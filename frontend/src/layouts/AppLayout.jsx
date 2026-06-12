import { Heart, LayoutDashboard, LogOut, Moon, Search, Shield, Sparkles, Sun, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('gemstone_theme') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('gemstone_theme', theme);
  }, [theme]);

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <Sparkles size={22} />
          <span>Gemstone</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/gemstones"><Search size={16} /> Catalog</NavLink>
          {user && <NavLink to="/recommend"><Sparkles size={16} /> Recommend</NavLink>}
          {user && <NavLink to="/dashboard"><LayoutDashboard size={16} /> Dashboard</NavLink>}
          {user && <NavLink to="/profile"><UserRound size={16} /> Profile</NavLink>}
          {user && <NavLink to="/favorites"><Heart size={16} /> Favorites</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin"><Shield size={16} /> Admin</NavLink>}
        </nav>
        <div className="top-actions">
          <button className="icon-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {user ? (
            <button className="ghost-btn" onClick={onLogout}><LogOut size={16} /> Logout</button>
          ) : (
            <>
              <Link className="ghost-btn" to="/login">Login</Link>
              <Link className="primary-btn" to="/register">Register</Link>
            </>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <div className="toast-stack">
        {notifications.map((item) => (
          <div className={`toast ${item.type}`} key={item.id}>{item.message}</div>
        ))}
      </div>
      <footer className="footer">Gemstone Recommendation App - Personalized recommendations for modern discovery.</footer>
    </div>
  );
}
