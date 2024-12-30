import Robotmsg from "../Models/Robotmsg.js";

// Get a robot message entry by robotId
export const getRobotmsgByRobotId = async (req, res) => {
  const { robotId } = req.params;
  try {
    const robotmsgs = await Robotmsg.find({ robotId });

    if (!robotmsgs || robotmsgs.length === 0) {
      return res.status(404).json({ msg: "No robot messages found for the given Robot ID" });
    }

    res.status(200).json({
      success: true,
      data: robotmsgs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve robot message",
      error: error.message,
    });
  }
};

// Get a specific robot message entry by its ID
export const getRobotmsgById = async (req, res) => {
  const { id } = req.params; 
  try {
    const robotmsg = await Robotmsg.findById(id);

    if (!robotmsg) {
      return res.status(404).json({
        success: false,
        message: "No robot message found for the given ID",
      });
    }

    res.status(200).json({
      success: true,
      data: robotmsg,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve robot message",
      error: error.message,
    });
  }
};

// Function to delete images by message ID
export const deleteImagesByMessageId = async (req, res) => {
  try {
      const { id } = req.params;

      const updatedMessage = await Robotmsg.findByIdAndUpdate(
          id,
          { $set: { camera_images: [], resolved: true } }, 
          { new: true } 
      );

      if (!updatedMessage) {
          return res.status(404).json({ success: false, message: 'Message not found' });
      }

      res.json({ success: true, message: 'Images deleted successfully', data: updatedMessage });
  } catch (error) {
      console.error('Error deleting images:', error);
      res.status(500).json({ success: false, message: 'Failed to delete images', error: error.message });
  }
};

// Get the count of resolved and unresolved messages by robotId
export const getResolvedCountByRobotId = async (req, res) => {
  const { robotId } = req.params;

  try {
    const result = await Robotmsg.aggregate([
      { $match: { robotId } }, // Match documents with the specified robotId
      {
        $group: {
          _id: '$resolved',
          count: { $sum: 1 } // Count the number of documents for each resolved value
        }
      }
    ]);

    // Format the result to get counts for true and false
    const resolvedCounts = result.reduce((acc, doc) => {
      acc[doc._id] = doc.count;
      return acc;
    }, { true: 0, false: 0 });

    res.status(200).json({
      success: true,
      data: resolvedCounts
    });
  } catch (error) {
    console.error('Error getting resolved counts:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get resolved counts",
      error: error.message,
    });
  }
};