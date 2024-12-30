import Version from '../Models/Version.js';
import User from '../Models/User.js';

// Controller to get version and user details based on email
export const getVersionAndUserByEmail = async (req, res) => {
  const { email } = req.params; // Get the email from the request parameters

  try {
    // Get the latest app version
    const latestVersion = await Version.findOne().sort({ createdAt: -1 }); // Assuming you want the latest version

    // Find the user by email
    const user = await User.findOne({ email }, 'email manualMapping objectDisinfection'); // Fetch only the required fields

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Construct the response data
    const responseData = {
      version: latestVersion ? latestVersion.version : null,
      user: {
        email: user.email,
        manualMapping: user.manualMapping,
        objectDisinfection: user.objectDisinfection
      }
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching version and user details:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Controller to update manualMapping and objectDisinfection based on email
export const updateUserSettings = async (req, res) => {
  const { email } = req.params; // Get the email from the request parameters
  const { manualMapping, objectDisinfection } = req.body; // Get the new settings from the request body

  try {
    // Find and update the user
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { manualMapping, objectDisinfection },
      { new: true, runValidators: true } // Returns the updated document and runs validation
    );

    // Check if user was found and updated
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Construct the response data
    const responseData = {
      email: updatedUser.email,
      manualMapping: updatedUser.manualMapping,
      objectDisinfection: updatedUser.objectDisinfection
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Controller to update manualMapping and objectDisinfection for all users
export const updateUserSettingsForAll = async (req, res) => {
  const { manualMapping, objectDisinfection } = req.body; // Get the new settings from the request body

  try {
    // Update manualMapping and objectDisinfection for all users
    const result = await User.updateMany(
      {}, // Empty filter means all users
      { manualMapping, objectDisinfection }
    );

    // Check if any documents were modified
    if (result.nModified === 0) {
      return res.status(404).json({ message: 'No users were updated.' });
    }

    res.status(200).json({ message: `users updated successfully.` });
  } catch (error) {
    console.error('Error updating user settings for all users:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
