
import { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { 
  Home, FolderOpen, User, Code, Briefcase, GraduationCap, 
  Settings, LogOut, Menu, X
} from 'lucide-react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');
    
    if (!token) {
      navigate('/admin');
      return;
    }
    
    setUser({ email });

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Overview', exact: true },
    { path: '/dashboard/projects', icon: FolderOpen, label: 'Projects' },
    { path: '/dashboard/hero', icon: User, label: 'Hero' },
    { path: '/dashboard/skills', icon: Code, label: 'Skills' },
    { path: '/dashboard/experience', icon: Briefcase, label: 'Experience' },
    { path: '/dashboard/education', icon: GraduationCap, label: 'Education' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Header */}
      <header className="lg:hidden bg-gray-800 border-b border-gray-700 px-3 py-3 flex items-center justify-between sticky top-0 z-40">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-700 text-white"
        >
          <Menu size={22} />
        </button>
        <h2 className="text-base font-semibold text-white">Admin</h2>
        <a 
          href="/" 
          target="_blank"
          className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
        >
          View
        </a>
      </header>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <aside 
          className={`
            fixed top-0 left-0 h-full w-64 bg-gray-800 z-50 transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-4 flex items-center justify-between border-b border-gray-700">
            <h1 className="text-lg font-bold text-white">Admin</h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-700 text-white"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="p-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white mb-1 transition-colors"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 w-full transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>
      )}

      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-64 bg-gray-800 flex-col">
        <div className="p-4 border-b border-gray-700 h-14">
          <h1 className="text-lg font-bold text-white">Admin</h1>
        </div>
        <nav className="flex-1 p-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white mb-1 transition-colors"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 w-full transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Desktop Header */}
        <header className="hidden lg:flex bg-gray-800 border-b border-gray-700 px-6 py-4 items-center justify-between sticky top-0 z-30">
          <h2 className="text-lg font-semibold text-white">Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user?.email}</span>
            <a 
              href="/" 
              target="_blank"
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
            >
              View Site
            </a>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

