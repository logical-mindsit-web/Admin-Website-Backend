import Booking from "../Models/BookSessionModel.js";
import moment from "moment";
import { bookingEmail, notifyTeam , sendConfirmationEmail, sendRejectionEmail } from "../utils/bookingEmail.js";

const isSunday = (date) => moment(date).day() === 0;

const addWorkingDays = (startDate, days) => {
  let newDate = moment(startDate).clone();
  let addedDays = 0;
  while (addedDays < Math.abs(days)) {
    newDate.add(days > 0 ? 1 : -1, "days");
    if (!isSunday(newDate)) addedDays++;
  }
  return newDate;
};

const getBlockedDatesForCustomer = (bookingDate) => {
  const customerBlockedDates = [];
  let tempDate = moment.utc(bookingDate);

  customerBlockedDates.push(tempDate.format("YYYY-MM-DD"));

  let pastCount = 0;
  while (pastCount < 4) {
    tempDate = addWorkingDays(tempDate, -1);
    if (!customerBlockedDates.includes(tempDate.format("YYYY-MM-DD"))) {
      customerBlockedDates.push(tempDate.format("YYYY-MM-DD"));
      pastCount++;
    }
  }

  tempDate = moment.utc(bookingDate);

  for (let i = 0; i < 4; i++) {
    tempDate = addWorkingDays(tempDate, 1);
    customerBlockedDates.push(tempDate.format("YYYY-MM-DD"));
  }

  return customerBlockedDates;
};

export const bookSession = async (req, res) => {
  try {
    const { name, email, mobileNumber, companyName, address, bookedDate } =
      req.body;

    const bookingDate = moment.utc(bookedDate, "YYYY-MM-DD").startOf("day");

    if (!bookingDate.isValid()) {
      return res.status(400).json({ message: "Invalid booking date format." });
    }

    if (isSunday(bookingDate)) {
      return res
        .status(400)
        .json({ message: "Booking only Monday to Saturday available." });
    }

    const nextBlockedDates = [];
    let tempDate = moment.utc().startOf("day");
    for (let i = 0; i < 4; i++) {
      tempDate = addWorkingDays(tempDate, 1);
      nextBlockedDates.push(tempDate.format("YYYY-MM-DD"));
    }

    if (nextBlockedDates.includes(bookingDate.format("YYYY-MM-DD"))) {
      return res
        .status(400)
        .json({ message: "Booking is not allowed for the selected date." });
    }

    const customerBlockedDates = getBlockedDatesForCustomer(bookingDate);

    const newBooking = new Booking({
      customer: {
        name,
        email,
        mobileNumber,
        companyName,
        address,
        bookedDate: bookingDate.toDate(),
        customerBlockedDates: customerBlockedDates.map((date) =>
          moment.utc(date).toDate()
        ),
      },
    });

    await newBooking.save();

    // Send booking email to customer
    await bookingEmail(email, bookedDate, name);

    // Notify office team members
    await notifyTeam(name, companyName, bookedDate);

    return res
      .status(200)
      .json({ message: "Booking successful.", booking: newBooking });
  } catch (error) {
    console.error("Booking Error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

export const getBlockedDates = async (req, res) => {
  try {
    const blockedDates = [];
    let currentDate = moment.utc().startOf("day");
    console.log("today currentdate is ", currentDate);

    blockedDates.push(currentDate.format("YYYY-MM-DD"));
    console.log(
      "current date added to block",
      currentDate.format("YYYY-MM-DD")
    );

    for (let i = 0; i < 4; i++) {
      currentDate = addWorkingDays(currentDate, 1);
      blockedDates.push(currentDate.format("YYYY-MM-DD"));
    }

    const existingBookings = (await Booking.find().lean()) || [];

    const allCustomerBlockedDates = existingBookings.flatMap((booking) =>
      booking.customer.customerBlockedDates.map((date) =>
        moment(date).format("YYYY-MM-DD")
      )
    );

    console.log(
      "All customer-specific blocked dates: ",
      allCustomerBlockedDates
    );

    return res.status(200).json({
      blockedDates,
      customerBlockedDates: allCustomerBlockedDates,
    });
  } catch (error) {
    console.error("Error fetching blocked dates:", error.message);
    return res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};


export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Booking.find({});
    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching all sessions",
      error: error.message,
    });
  }
};

export const getCustomerDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const session = await Booking.findById(id);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }
    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateSessionStatus = async (req, res) => {
  const { sessionId, status } = req.body;

  try {
    // Validate status value
    if (!["conformed", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedSession = await Booking.findByIdAndUpdate(
      sessionId,
      { "customer.status": status }, // Update the status field
      { new: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ message: "Session not found" });
    }

    const session = await Booking.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    // Update status in the database
    session.customer.status = status;
    await session.save();

    // Send email based on the status
    if (status === "conformed") {
      await sendConfirmationEmail(
        session.customer.email,
        session.customer.name,
        new Date(session.customer.bookedDate).toLocaleDateString("en-GB"),
        session.customer.companyName,
        session.customer.address
      );
    } else if (status === "rejected") {
      await sendRejectionEmail(
        session.customer.email,
        session.customer.name,
        new Date(session.customer.bookedDate).toLocaleDateString("en-GB")
      );
    }

    res.status(200).json({
      success: true,
      data: updatedSession,
    });
  } catch (err) {
    console.error("Error updating session status:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
