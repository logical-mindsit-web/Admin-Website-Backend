import RobotAnalytics from "../Models/RobotAnalytics.js";

// Controller function to save robot analytics data
export const saveRobotAnalytics = async (req, res) => {
  try {
    const {
      robotId,
      emailId,
      model,
      batteryPercentage,
      motordistanceCovered,
      analytics: {
        batteryRunningTime: { startingTime: batteryStartTime, endingTime: batteryEndTime },
        motorRunningTime: { startingTime: motorStartTime, endingTime: motorEndTime },
        uvLightRunningTime: { startingTime: uvLightStartTime, endingTime: uvLightEndTime },
      },
      detectionDetails,
    } = req.body;

    // Create a new instance of RobotAnalytics
    const robotAnalytics = new RobotAnalytics({
      robotId,
      emailId,
      model,
      batteryPercentage,
      motordistanceCovered,
      analytics: {
        batteryRunningTime: {
          startingTime: batteryStartTime,
          endingTime: batteryEndTime
        },
        motorRunningTime: {
          startingTime: motorStartTime,
          endingTime: motorEndTime
        },
        uvLightRunningTime: {
          startingTime: uvLightStartTime,
          endingTime: uvLightEndTime
        },
      },
      detectionDetails,
    });

    // Save the robot analytics data to the database
    await robotAnalytics.save();

    return res.json({ message: "Robot analytics saved successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

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

    // Reformat the data: move details first and analytics after
    const formattedData = robotAnalyticsData.map((item) => ({
      _id: item._id,
      robotId: item.robotId,
      emailId: item.emailId,
      model: item.model,
      batteryPercentage: item.batteryPercentage,
      motordistanceCovered: item.motordistanceCovered,
      date: item.date,
      analytics: item.analytics, // Analytics object comes after the main details
      detectionDetails:item. detectionDetails,
    }));
    // Return the fetched data as JSON response
    return res.json({
      message: "Robot analytics retrieved successfully.",
      data: formattedData,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
