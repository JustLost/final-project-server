const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "../",
    },
    role: {
      type: String,
      enum: ["Developer", "Project Owner", "Scrum Master"],
      required: true,
    },
    refreshToken:{type: String},
    // teams: {
    //   type: Array,
    // },
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);

module.exports = User;