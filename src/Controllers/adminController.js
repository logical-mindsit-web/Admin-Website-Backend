import Admin from "../Models/Admin.js";
import bcrypt from "bcrypt";

// create Admin 
export const createAdmin = async (req, res) => {
  const { name, employeeId, email, password,phoneNumber,manualMapping,objectDisinfection, role } = req.body;

  try {
    let user = await Admin.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newUser = new Admin({
      name,
      employeeId,
      email,
      phoneNumber,
      manualMapping,
      objectDisinfection,
      role: role ,
      password: await bcrypt.hash(password, 10),
      isFirstTime: true
    });
    user = await newUser.save();

    return res.json({
      message: "Admin registered successfully.",
      isFirstTime: true,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return res.status(500).json({ message: "Registration failed. Please try again.",error: error.message });
  }
};

// get all Admin
export const getAllAdminDetails = async (req, res) => {
  try {
    // Find all admin users
    const admins = await Admin.find({});
    if (!admins) {
      return res.status(404).json({ message: "No admins found" });
    }

    // Send admin details (omit sensitive information)
    const adminDetails = admins.map(admin => ({
      id: admin._id,
      name: admin.name,
      employeeId: admin.employeeId,
      email: admin.email,
      phoneNumber:admin.phoneNumber,
      role: admin.role,
      manualMapping:admin.manualMapping,
      objectDisinfection:admin.objectDisinfection,
      isFirstTime: admin.isFirstTime,
      isOtpVerified: admin.isOtpVerified,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    }));

    res.json(adminDetails);
  } catch (error) {
    console.error('Error fetching admin details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// get Admin detail
export const getAdminDetails = async (req, res) => {
  try {
    const { email } = req.params; // Extract email from route parameters

    // Find user by email
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
 
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//update admin  email (don't delete or remove)
// export const updateAdminEmail = async (req, res) => {
//   const { oldEmail, newEmail } = req.body;

//   if (!oldEmail || !newEmail) {
//     return res.status(400).json({ message: 'Both old and new email addresses are required' });
//   }

//   try {
//     // Find the admin by the old email
//     const admin = await Admin.findOne({ email: oldEmail });
//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }

//     // Check if the new email already exists and is not the same as the old email
//     const existingAdmin = await Admin.findOne({ email: newEmail });
//     if (existingAdmin && existingAdmin.email !== oldEmail) {
//       return res.status(400).json({ message: 'New email address already exists' });
//     }

//     // Update the email address
//     admin.email = newEmail;
//     await admin.save();

//     return res.json({ message: 'Admin email updated successfully' });
//   } catch (error) {
//     console.error('Error updating admin email:', error);
//     return res.status(500).json({ message: 'Error updating admin email' });
//   }
// };

export const updateAdminDetails = async (req, res) => {
  const { 
    oldEmail, 
    newEmail, 
    newName, 
    newEmployeeId, 
    newRole, 
    newPhoneNumber, 
    manualMapping, 
    objectDisinfection 
  } = req.body;

  // Validate required fields
  if (!oldEmail || !newEmail || !newName || !newEmployeeId || !newPhoneNumber) {
    return res.status(400).json({ 
      message: 'Old email, new email, new name, new employee ID, and new phone number are all required.' 
    });
  }

  // Validate manualMapping and objectDisinfection enums if provided
  const validMappingOptions = ["enabled", "disabled"];
  if (manualMapping && !validMappingOptions.includes(manualMapping)) {
    return res.status(400).json({ message: 'Invalid value for manualMapping. Valid options are "enabled" or "disabled".' });
  }
  if (objectDisinfection && !validMappingOptions.includes(objectDisinfection)) {
    return res.status(400).json({ message: 'Invalid value for objectDisinfection. Valid options are "enabled" or "disabled".' });
  }

  try {
    // Find the admin by the old email
    const admin = await Admin.findOne({ email: oldEmail });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if the new email already exists and is not the same as the old email
    const existingAdmin = await Admin.findOne({ email: newEmail });
    if (existingAdmin && existingAdmin.email !== oldEmail) {
      return res.status(400).json({ message: 'New email address already exists' });
    }

    // Update the admin details
    admin.email = newEmail;
    admin.name = newName;
    admin.employeeId = newEmployeeId;
    admin.phoneNumber = newPhoneNumber;

    if (newRole) {
      admin.role = newRole; // Update role if provided
    }
    if (manualMapping) {
      admin.manualMapping = manualMapping; // Update manualMapping if provided
    }
    if (objectDisinfection) {
      admin.objectDisinfection = objectDisinfection; // Update objectDisinfection if provided
    }

    await admin.save();

    return res.json({ message: 'Admin details updated successfully' });
  } catch (error) {
    console.error('Error updating admin details:', error);
    return res.status(500).json({ message: 'Error updating admin details' });
  }
};


// delete admin user
export const deleteAdminByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOneAndDelete({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


