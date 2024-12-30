import Version from "../Models/Version.js";

// Controller to create a new app version entry
export const createAppVersion = async (req, res) => {
  const { version } = req.body;

  try {
    // Check if the version already exists
    const existingVersion = await Version.findOne({ version });

    if (existingVersion) {
      return res.status(400).json({ error: 'Version already exists' });
    }

    // Create new app version entry
    const newAppVersion = new Version({ version });
    await newAppVersion.save();

    res.status(201).json(newAppVersion);
  } catch (error) {
    console.error('Error creating app version:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to update the existing app version entry
export const updateAppVersion = async (req, res) => {
  const { version } = req.body; // New version data

  try {
    // Find the existing version entry (assuming there is only one)
    const existingVersion = await Version.findOne();

    if (!existingVersion) {
      return res.status(404).json({ error: 'No version found' });
    }

    // Update the version
    existingVersion.version = version;
    await existingVersion.save();

    res.status(200).json(existingVersion);
  } catch (error) {
    console.error('Error updating app version:', error);
    res.status(500).json({ error: 'Server error' });
  }
};