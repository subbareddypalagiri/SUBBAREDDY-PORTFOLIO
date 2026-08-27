import React, { useState, useEffect } from 'react';
import portfolioData from './data.json';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [data, setData] = useState(portfolioData);
  const [feedbackList, setFeedbackList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/get-feedback')
      .then(res => res.json())
      .then(json => setFeedbackList(json))
      .catch(err => console.error('Error loading feedback:', err));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      setMessage('Uploading image...');
      try {
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reader.result })
        });
        const result = await response.json();
        if (result.success) {
          setData({ ...data, profile: { ...data.profile, avatarUrl: result.url } });
          setMessage('Image uploaded successfully! Click "Save All Changes" to finalize.');
        } else {
          setMessage('Failed to upload image.');
        }
      } catch (err) {
        setMessage('Error uploading image: ' + err.message);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data, null, 2)
      });
      if (response.ok) {
        setMessage('Changes Saved Successfully! Restart dev server if needed.');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage('Failed to save changes.');
      }
    } catch (err) {
      setMessage('Error saving: ' + err.message);
    }
    setSaving(false);
  };

  const handleProfileChange = (e) => {
    setData({
      ...data,
      profile: { ...data.profile, [e.target.name]: e.target.value }
    });
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    const newArray = [...data[arrayName]];
    newArray[index] = { ...newArray[index], [field]: value };
    setData({ ...data, [arrayName]: newArray });
  };

  const addArrayItem = (arrayName, defaultItem) => {
    setData({ ...data, [arrayName]: [...data[arrayName], defaultItem] });
  };

  const removeArrayItem = (arrayName, index) => {
    const newArray = data[arrayName].filter((_, i) => i !== index);
    setData({ ...data, [arrayName]: newArray });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-10 overflow-y-auto">
      <div className="max-w-4xl mx-auto pb-20">
        
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black tracking-tighter">PORTFOLIO ADMIN CMS</h1>
          <div className="flex gap-4">
            <button onClick={() => navigate('/')} className="px-6 py-2 bg-gray-800 rounded hover:bg-gray-700 transition">Back to Site</button>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="px-6 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition"
            >
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-8 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded font-bold">
            {message}
          </div>
        )}

        <section className="mb-12 bg-white/5 p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">Profile & Hero</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-400 mb-1">First Name</label><input type="text" name="firstName" value={data.profile.firstName} onChange={handleProfileChange} className="w-full bg-black border border-white/20 p-2 rounded text-white" /></div>
            <div><label className="block text-sm text-gray-400 mb-1">Last Name</label><input type="text" name="lastName" value={data.profile.lastName} onChange={handleProfileChange} className="w-full bg-black border border-white/20 p-2 rounded text-white" /></div>
            <div className="col-span-2"><label className="block text-sm text-gray-400 mb-1">Title</label><input type="text" name="title" value={data.profile.title} onChange={handleProfileChange} className="w-full bg-black border border-white/20 p-2 rounded text-white" /></div>
            <div className="col-span-2"><label className="block text-sm text-gray-400 mb-1">Description (Intro)</label><textarea name="description" value={data.profile.description} onChange={handleProfileChange} className="w-full bg-black border border-white/20 p-2 rounded text-white h-24" /></div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Upload New Avatar Image (Use image without background)</label>
              <div className="flex gap-4 items-center">
                <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} className="bg-black border border-white/20 p-2 rounded text-white" />
                {data.profile.avatarUrl && <img src={data.profile.avatarUrl} alt="Preview" className="h-12 w-12 rounded-full object-cover border border-white/20" />}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-white/5 p-8 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-400">Skills</h2>
            <button onClick={() => addArrayItem('skills', {icon: 'fa-solid fa-code', title: 'New Skill', desc: 'Description'})} className="px-4 py-1 bg-white/10 rounded hover:bg-white/20">+ Add</button>
          </div>
          <div className="space-y-4">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex gap-4 items-center bg-black p-4 rounded border border-white/10">
                <input type="text" value={skill.icon} onChange={(e) => handleArrayChange('skills', index, 'icon', e.target.value)} className="w-1/4 bg-transparent border-b border-white/20 p-1" placeholder="FontAwesome Icon" />
                <input type="text" value={skill.title} onChange={(e) => handleArrayChange('skills', index, 'title', e.target.value)} className="w-1/3 bg-transparent border-b border-white/20 p-1" placeholder="Title" />
                <input type="text" value={skill.desc} onChange={(e) => handleArrayChange('skills', index, 'desc', e.target.value)} className="w-1/3 bg-transparent border-b border-white/20 p-1" placeholder="Description" />
                <button onClick={() => removeArrayItem('skills', index)} className="text-red-500 hover:text-red-400 font-bold">X</button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 bg-white/5 p-8 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-400">Projects (My Work)</h2>
            <button onClick={() => addArrayItem('projects', {title: 'New Project', description: 'Desc', icon: 'fa-solid fa-code', themeColor: 'white', hexColor: '#ffffff', colSpan: 'md:col-span-1', rowSpan: ''})} className="px-4 py-1 bg-white/10 rounded hover:bg-white/20">+ Add</button>
          </div>
          <div className="space-y-4">
            {data.projects.map((proj, index) => (
              <div key={index} className="flex flex-col gap-2 bg-black p-4 rounded border border-white/10">
                <div className="flex justify-between items-center"><h3 className="font-bold text-lg text-white">{proj.title}</h3><button onClick={() => removeArrayItem('projects', index)} className="text-red-500 hover:text-red-400 text-sm">Remove Project</button></div>
                <input type="text" value={proj.title} onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)} className="w-full bg-transparent border-b border-white/20 p-1 mt-2" placeholder="Project Title" />
                <input type="text" value={proj.description} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} className="w-full bg-transparent border-b border-white/20 p-1" placeholder="Description" />
                <div className="flex gap-4 mt-2">
                  <input type="text" value={proj.icon} onChange={(e) => handleArrayChange('projects', index, 'icon', e.target.value)} className="w-1/2 bg-transparent border-b border-white/20 p-1" placeholder="FA Icon (e.g. fa-brands fa-chrome)" />
                  <input type="text" value={proj.hexColor} onChange={(e) => handleArrayChange('projects', index, 'hexColor', e.target.value)} className="w-1/2 bg-transparent border-b border-white/20 p-1" placeholder="Hover Color (Hex: #3b82f6)" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 bg-white/5 p-8 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-pink-400">Social Links (Let's Talk)</h2>
            <button onClick={() => addArrayItem('socials', {platform: 'New Platform', icon: 'fab fa-twitter', color: 'text-white', link: 'https://'})} className="px-4 py-1 bg-white/10 rounded hover:bg-white/20">+ Add</button>
          </div>
          <div className="space-y-4">
            {data.socials.map((social, index) => (
              <div key={index} className="flex gap-4 items-center bg-black p-4 rounded border border-white/10">
                <input type="text" value={social.platform} onChange={(e) => handleArrayChange('socials', index, 'platform', e.target.value)} className="w-1/4 bg-transparent border-b border-white/20 p-1" placeholder="Platform" />
                <input type="text" value={social.icon} onChange={(e) => handleArrayChange('socials', index, 'icon', e.target.value)} className="w-1/4 bg-transparent border-b border-white/20 p-1" placeholder="FontAwesome Icon" />
                <input type="text" value={social.link} onChange={(e) => handleArrayChange('socials', index, 'link', e.target.value)} className="w-2/4 bg-transparent border-b border-white/20 p-1" placeholder="Profile URL / Link" />
                <button onClick={() => removeArrayItem('socials', index)} className="text-red-500 hover:text-red-400 font-bold">X</button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 bg-white/5 p-8 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-400">Feedback Inbox</h2>
          </div>
          <div className="space-y-4">
            {feedbackList.length === 0 ? (
              <p className="text-gray-400 italic">No feedback received yet.</p>
            ) : (
              feedbackList.slice().reverse().map((fb, index) => (
                <div key={index} className="bg-black p-6 rounded-xl border border-white/10 relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{fb.name}</h3>
                      <a href={`mailto:${fb.email}`} className="text-sm text-blue-400 hover:underline">{fb.email}</a>
                    </div>
                    <div className="flex gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fa-star ${i < fb.rating ? 'fa-solid' : 'fa-regular'}`}></i>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 italic mb-2">"{fb.message}"</p>
                  <p className="text-xs text-gray-500">{new Date(fb.date).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Admin;
