import Robot from "../Models/Robot.js";

// Controller to save robot details
export const saveRobotDetails = async (req, res) => {
  try {
    const {
      robotId,
      emailId,
      username,
      model,
      serialNumber,
      IPAddress,
      image,
      status,
      location,
      subLocation,
      robotInitializeDate,
      lastMaintenanceDate,
    } = req.body;

     // Check if the model is valid
     const validModels = ['Spotbot-Lite', 'Spotbot-Xtreme'];
     if (!validModels.includes(model)) {
       return res.status(400).json({ error: "Invalid model. Please select 'Spotbot-Lite' or 'Spotbot-Xtreme'." });
     }
    // Constructing the IP Address in the required format
    const formattedIPAddress = `ws://${IPAddress}:9090`;

    const robot = new Robot({
      robotId,
      emailId,
      username,
      model,
      serialNumber,
      IPAddress: formattedIPAddress, 
      image,
      status,
      location,
      subLocation,
      robotInitializeDate,
      lastMaintenanceDate,
    });

    await robot.save();

    return res.json({ message: "Robot details saved successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get robots by email
export const getRobotsByEmail = async (req, res) => {
  try {
    const { emailId } = req.params;
    const robots = await Robot.find({ emailId });

    if (robots.length === 0) {
      return res.status(404).json({ message: "No robots found for this user" });
    }

    return res.json(robots);
  } catch (error) {
    console.error("Error fetching robots:", error);
    return res.status(500).json({ error: error.message });
  }
};

// get robots by allrobots
export const getAllRobots = async (req, res) => {
  try {
    const robots = await Robot.find();

    if (robots.length === 0) {
      return res.status(404).json({ message: "No robots found for this user" });
    }
    res.status(200).json(robots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching robots", error });
  }
};

// Controller to delete robot details by robotId
export const deleteRobotDetails = async (req, res) => {
  try {
    const { robotId } = req.params; // Get robotId from request parameters

    // Find and delete the robot by robotId
    const result = await Robot.findOneAndDelete({ robotId });

    // Check if a robot was found and deleted
    if (!result) {
      return res.status(404).json({ message: "Robot not found." });
    }

    return res.json({ message: "Robot details deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};