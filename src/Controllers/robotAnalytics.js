// Import the RobotAnalytics model
import RobotAnalytics from "../Models/RobotAnalytics.js";

// Controller function to get robot analytics data by email
export const getRobotAnalyticsByEmail = async (req, res) => {
  try {
    // Extract emailId from request parameters
    const { emailId } = req.params;

    // Fetch robot analytics data filtered by emailId from the database
    const robotAnalyticsData = await RobotAnalytics.find({ emailId });

    if (robotAnalyticsData.length === 0) {
      return res.status(404).json({
        message: "No robot analytics found for the given email.",
      });
    }

    // Reformat the data: structure it based on the updated schema
    const formattedData = robotAnalyticsData.map((item) => ({
      _id: item._id,
      robotId: item.robotId,
      emailId: item.emailId,
      model: item.model,
      date: item.date,
      mode: item.mode,
      status: item.status,
      disinfectionStartTime: item.disinfectionStartTime,
      disinfectionEndTime: item.disinfectionEndTime,
      disinfectionTimeTakenSeconds: item.disinfectionTimeTakenSeconds,
      batteryUsageInPercentage: item.batteryUsageInPercentage,
      uvLightUsageInSeconds: item.uvLightUsageInSeconds,
      motorRuntimeInSeconds: item.motorRuntimeInSeconds,
      distanceTravelledInMeters: item.distanceTravelledInMeters,
      uvLightTimes: item.uvLightTimes,
      motionDetectionTimes: item.motionDetectionTimes,
      objectDetection: item.objectDetection,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    // Return the fetched and formatted data as JSON response
    return res.json({
      message: "Robot analytics retrieved successfully.",
      data: formattedData,
    });
  } catch (error) {
    // Handle errors and return appropriate error response
    return res.status(500).json({ error: error.message });
  }
};
