import { useState } from 'react';
import { User, Search, X, Edit, Trash, Plus, Upload } from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      mobile: '+1 (555) 123-4567',
      profileImage: true
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      mobile: '+1 (555) 987-6543',
      profileImage: false
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      mobile: '+1 (555) 456-7890',
      profileImage: true
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState({
    name: '',
    email: '',
    mobile: '',
    profileImage: false
  });
  const [tempImage, setTempImage] = useState(false);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm)
  );

  const handleAddUser = () => {
    setCurrentUser({
      name: '',
      email: '',
      mobile: '',
      profileImage: false
    });
    setTempImage(false);
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setTempImage(user.profileImage);
    setShowEditModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = () => {
    setTempImage(true);
  };

  const saveUser = () => {
    if (showAddModal) {
      // Add new user
      const newUser = {
        ...currentUser,
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        profileImage: tempImage
      };
      setUsers([...users, newUser]);
      setShowAddModal(false);
    } else if (showEditModal) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === currentUser.id 
          ? {...currentUser, profileImage: tempImage} 
          : user
      ));
      setShowEditModal(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const UserModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-100">
            {showAddModal ? 'Add New User' : 'Edit User'}
          </h2>
          <button 
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-200"
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

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1 text-sm">Full Name</label>
            <input
              type="text"
              name="name"
              value={currentUser.name}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-lg p-2 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-1 text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              value={currentUser.email}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-lg p-2 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-1 text-sm">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={currentUser.mobile}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-lg p-2 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter mobile number"
            />
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            onClick={saveUser}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            {showAddModal ? 'Add User' : 'Save Changes'}
          </button>
          <button
            onClick={closeModal}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 px-4 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

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
            onClick={handleAddUser}
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
                  <tr key={user.id} className="hover:bg-gray-700">
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
                    <td className="py-3 px-4 text-gray-300">{user.mobile}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-400 hover:text-indigo-300 focus:outline-none"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-400 hover:text-red-300 focus:outline-none"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-400">
                    No users found matching your search.
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
      {(showAddModal || showEditModal) && <UserModal />}
    </div>
  );
}