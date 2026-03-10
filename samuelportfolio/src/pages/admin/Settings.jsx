import { useState, useEffect } from 'react';
import { Save, Globe, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Settings() {
  const [settings, setSettings] = useState({
    isComingSoonMode: false,
    siteTitle: '',
    maintenanceMessage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings`);
      const data = await res.json();
      setSettings({
        isComingSoonMode: data.isComingSoonMode || false,
        siteTitle: data.siteTitle || '',
        maintenanceMessage: data.maintenanceMessage || ''
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
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
      const res = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <Save size={20} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Coming Soon Mode */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Coming Soon Mode</h3>
              <p className="text-gray-400 text-sm">Show a coming soon message to visitors</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isComingSoonMode"
              checked={settings.isComingSoonMode}
              onChange={(e) => setSettings({ ...settings, isComingSoonMode: e.target.checked })}
              className="w-5 h-5"
            />
            <label htmlFor="isComingSoonMode" className="text-white">
              Enable Coming Soon Mode
            </label>
          </div>
        </div>

        {/* Site Title */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Site Settings</h3>
              <p className="text-gray-400 text-sm">Configure your site metadata</p>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Site Title</label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
              placeholder="Samuel Ndubuisi - Portfolio"
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-300 mb-2">Maintenance Message</label>
            <textarea
              value={settings.maintenanceMessage}
              onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white h-24"
              placeholder="We'll be back soon!"
            />
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <div className="space-y-2">
            <a href="/" target="_blank" className="block text-blue-400 hover:text-blue-300">
              → View Live Website
            </a>
            <a href="/admin" className="block text-gray-400 hover:text-white">
              → Admin Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
