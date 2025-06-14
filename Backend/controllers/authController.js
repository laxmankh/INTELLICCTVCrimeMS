import User from "../Models/authModel.js";

export const signup = async (req, res) => {
  const { username, email, password, role } = req.body; // Added role
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Include role when creating the user
    const newUser = await User.create({ username, email, password, role }); 
    // Exclude password from the response for security, even though it's not selected by default in queries
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: "User created successfully", user: userResponse });
  } catch (error) {
    // Provide more specific error messages if possible (e.g., validation errors)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Exclude password from the response for security
    const userResponse = user.toObject();
    delete userResponse.password;

    // You might want to generate and send a JWT token here for session management
    res.status(200).json({ message: "Login successful", user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
