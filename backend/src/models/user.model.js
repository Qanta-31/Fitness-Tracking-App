import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength:6,
    },

    dob: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    height: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

const User = mongoose.model('User', userSchema);

export default User;
 