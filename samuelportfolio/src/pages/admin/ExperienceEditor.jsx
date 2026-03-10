import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ICON_OPTIONS = [
  { value: 'Briefcase', label: 'Briefcase' },
  { value: 'Network', label: 'Network' },
  { value: 'Boxes', label: 'Boxes' },
  { value: 'Globe', label: 'Globe' },
  { value: 'Bot', label: 'Bot' },
  { value: 'Hexagon', label: 'Hexagon' },
  { value: 'Palette', label: 'Palette' },
];

export default function ExperienceEditor() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch(`${API_URL}/api/experience`);
      const data = await res.json();
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeader = () => ({
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
    'Content-Type': 'application/json'
  });

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      for (const exp of experiences) {
        if (exp._id) {
          await fetch(`${API_URL}/api/experience/${exp._id}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(exp)
          });
        } else {
          await fetch(`${API_URL}/api/experience`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(exp)
          });
        }
      }
      setMessage('Experience saved successfully!');
      fetchExperiences();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving experience:', error);
      setMessage('Error saving experience');
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    setExperiences([...experiences, {
      title: 'New Position',
      company: 'Company Name',
      period: '2024 - Present',
      description: 'Description of your role...',
      icon: 'Briefcase',
      order: experiences.length
    }]);
  };

  const deleteExperience = async (id) => {
    if (!confirm('Delete this experience?')) return;
    
    try {
      await fetch(`${API_URL}/api/experience/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      fetchExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Experience</h2>
        <div className="flex gap-2">
          <button
            onClick={addExperience}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            <Plus size={20} /> Add Experience
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <Save size={20} /> {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 flex-1 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-gray-400 text-sm mb-1">Title</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(index, 'title', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-gray-400 text-sm mb-1">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div className="w-40">
                  <label className="block text-gray-400 text-sm mb-1">Period</label>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => updateExperience(index, 'period', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    placeholder="2024 - Present"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-gray-400 text-sm mb-1">Icon</label>
                  <select
                    value={exp.icon}
                    onChange={(e) => updateExperience(index, 'icon', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  >
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => exp._id && deleteExperience(exp._id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg ml-4"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Description</label>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white h-24"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
