import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ICON_OPTIONS = [
  { value: 'Code2', label: 'Code' },
  { value: 'Database', label: 'Database' },
  { value: 'Layout', label: 'Layout' },
  { value: 'Boxes', label: 'Boxes' },
  { value: 'Paintbrush', label: 'Paintbrush' },
  { value: 'Cpu', label: 'CPU' },
];

export default function SkillsEditor() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_URL}/api/skills`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
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
      for (const category of categories) {
        if (category._id) {
          await fetch(`${API_URL}/api/skills/${category._id}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(category)
          });
        } else {
          await fetch(`${API_URL}/api/skills`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(category)
          });
        }
      }
      setMessage('Skills saved successfully!');
      fetchSkills();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving skills:', error);
      setMessage('Error saving skills');
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    setCategories([...categories, {
      title: 'New Category',
      icon: 'Code2',
      color: 'text-blue-400',
      skills: [],
      order: categories.length
    }]);
  };

  const deleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;
    
    try {
      await fetch(`${API_URL}/api/skills/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      fetchSkills();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const updateCategory = (index, field, value) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const addSkill = (catIndex) => {
    const updated = [...categories];
    updated[catIndex].skills.push({ name: 'New Skill', icon: 'Code2' });
    setCategories(updated);
  };

  const updateSkill = (catIndex, skillIndex, field, value) => {
    const updated = [...categories];
    updated[catIndex].skills[skillIndex][field] = value;
    setCategories(updated);
  };

  const deleteSkill = (catIndex, skillIndex) => {
    const updated = [...categories];
    updated[catIndex].skills.splice(skillIndex, 1);
    setCategories(updated);
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Skills</h2>
        <div className="flex gap-2">
          <button
            onClick={addCategory}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            <Plus size={20} /> Add Category
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

      <div className="space-y-6">
        {categories.map((category, catIndex) => (
          <div key={catIndex} className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 flex-1">
                <div className="flex-1">
                  <label className="block text-gray-400 text-sm mb-1">Category Title</label>
                  <input
                    type="text"
                    value={category.title}
                    onChange={(e) => updateCategory(catIndex, 'title', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-gray-400 text-sm mb-1">Icon</label>
                  <select
                    value={category.icon}
                    onChange={(e) => updateCategory(catIndex, 'icon', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  >
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <label className="block text-gray-400 text-sm mb-1">Color</label>
                  <input
                    type="color"
                    value={category.color?.replace('text-', '') || '#60A5FA'}
                    onChange={(e) => updateCategory(catIndex, 'color', `text-${e.target.value}`)}
                    className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg"
                  />
                </div>
              </div>
              <button
                onClick={() => category._id && deleteCategory(category._id)}
                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg ml-4"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-gray-400 text-sm">Skills</label>
                <button
                  onClick={() => addSkill(catIndex)}
                  className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1"
                >
                  <Plus size={16} /> Add Skill
                </button>
              </div>
              {category.skills?.map((skill, skillIndex) => (
                <div key={skillIndex} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(catIndex, skillIndex, 'name', e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    placeholder="Skill name"
                  />
                  <button
                    onClick={() => deleteSkill(catIndex, skillIndex)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {(!category.skills || category.skills.length === 0) && (
                <p className="text-gray-500 text-sm">No skills added yet</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

