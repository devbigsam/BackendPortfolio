import { useState, useEffect } from 'react';
import { FolderOpen, User, Code, Briefcase, GraduationCap, ExternalLink, Database, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Overview() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    education: 0
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, skillsRes, expRes, eduRes] = await Promise.all([
        fetch(`${API_URL}/api/projects`),
        fetch(`${API_URL}/api/skills`),
        fetch(`${API_URL}/api/experience`),
        fetch(`${API_URL}/api/education`)
      ]);

      const [projects, skills, experience, education] = await Promise.all([
        projectsRes.json(),
        skillsRes.json(),
        expRes.json(),
        eduRes.json()
      ]);

      setStats({
        projects: projects.length,
        skills: skills.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0),
        experience: experience.length,
        education: education.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    if (!confirm('This will add default projects to your database. Existing projects will not be overwritten. Continue?')) return;
    
    setSeeding(true);
    try {
      const res = await fetch(`${API_URL}/api/seed`, { method: 'POST' });
      const data = await res.json();
      alert(data.message || 'Database seeded successfully!');
      fetchData(); // Refresh stats
    } catch (error) {
      console.error('Error seeding database:', error);
      alert('Failed to seed database. Make sure the backend is running.');
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FolderOpen, color: 'bg-blue-500' },
    { label: 'Skills', value: stats.skills, icon: Code, color: 'bg-green-500' },
    { label: 'Experience', value: stats.experience, icon: Briefcase, color: 'bg-purple-500' },
    { label: 'Education', value: stats.education, icon: GraduationCap, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Dashboard Overview</h2>

      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <a
                href="/dashboard/projects"
                className="flex items-center gap-3 p-3 sm:p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">Manage Projects</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Add, edit, or remove</p>
                </div>
              </a>
              <a
                href="/dashboard/hero"
                className="flex items-center gap-3 p-3 sm:p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">Edit Hero</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Update intro</p>
                </div>
              </a>
              <a
                href="/"
                target="_blank"
                className="flex items-center gap-3 p-3 sm:p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <ExternalLink className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">View Website</p>
                  <p className="text-gray-400 text-xs sm:text-sm">See live portfolio</p>
                </div>
              </a>
            </div>
          </div>

          {/* Seed Database Button */}
          {stats.projects === 0 && (
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">No Projects Found</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Seed database with default projects</p>
                  </div>
                </div>
                <button
                  onClick={seedDatabase}
                  disabled={seeding}
                  className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm w-full sm:w-auto justify-center"
                >
                  <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
                  {seeding ? 'Seeding...' : 'Seed'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
