import { Schema, model } from "mongoose";

const vectorSchema = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  { _id: false }
);

const orientationSchema = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
    w: { type: Number, required: true },
  },
  { _id: false }
);

const oneModeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mode: { type: String, required: true },
  emailId: { type: String, required: true },
  robotId: { type: String, required: true },
  map_name: { type: String },
  position: [vectorSchema],
  orientation: [orientationSchema],
  docking: { type: String },
  perimeter: { type: String },
  object_name: { type: String },
  total_object: { type: Number },
  completed_object: { type: Number },
  date: { type: Date, default: Date.now },
}, {
  timestamps: true,
  discriminatorKey: 'mode',
});

const OneModeModel = model("History", oneModeSchema);


export const InitializationMode = OneModeModel.discriminator("Initialization", new Schema({
    emailId:{type:String ,required:true},
    robotId:{type:String,required:true},
    position: [vectorSchema],
    orientation: [orientationSchema],
    status:{type:String,required:true},
    date: { type: Date, default: Date.now },
}));
export const ManualMappingMode = OneModeModel.discriminator("ManualMapping", new Schema({
  
    emailId:{type:String ,required:true},
    robotId:{type:String,required:true},
  
    map_name: { type: String, required: true },
    position: [vectorSchema],
    orientation: [orientationSchema],
    status:{type:String,required:true}
    
}));
export const AutoDisinfectionMode = OneModeModel.discriminator("AutoDisinfection", new Schema({
  map_name: { type: String, required: true },
  perimeter: { type: String, required: true },
  object_name: { type: String, required: true },
  total_object: { type: Number, required: true },
  completed_object: { type: Number, required: true },
  status:{type:String,required:true}
}));
export const ObjectDisinfectionMode = OneModeModel.discriminator("ObjectDisinfection", new Schema({
  map_name: { type: String, required: true },
  object_name: { type: String, required: true },
  total_object: { type: Number, required: true },
  completed_object: { type: Number, required: true },
  status:{type:String,required:true}
}));
export const AutoDockingMode = OneModeModel.discriminator("AutoDocking", new Schema({
    emailId:{type:String ,required:true},
    robotId:{type:String,required:true},
    map_name: { type: String, required: true },
    position: [vectorSchema],
    orientation: [orientationSchema],
    docking:{type:String,required:true},
    status:{type:String,required:true}
}));

export default OneModeModel;
