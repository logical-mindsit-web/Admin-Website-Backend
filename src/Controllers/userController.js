import User from "../Models/User.js";
import bcrypt from "bcrypt";

// Function to calculate majority value for manualMapping and objectDisinfection
const calculateMajorityValue = async () => {
  const users = await User.find(); // Fetch all users from the database

  // If there are no users, return default 'disabled' values
  if (users.length === 0) {
    return {
      majorityManualMapping: "disabled",
      majorityObjectDisinfection: "disabled",
    };
  }

  // Initialize counters for manualMapping and objectDisinfection
  let manualMappingEnabledCount = 0;
  let manualMappingDisabledCount = 0;
  let objectDisinfectionEnabledCount = 0;
  let objectDisinfectionDisabledCount = 0;

  // Loop through all users and count the occurrences of each value
  users.forEach((user) => {
    if (user.manualMapping === "enabled") {
      manualMappingEnabledCount++;
    } else {
      manualMappingDisabledCount++;
    }

    if (user.objectDisinfection === "enabled") {
      objectDisinfectionEnabledCount++;
    } else {
      objectDisinfectionDisabledCount++;
    }
  });

  // Calculate the majority for manualMapping
  const majorityManualMapping =
    manualMappingEnabledCount > manualMappingDisabledCount
      ? "enabled"
      : "disabled";

  // Calculate the majority for objectDisinfection
  const majorityObjectDisinfection =
    objectDisinfectionEnabledCount > objectDisinfectionDisabledCount
      ? "enabled"
      : "disabled";

  return {
    majorityManualMapping,
    majorityObjectDisinfection,
  };
};

// Create Users function
export const createUser = async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    IPAddress,
    organizationName,
    password,
    primaryContact,
    locations,
  } = req.body;

  // Get the majority values for manualMapping and objectDisinfection
  const { majorityManualMapping, majorityObjectDisinfection } =
    await calculateMajorityValue();

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phoneNumber,
      IPAddress,
      organizationName,
      manualMapping: majorityManualMapping,
      objectDisinfection: majorityObjectDisinfection,
      password: hashedPassword,
      primaryContact,
      locations,
      isFirstTime: true,
    });

    user = await newUser.save();

    return res.json({
      message: "User registered successfully.",
      isFirstTime: true,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return res
      .status(500)
      .json({ message: "Registration failed. Please try again." });
  }
};

// get all user
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database, including all fields
    const users = await User.find({});

    // Check if users were found
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return users as they are, including all fields
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get user all details
export const getUserDetails = async (req, res) => {
  try {
    const { email } = req.params; // Extract email from route parameters

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// delete user by email id
export const deleteUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// to get all user emails only
export const getAllUserEmails = async (req, res) => {
  try {
    const users = await User.find({}).select("email");

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    const emails = users.map((user) => user.email);

    return res.json(emails);
  } catch (error) {
    console.error("Error fetching user emails:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch user emails. Please try again." });
  }
};
//update email
export const updateUserEmail = async (req, res) => {
  const { oldEmail, newEmail } = req.body;

  if (!oldEmail || !newEmail) {
    return res
      .status(400)
      .json({ message: "Both old and new email addresses are required" });
  }

  try {
    // Find the user by the old email
    const user = await User.findOne({ email: oldEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new email already exists and is not the same as the old email
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser.email !== oldEmail) {
      return res
        .status(400)
        .json({ message: "New email address already exists" });
    }

    // Update the email address
    user.email = newEmail;
    await user.save();

    return res.json({ message: "User email updated successfully" });
  } catch (error) {
    console.error("Error updating User email:", error);
    return res.status(500).json({ message: "Error updating User email" });
  }
};
// Function to get user name based on email
export const getUserNameByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Find the user by email and select only the name field
    const user = await User.findOne({ email }).select("name");

    // If no user is found, return a 404 response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user's name as a response
    return res.json({ name: user.name });
  } catch (error) {
    console.error("Error fetching user name:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch user name. Please try again." });
  }
};
// Function to get location names based on user email
export const getUserLocationNamesByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Use projection to retrieve only the location names
    const user = await User.findOne({ email }, { "locations.name": 1, _id: 0 });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Map to return only the location names
    const locationNames = user.locations.map((location) => location.name);

    return res.json({ locationNames });
  } catch (error) {
    console.error("Failed to fetch location names:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch location names. Please try again." });
  }
};
// Function to get sub-locations based on user email and location name
export const getSubLocationsByLocationName = async (req, res) => {
  const { email, locationName } = req.params;

  try {
    // Query to find the user by email and filter locations by name
    const user = await User.findOne(
      { email, "locations.name": locationName },
      { "locations.$": 1, _id: 0 } // Projection to get only the matched location with sub-locations
    );

    if (!user || !user.locations.length) {
      return res
        .status(404)
        .json({ message: "Location not found for the specified user" });
    }

    // Extract sub-locations from the matched location
    const subLocations = user.locations[0].subLocations.map(
      (subLocation) => subLocation.name
    );

    return res.json({ subLocations });
  } catch (error) {
    console.error("Failed to fetch sub-locations:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch sub-locations. Please try again." });
  }
};

// Update User function
export const updateUser = async (req, res) => {
  const { userId } = req.params; // Assuming you're using the user ID as a route parameter
  const {
    name,
    email,
    phoneNumber,
    IPAddress,
    organizationName,
    password,
    primaryContact,
    locations,
  } = req.body;

  // Validate input (you can add more validation here)
  if (
    !name ||
    !email ||
    !phoneNumber ||
    !IPAddress ||
    !organizationName ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find the user by ID
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   // Check if the new email is already taken by another user
   if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email is already taken" });
    }
  }
  
    // Hash new password if it's provided, else keep the old one
    let hashedPassword = user.password; // Default to current password
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // Hash new password if provided
    }
    // Validate locations array
    if (locations && !Array.isArray(locations)) {
      return res.status(400).json({ message: "Locations must be an array" });
    }
    // Update user details
    Object.assign(user, {
      name,
      email,
      phoneNumber,
      IPAddress,
      organizationName,
      password: hashedPassword,
      primaryContact,
      locations,
    });

    // Save updated user
    await user.save();

    return res.json({
      message: "User details updated successfully.",
      user: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        locations: user.locations,
      }, // Return updated data
    });
  } catch (error) {
    console.error("Update failed:", error);
    return res
      .status(500)
      .json({ message: "Update failed. Please try again." });
  }
};
