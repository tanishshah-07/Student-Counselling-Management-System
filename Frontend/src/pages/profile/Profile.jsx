import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    bloodGroup: '',
    age: '',
    education: '',
    degree: '',
    profilePicture: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || '',
        age: user.age || '',
        education: user.education || '',
        degree: user.degree || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await api.post('/upload', formData, config);
      
      setFormData(prev => ({ ...prev, profilePicture: data.image }));
      toast.success('Image uploaded successfully! Remember to click Save Profile.');
    } catch (error) {
      console.error(error);
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.put('/auth/profile', formData);
      updateUser(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your personal information</p>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row gap-6 items-center border-b border-border pb-6">
            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-primary/20">
              {formData.profilePicture ? (
                <img src={`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${formData.profilePicture}`} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl text-muted-foreground uppercase">{formData.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-medium text-foreground">Profile Picture</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
              {uploading && <p className="text-xs text-primary">Uploading image...</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Blood Group</label>
              <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="e.g. O+" className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Education (University/School)</label>
              <input type="text" name="education" value={formData.education} onChange={handleChange} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Degree / Specialization</label>
              <input type="text" name="degree" value={formData.degree} onChange={handleChange} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading || uploading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
