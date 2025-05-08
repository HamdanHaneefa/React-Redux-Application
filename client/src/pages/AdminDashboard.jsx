import React, { useState, useEffect } from 'react';
import { User, Search, X, Edit, Trash, Plus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, addUser, updateUser, deleteUser } from '../redux-toolkit/adminReducer';
import { toast } from 'react-toastify';

// Extract UserModal component to prevent re-creation on parent re-render
const UserModal = ({ 
  showAddModal,
  closeModal,
  currentUser,
  tempImage,
  handleInputChange,
  handleImageChange,
  handleAddUser,
  handleUpdateUser
}) => {
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  // Use onSubmit to prevent default form behavior
  const handleSubmit = (e) => {
    e.preventDefault();
    if (showAddModal) {
      handleAddUser();
    } else {
      handleUpdateUser(currentUser._id);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md"
        onClick={stopPropagation}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-100">
            {showAddModal ? 'Add New User' : 'Edit User'}
          </h2>
          <button 
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-200"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="relative">
            {tempImage ? (
              <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                <User size={36} />
              </div>
            )}
            <label htmlFor="modal-profile-upload" className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700">
              <Upload size={14} />
              <input 
                id="modal-profile-upload" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-300 mb-1 text-sm">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={currentUser.name}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-lg p-2 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter full name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-1 text-sm">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={currentUser.email}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-lg p-2 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter email address"
              required
            />
          </div>
          
          <div>
            <label htmlFor="mobile" className="block text-gray-300 mb-1 text-sm">Mobile Number</label>
            <input
              id="mobile"
              type="tel"
              name="mobile"
              value={currentUser.mobile}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-lg p-2 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter mobile number"
              required
            />
          </div>
        
          <div className="mt-6 flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              {showAddModal ? 'Add User' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 px-4 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const users = useSelector((state) => state.admin);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState({
    name: '',
    email: '',
    mobile: '',
    profileImage: null
  });
  const [tempImage, setTempImage] = useState(false);

  // Verify JWT token on component mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },  
        });
        
        dispatch(getUsers(response.data.users));
        setAuthError(null);
      } catch (err) {
        console.error("Error:", err);
        setAuthError(err.response?.data?.message || 'Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, dispatch]);
  
    
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.mobile && user.mobile.includes(searchTerm))
  );

  // Open Add User Modal
  const openAddUserModal = () => {
    setCurrentUser({
      name: '',
      email: '',
      mobile: '',
      profileImage: false
    });
    setTempImage(false);
    setShowAddModal(true);
  };

  // Handle Add User Submission
  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const { name, email, mobile, profileImage } = currentUser;

      if (!name || !email || !mobile) {
        toast.error('Please fill all required fields');
        return;
      }
      
      const response = await axios.post('http://localhost:3000/admin/adduser', 
        {
          name,
          email,
          mobile,
          profileImage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },  
        }
      );
      console.log(response)
      if (response.status === 201) {
        dispatch(addUser(response.data.user));
        setShowAddModal(false);
        toast.success('User added successfully');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error(error.response?.data?.message || 'Failed to add user');
    }
  };

  // Handle Edit User
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setTempImage(user.profileImage);
    setShowEditModal(true);
  };

  // Handle Update User
  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.put(`http://localhost:3000/admin/update/${currentUser._id}`, 
        {
          name: currentUser.name,
          email: currentUser.email,
          mobile: currentUser.mobile,
          profileImage: tempImage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },  
        }
      );

      if (response.status === 200) {
        dispatch(updateUser(response.data.user));
        setShowEditModal(false);
        toast.success('User updated successfully');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:3000/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },  
        });

        if (response.status === 200) {
          dispatch(deleteUser(userId));
          toast.success('User deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  // Function to handle input changes with memoized callback to prevent focus loss
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = () => {
    setTempImage(!tempImage);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <div className="text-gray-300">Loading user data...</div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center">
          <div className="text-red-400 text-2xl mb-3">⚠️ Authentication Error</div>
          <div className="text-gray-300 mb-4">{authError}</div>
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col p-4 overflow-hidden">
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 w-full max-h-[90vh] overflow-y-auto flex-1">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-100">User Management</h1>
          <p className="text-gray-400 text-sm">Manage user accounts and permissions</p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>
          
          <button
            onClick={openAddUserModal}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-150 ease-in-out flex items-center justify-center"
          >
            <Plus size={18} className="mr-2" />
            Add New User
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-750 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }}>
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="py-3 px-4 text-gray-200 font-semibold">User</th>
                <th className="py-3 px-4 text-gray-200 font-semibold">Email</th>
                <th className="py-3 px-4 text-gray-200 font-semibold">Mobile</th>
                <th className="py-3 px-4 text-gray-200 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id || user._id} className="hover:bg-gray-700">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          {user.profileImage ? (
                            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
                              <User size={20} />
                            </div>
                          )}
                        </div>
                        <div className="text-gray-200">{user.name}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{user.email}</td>
                    <td className="py-3 px-4 text-gray-300">{user.phoneNumber || user.mobile || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-400 hover:text-indigo-300 focus:outline-none"
                          type="button"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-400 hover:text-red-300 focus:outline-none"
                          type="button"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <User size={40} className="text-gray-500" />
                      <div className="text-gray-400 text-lg font-medium">No users found</div>
                      {users.length === 0 ? (
                        <p className="text-gray-500 max-w-md text-center">
                          Your user list is empty. Click "Add New User" to get started.
                        </p>
                      ) : (
                        <p className="text-gray-500 max-w-md text-center">
                          No users match your search criteria. Try a different search term.
                        </p>
                      )}
                      {users.length === 0 && (
                        <button
                          onClick={openAddUserModal}
                          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-150 ease-in-out flex items-center justify-center"
                          type="button"
                        >
                          <Plus size={18} className="mr-2" />
                          Add Your First User
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="text-center mt-4 text-gray-400 text-xs">
          © 2024 Your Company. All rights reserved.
        </div>
      </div>
      
      {/* Modal for adding/editing users */}
      {(showAddModal || showEditModal) && (
        <UserModal 
          showAddModal={showAddModal}
          closeModal={closeModal}
          currentUser={currentUser}
          tempImage={tempImage}
          handleInputChange={handleInputChange}
          handleImageChange={handleImageChange}
          handleAddUser={handleAddUser}
          handleUpdateUser={handleUpdateUser}
        />
      )}
    </div>
  );
}

export { AdminDashboard }