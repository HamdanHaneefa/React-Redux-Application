import { useState } from 'react';
import { User, Settings, Phone, Bell, LogOut, Upload } from 'lucide-react';

export default function UserDashboard() {
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '',
    profileImage: null,
    notifications: true,
    darkMode: true,
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isAddingPhone, setIsAddingPhone] = useState(false);
  const [tempPhoneNumber, setTempPhoneNumber] = useState('');

  const handlePhoneNumberAdd = () => {
    setIsAddingPhone(true);
  };

  const savePhoneNumber = () => {
    if (tempPhoneNumber) {
      setUserProfile(prev => ({ ...prev, phoneNumber: tempPhoneNumber }));
      setIsAddingPhone(false);
      setTempPhoneNumber('');
    }
  };

  const handleProfileImageUpload = (e) => {
    // In a real application, you would handle file upload to a server
    // For this demo, we're just simulating having an image selected
    if (e.target.files && e.target.files[0]) {
      setUserProfile(prev => ({ 
        ...prev, 
        profileImage: 'uploaded' 
      }));
    }
  };

  const handleToggleChange = (setting) => {
    setUserProfile(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleLogout = () => {
    console.log('User logged out');
    // Here you would handle actual logout functionality
  };

  const renderProfileContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          {userProfile.profileImage ? (
            <div className="h-32 w-32 rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl">
              {userProfile.name.charAt(0)}
            </div>
          ) : (
            <div className="h-32 w-32 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
              <User size={64} />
            </div>
          )}
          <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700">
            <Upload size={16} />
            <input 
              id="profile-upload" 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleProfileImageUpload}
            />
          </label>
        </div>
      </div>
      
      <div>
        <label className="block text-gray-300 mb-2">Full Name</label>
        <input
          type="text"
          value={userProfile.name}
          onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
          className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-lg p-3 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label className="block text-gray-300 mb-2">Email Address</label>
        <input
          type="email"
          value={userProfile.email}
          onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
          className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-lg p-3 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label className="block text-gray-300 mb-2">Phone Number</label>
        {userProfile.phoneNumber ? (
          <input
            type="tel"
            value={userProfile.phoneNumber}
            onChange={(e) => setUserProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
            className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-lg p-3 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ) : isAddingPhone ? (
          <div className="flex space-x-2">
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={tempPhoneNumber}
              onChange={(e) => setTempPhoneNumber(e.target.value)}
              className="flex-grow bg-gray-700 text-gray-100 border border-gray-600 rounded-lg p-3 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={savePhoneNumber}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={handlePhoneNumberAdd}
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-3 px-4 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out flex items-center justify-center"
          >
            <Phone size={18} className="mr-2" />
            Add Phone Number
          </button>
        )}
      </div>
      
      <button
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-150 ease-in-out"
      >
        Save Changes
      </button>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-4 border-b border-gray-700">
        <div>
          <h3 className="text-gray-100 font-medium">Notifications</h3>
          <p className="text-gray-400 text-sm">Receive email notifications</p>
        </div>
        <div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={userProfile.notifications}
              onChange={() => handleToggleChange('notifications')}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>
      
      <div className="flex items-center justify-between py-4 border-b border-gray-700">
        <div>
          <h3 className="text-gray-100 font-medium">Dark Mode</h3>
          <p className="text-gray-400 text-sm">Toggle dark/light theme</p>
        </div>
        <div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={userProfile.darkMode}
              onChange={() => handleToggleChange('darkMode')}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>
      
      <div className="pt-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-gray-800 focus:ring-red-500 transition duration-150 ease-in-out flex items-center justify-center"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-indigo-400 mb-1">Welcome, {userProfile.name}!</h2>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">User Dashboard</h1>
          <p className="text-gray-300">Manage your account settings and preferences</p>
        </div>
        
        <div className="flex mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === 'profile' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <User size={18} className="mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === 'settings' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Settings size={18} className="mr-2" />
              Settings
            </button>
          </div>
        </div>
        
        <div className="bg-gray-750 rounded-lg p-6" style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }}>
          {activeTab === 'profile' ? renderProfileContent() : renderSettingsContent()}
        </div>
        
        <div className="text-center mt-8 text-gray-400 text-sm">
          © 2024 Your Company. All rights reserved.
        </div>
      </div>
    </div>
  );
}