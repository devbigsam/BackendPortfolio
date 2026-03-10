import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function EducationEditor() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await fetch(`${API_URL}/api/education`);
      const data = await res.json();
      setEducation(data);
    } catch (error) {
      console.error('Error fetching education:', error);
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
      for (const edu of education) {
        if (edu._id) {
          await fetch(`${API_URL}/api/education/${edu._id}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(edu)
          });
        } else {
          await fetch(`${API_URL}/api/education`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(edu)
          });
        }
      }
      setMessage('Education saved successfully!');
      fetchEducation();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving education:', error);
      setMessage('Error saving education');
    } finally {
      setSaving(false);
    }
  };

  const addEducation = () => {
    setEducation([...education, {
      degree: 'New Degree',
      school: 'School Name',
      year: '2024',
      achievements: [],
      skills: [],
      description: 'Description...',
      mascot: '🎓',
      order: education.length
    }]);
  };

  const deleteEducation = async (id) => {
    if (!confirm('Delete this education entry?')) return;
    
    try {
      await fetch(`${API_URL}/api/education/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      fetchEducation();
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  const updateEducation = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const handleAchievementsChange = (index, value) => {
    const updated = [...education];
    updated[index].achievements = value.split(',').map(s => s.trim()).filter(s => s);
    setEducation(updated);
  };

  const handleSkillsChange = (index, value) => {
    const updated = [...education];
    updated[index].skills = value.split(',').map(s => s.trim()).filter(s => s);
    setEducation(updated);
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Education</h2>
        <div className="flex gap-2">
          <button
            onClick={addEducation}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            <Plus size={20} /> Add Education
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
        {education.map((edu, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 flex-1 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-gray-400 text-sm mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-gray-400 text-sm mb-1">School</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(index, 'school', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-gray-400 text-sm mb-1">Year</label>
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => updateEducation(index, 'year', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    placeholder="2024"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-gray-400 text-sm mb-1">Mascot</label>
                  <input
                    type="text"
                    value={edu.mascot}
                    onChange={(e) => updateEducation(index, 'mascot', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white text-center"
                    placeholder="🎓"
                  />
                </div>
              </div>
              <button
                onClick={() => edu._id && deleteEducation(edu._id)}
                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg ml-4"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-1">Description</label>
              <textarea
                value={edu.description}
                onChange={(e) => updateEducation(index, 'description', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Achievements (comma separated)</label>
                <input
                  type="text"
                  value={edu.achievements?.join(', ') || ''}
                  onChange={(e) => handleAchievementsChange(index, e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  placeholder="GPA: 4.0, First Class Honors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={edu.skills?.join(', ') || ''}
                  onChange={(e) => handleSkillsChange(index, e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  placeholder="Python, JavaScript, React"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
