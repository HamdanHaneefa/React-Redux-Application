import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken'; 



export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email.' });
    }
    
    if (password.length < 3) {
      return res.status(400).json({ error: 'Password must be at least 3 characters.' });
    }
    
    const existingUser = await User.findOne({
      $or: [
        { name: name },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      if (existingUser.name === name) {
        console.log('name exists')
        return res.status(409).json({ error: 'Username is already registered.' });
      }
      if (existingUser.email === email.toLowerCase()) {
        console.log('email exists')
        return res.status(409).json({ error: 'Email is already registered.' });
      }
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin: false,
      phoneNumber: ""
    });
    
    await newUser.save();
    
    res.status(201).json({ message: 'Signup successful!' });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};


export const login = async(req, res) => {
  const {email, password} = req.body
  if(!email || !password){
    return res.status(400).json({ error: 'Email and Password are required' });
  }

  try {
    const userData = await User.findOne({ email: email });

    if (!userData) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect Password' });
    }

    const token = jwt.sign(
      { id: userData._id, name: userData.name, email: userData.email, isAdmin: userData.isAdmin, phone:userData.phoneNumber },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: `${userData.isAdmin ? 'Admin' : 'User'} successfully logged in`,
      token,
      userDetails: userData,
      isAdmin: userData.isAdmin,
      redirectTo: userData.isAdmin ? '/admin' : '/',
    });

  
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
};


export const dashboard = async(req,res) => {
  const id = req.params.id
  if (!id || id === "null") {
    return res.status(400).json({ message: "Invalid user ID" });
  }
    
  try {
    const user = await User.findById(id).select("-password");
    if (!user || user.isAdmin) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

}


export const editProfile = async (req, res) => {
  try {
    // const { id, name, email, phoneNumber,profileImage } = req.body;
    // console.log(id, name, email, phoneNumber,profileImage)
    console.log(req.body);
    return 0

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (name && name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    if (phoneNumber) {
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(phoneNumber.replace(/[^\d]/g, ''))) {
        return res.status(400).json({ error: 'Please enter a valid phone number' });
      }
    }

    if (name) {
      const existingUser = await User.findOne({ 
        name: name, 
        _id: { $ne: id } 
      });
      
      if (existingUser) {
        return res.status(409).json({ error: 'Username is already taken' });
      }
    }


    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(name && { name }),
          ...(email && { email }),
          ...(phoneNumber && { phoneNumber }) 
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Error updating profile:', error);
 
    res.status(500).json({ error: 'Internal server error' });
  }
};

