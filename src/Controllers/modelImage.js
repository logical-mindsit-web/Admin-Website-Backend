import ModelImage from "../Models/ModelImage.js"

// Save a new model with an image
export async function saveModelImage(req, res) {
    try {
        const { model, image } = req.body;

        // Check if model and image are provided
        if (!model || !image) {
            return res.status(400).json({ message: 'Name and image are required.' });
        }

        // Create new model image entry
        const newModelImage = new ModelImage({
            model: model,
            image: image  // base64 image string
        });

        // Save the entry to the database
        await newModelImage.save();

        return res.status(201).json({ message: 'Model and image saved successfully!' });
    } catch (error) {
        return res.status(500).json({ message: 'Error saving model image', error });
    }
}

// Get model image by model name
export async function getModelImageByName(req, res) {
    try {
        const { modelName } = req.params;

        // Find the model image by name
        const modelImage = await ModelImage.findOne({ model: modelName });

        // Check if the model image exists
        if (!modelImage) {
            return res.status(404).json({ message: 'Model image not found.' });
        }

        return res.status(200).json(modelImage);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving model image', error });
    }
}

// Get all models with images
export async function getModelImages  (req, res){
    try {
        const modelImages = await ModelImage.find();  // Fetch all model data
        return res.status(200).json(modelImages);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving model images', error });
    }
};