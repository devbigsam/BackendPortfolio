import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function HeroEditor() {
  const [hero, setHero] = useState({
    name: '',
    title: '',
    description: '',
    welcomeText: '',
    skills: [],
    codeSnippet: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await fetch(`${API_URL}/api/hero`);
      const data = await res.json();
      setHero({
        name: data.name || '',
        title: data.title || '',
        description: data.description || '',
        welcomeText: data.welcomeText || '',
        skills: data.skills || [],
        codeSnippet: data.codeSnippet || ''
      });
    } catch (error) {
      console.error('Error fetching hero:', error);
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
      const res = await fetch(`${API_URL}/api/hero`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(hero)
      });

      if (res.ok) {
        setMessage('Hero section saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving hero:', error);
      setMessage('Error saving hero section');
    } finally {
      setSaving(false);
    }
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setHero({ ...hero, skills: skillsArray });
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Hero Section</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Name</label>
          <input
            type="text"
            value={hero.name}
            onChange={(e) => setHero({ ...hero, name: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Title (shown below name)</label>
          <input
            type="text"
            value={hero.title}
            onChange={(e) => setHero({ ...hero, title: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Welcome Text (badge)</label>
          <input
            type="text"
            value={hero.welcomeText}
            onChange={(e) => setHero({ ...hero, welcomeText: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Description</label>
          <textarea
            value={hero.description}
            onChange={(e) => setHero({ ...hero, description: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white h-24"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Skills (comma separated)
          </label>
          <textarea
            value={hero.skills.join(', ')}
            onChange={handleSkillsChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white h-32"
            placeholder="Python, Rust, React, Node.js, ..."
          />
          <p className="text-gray-500 text-sm mt-1">
            Current: {hero.skills.length} skills
          </p>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Code Snippet (optional)</label>
          <textarea
            value={hero.codeSnippet}
            onChange={(e) => setHero({ ...hero, codeSnippet: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white h-40 font-mono text-sm"
            placeholder="const profile = {...}"
          />
        </div>
      </div>
    </div>
  );
}

