import { useState } from 'react';
import { Link } from 'react-router';


export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    // Here you would typically handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Create Account</h1>
          <p className="text-gray-300">Sign up to get started with our services</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 rounded-lg p-3 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 rounded-lg p-3 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 rounded-lg p-3 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-500 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-gray-300">
                Remember me
              </label>
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Sign Up
          </button>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}