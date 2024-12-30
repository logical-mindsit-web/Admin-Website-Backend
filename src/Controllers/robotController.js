import RobotController from "../Models/RobotController.js";
import bcrypt from "bcrypt";

// create RobotController 
export const createRobotController = async (req, res) => {
  const { name, employeeId, email, password, role } = req.body;

  try {
    let user = await RobotController.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "RobotController already exists" });
    }

    const newUser = new RobotController({
      name,
      employeeId,
      email,
      password: await bcrypt.hash(password, 10),
      isFirstTime: true,
      role: role 
    });
    user = await newUser.save();

    return res.json({
      message: "RobotController registered successfully.",
      isFirstTime: true,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return res.status(500).json({ message: "Registration failed. Please try again.",error: error.message });
  }
};
