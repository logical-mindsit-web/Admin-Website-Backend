import OneModeModel from "../Models/History.js";

// get history 
export const getModeRobotId = async (req, res) => {
  try {
    const userId = req.user.id;
    const { robotId } = req.query;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found." });
    }
    if (!robotId) {
      return res.status(400).json({ message: "Missing robotId parameter." });
    }

    const modes = await OneModeModel.find({ robotId });

    if (modes.length === 0) {
      return res.status(404).json({ message: `No modes found for robotId "${robotId}".` });
    }

    return res.status(200).json({ message: "Modes retrieved successfully.", data: modes });

  } catch (error) {
    console.error("Error retrieving modes:", error);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const getAllModes = async (req, res) => {
  try {
    // Fetch all modes from the database, selecting only the necessary fields
    const modes = await OneModeModel.find().select("emailId robotId mode map_name status date");

    if (modes.length === 0) {
      return res.status(404).json({ message: "No modes found in the database." });
    }

    return res.status(200).json({
      message: "All modes retrieved successfully.",
      data: modes,
    });
  } catch (error) {
    console.error("Error retrieving all modes:", error);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};
