import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { jwtVerify } from 'jose';
import { setUsers } from '../redux-toolkit/userReducer';
import axios from 'axios';

export default function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [errors, setErrors] = useState({});
  
  const { name, email, phoneNumber, id ,profileImage} = useSelector((state) => state.user.currentUser);
 
  const [userProfile, setUserProfile] = useState({
    name: name || '',
    email: email || '',
    phoneNumber: phoneNumber || '',
    id: id || ''
  });
  
  const [tempPhoneNumber, setTempPhoneNumber] = useState('');
  const [editingPhone, setEditingPhone] = useState(false);
  
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Verify JWT token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      console.log(profileImage)
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const secretKey = import.meta.env.VITE_SECRET_KEY;
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(secretKey)
        );

        if(payload.isAdmin){
          navigate('/admin');
          return;
        }

        const userId = payload.id;

        const response = await axios.get(`http://localhost:3000/dashboard/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },  
        });
      
        dispatch(setUsers(response.data));    
        setAuthError(null);
      } catch (err) {
        console.error("JWT verification failed:", err);
        setAuthError('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [dispatch, navigate]);

  // Update local state when Redux state changes
  useEffect(() => {
    setUserProfile(prev => ({
      ...prev,
      name: name || prev.name,
      email: email || prev.email,
      phoneNumber: phoneNumber || prev.phoneNumber,
      profileImage: profileImage || prev.profileImage,
      id: id || prev.id
    }));
    
    // Set editingPhone to true only if there's no phone number
    setEditingPhone(!phoneNumber);
  }, [name, email, phoneNumber, id]);

  // Input validation
  const validatePhoneNumber = (number) => {
    if (!number) return true; 
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(number.replace(/[^\d]/g, ''));
  };

  const validateName = (name) => {
    return name && name.trim().length >= 2;
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
  
    if (!validTypes.includes(file.type)) {
      showToast('Please upload a valid image (JPEG, PNG, GIF)', 'error');
      return;
    }
  
    if (file.size > maxSize) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }
  
    // Create a preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    
    setUserProfile(prev => ({
      ...prev, 
      profileImageFile: file,
      profileImage: previewUrl
    }));
  };


  const handleSavePhone = () => {
    // Clear previous errors
    setErrors(prev => ({ ...prev, phoneNumber: null }));
    
    // Validate phone number
    if (!validatePhoneNumber(tempPhoneNumber)) {
      setErrors(prev => ({ ...prev, phoneNumber: 'Please enter a valid phone number' }));
      return;
    }
    
    setUserProfile((prev) => ({ 
      ...prev, 
      phoneNumber: tempPhoneNumber 
    }));
    setTempPhoneNumber('');
    setEditingPhone(false);
    showToast('Phone number updated successfully');
  };

  const handleSaveChanges = async () => {
    // Reset errors
    setErrors({});
    
    // Validate inputs
    let hasErrors = false;
    const newErrors = {};
    
    if (!userProfile.id) {
      showToast('User ID is missing', 'error');
      return;
    }
    
    if (!validateName(userProfile.name)) {
      newErrors.name = 'Name must be at least 2 characters';
      hasErrors = true;
    }
    
    if (!validatePhoneNumber(userProfile.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
      hasErrors = true;
    }
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
  
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('id', userProfile.id);
      formData.append('name', userProfile.name);
      formData.append('email', userProfile.email);
      formData.append('phoneNumber', userProfile.phoneNumber);
     
      if (userProfile.profileImageFile) {
        formData.append('profileImage', userProfile.profileImageFile);
      }
 
       const response = await axios.post(
      'http://localhost:3000/edit',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', 
        },
      }
    );
      // Update Redux store with new user data
      if (response.data.user) {
        dispatch(setUsers(response.data.user));
        
        // If there's a new image in the response, update the preview
        if (response.data.user.profileImageUrl) {
          setUserProfile(prev => ({
            ...prev,
            profileImage: response.data.user.profileImageUrl,
            profileImageFile: null // Clear the file after successful upload
          }));
        }
      }
      
      showToast('Profile changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      
      if (error.response && error.response.data && error.response.data.error) {
        showToast(error.response.data.error, 'error');
      } else {
        showToast('Failed to save changes. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500 h-12 w-12" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg max-w-md text-center">
          <p className="text-red-500 mb-4">{authError}</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div 
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-down z-50 ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.type === 'success' ? 
            <CheckCircle className="text-white" size={20} /> : 
            <AlertCircle className="text-white" size={20} />
          }
          <span className="text-white font-medium">{toast.message}</span>
        </div>
      )}
      
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-indigo-400 mb-1">
            Welcome, {userProfile.name || 'User'}!
          </h2>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">User Dashboard</h1>
          <p className="text-gray-300">Manage your account settings and preferences</p>
        </div>

        <div className="bg-gray-750 rounded-lg p-6 bg-opacity-50">
          {/* Profile Image */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              {userProfile.profileImage ? (
                <img
                src={
                  userProfile.profileImage?.startsWith('blob:')
                    ? userProfile.profileImage
                    : `http://localhost:3000/${userProfile.profileImage}`
                }
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border-2 border-indigo-500"
              />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-gray-600">
                  <User size={64} />
                </div>
              )}
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                title="Upload profile picture"
              >
                <Upload size={16} className="text-white" />
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

          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) =>
                setUserProfile((prev) => ({ ...prev, name: e.target.value }))
              }
              className={`w-full bg-gray-700 text-gray-100 border ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              } rounded-lg p-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={userProfile.email}
              onChange={(e) =>
                setUserProfile((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-lg p-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              disabled // Typically email shouldn't be editable
            />
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Phone Number</label>
            {editingPhone ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={tempPhoneNumber}
                    onChange={(e) => setTempPhoneNumber(e.target.value)}
                    className={`flex-grow bg-gray-700 text-gray-100 border ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg p-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition`}
                  />
                  <button
                    onClick={handleSavePhone}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                    disabled={!tempPhoneNumber}
                  >
                    Save
                  </button>
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                <span className="text-gray-100">
                  {userProfile.phoneNumber || 'Not provided'}
                </span>
                <button
                  onClick={() => {
                    setTempPhoneNumber(userProfile.phoneNumber || '');
                    setEditingPhone(true);
                  }}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Save Changes Button */}
          <button
            onClick={handleSaveChanges}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>

        <div className="text-center mt-8 text-gray-400 text-sm">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </div>
  );
}