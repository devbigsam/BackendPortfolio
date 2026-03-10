import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, ExternalLink } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tagline: '',
    link: '',
    color: '#8f89ff',
    githubLink: '',
    liveLink: '',
    isComingSoon: false,
    order: 0
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeader = () => ({
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const url = editingProject 
        ? `${API_URL}/api/projects/${editingProject._id}`
        : `${API_URL}/api/projects`;
      
      const res = await fetch(url, {
        method: editingProject ? 'PUT' : 'POST',
        headers: getAuthHeader(),
        body: data
      });

      if (res.ok) {
        fetchProjects();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      tagline: project.tagline || '',
      link: project.link || '',
      color: project.color || '#8f89ff',
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      isComingSoon: project.isComingSoon,
      order: project.order || 0
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      tagline: '',
      link: '',
      color: '#8f89ff',
      githubLink: '',
      liveLink: '',
      isComingSoon: false,
      order: 0
    });
    setImageFile(null);
  };

  if (loading) {
    return <div className="text-white">Loading projects...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Projects</h2>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
        >
          <Plus size={18} /> <span className="hidden sm:inline">Add Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project._id} className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <h3 className="font-semibold text-white text-sm sm:text-base truncate flex-1 pr-2">{project.title}</h3>
              {project.isComingSoon && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded whitespace-nowrap">
                  Coming Soon
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{project.description}</p>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              {project.src && (
                <img 
                  src={project.src.startsWith('http') ? project.src : `${API_URL}${project.src}`} 
                  alt={project.title}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="text-xs text-gray-500">Order: {project.order}</div>
                <div className="text-xs" style={{ color: project.color }}>● {project.color}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleEdit(project)}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-xs"
              >
                <Edit size={14} /> <span className="hidden sm:inline">Edit</span>
              </button>
              {project.liveLink && project.liveLink !== '#' && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-xs"
                >
                  <ExternalLink size={14} /> <span className="hidden sm:inline">Live</span>
                </a>
              )}
              <button
                onClick={() => handleDelete(project._id)}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-xs"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-16 sm:h-24 text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1 text-sm">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Project Link (Image)</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Color (hex)</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">GitHub Link</label>
                  <input
                    type="text"
                    value={formData.githubLink}
                    onChange={(e) => setFormData({...formData, githubLink: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Live Link</label>
                  <input
                    type="text"
                    value={formData.liveLink}
                    onChange={(e) => setFormData({...formData, liveLink: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 mt-5 sm:mt-6">
                  <input
                    type="checkbox"
                    id="isComingSoon"
                    checked={formData.isComingSoon}
                    onChange={(e) => setFormData({...formData, isComingSoon: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isComingSoon" className="text-gray-300 text-sm">Coming Soon</label>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 text-sm"
                >
                  {editingProject ? 'Update' : 'Add Project'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

