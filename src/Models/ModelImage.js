import { Schema, model } from 'mongoose';

const ModelImageSchema = new Schema({
    model: {
        type: String,
        required: true
    },
    image: {
        type: String, // To store base64 encoded image data
        required: true
    }
});

const ModelImage = model('RobotImage', ModelImageSchema);
export default ModelImage;
