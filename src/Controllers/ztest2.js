
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: Date, required: true },
  isAvailable: { type: Boolean, default: true },
  bookedByUser: { type: Schema.Types.ObjectId, ref: "User" },
  bookedAt: { type: Date },
  bookedUntil: { type: Date },
  blockedDates: [{ type: Date }],
  status: {
    type: String,
    enum: ['pending', 'conformed', 'rejected'], // Only allows these three values
    default: 'pending', // Default to 'pending' when a session is first created
  },
});
const BookSession = mongoose.model("DemoBooking", sessionSchema);
export default BookSession;
