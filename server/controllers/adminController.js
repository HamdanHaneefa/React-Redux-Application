import User from "../models/userModel.js"

export const getUsers = async (req,res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user || !user.isAdmin) {
          return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        const users = await User.find({isAdmin: false}).select('-password');
        return res.status(200).json({users})

    } catch (error) {
        console.log(error)
    }
}

export const addUser = async (req, res) => {
    try {
      const { name, email, mobile, profileImage } = req.body;
      
      // Validate required fields
      if (!name || !email || !mobile) {
        return res.status(400).json({ error: 'Name, email, and mobile are required fields.' });
      }
      
      // Validate email format
      if (!email.includes('@')) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }
      
      // Validate mobile number (basic check)
      if (typeof mobile !== 'string' || mobile.length < 10) {
        return res.status(400).json({ error: 'Please enter a valid mobile number (at least 10 digits).' });
      }

      const existingUser = await User.findOne({
        $or: [
          { name: name },
          { email: email.toLowerCase() },
          { mobile: mobile }
        ]
      });

      if (existingUser) {
        if (existingUser.name === name) {
          return res.status(409).json({ error: 'Username is already registered.' });
        }
        if (existingUser.email === email.toLowerCase()) {
          return res.status(409).json({ error: 'Email is already registered.' });
        }
      }
    
      const newUser = new User({
        name,
        email: email.toLowerCase(),
        password: "$2b$10$NJrkgqqFynNbj4kZOv6.XuGyVdS2tbpaDasiQLJSCk8aM3v/6LgzC",
        isAdmin: false,
        phoneNumber: mobile || ""
      });
      
      await newUser.save();
      res.status(201).json({ message: 'Signup successful!' , user: newUser });
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



export const updateUser = async (req, res) => {
    try {
      const { name, email, mobile, profileImage } = req.body;
      const { id } = req.params;
     
      if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      if (!name || !email || !mobile) {
        return res.status(400).json({ error: 'Name, email, and mobile are required fields.' });
      }
  
      if (!email.includes('@')) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }

      if (typeof mobile !== 'string' || mobile.length < 10) {
        return res.status(400).json({ error: 'Please enter a valid mobile number (at least 10 digits).' });
      }


      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            ...(name && { name }),
            ...(email && { email }),
            ...(mobile && { phoneNumber: mobile }),
            ...(profileImage !== undefined && { profileImage })
          }
        },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ 
        message: 'User updated successfully',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          mobile: updatedUser.phoneNumber,
          profileImage: updatedUser.profileImage
        }
      });
  
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findByIdAndDelete(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
