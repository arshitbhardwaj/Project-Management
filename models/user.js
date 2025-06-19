const mongoose = require("mongoose")
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose")

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  joinedOn: {
    type: Date,
    default: Date.now,
  },
})

// Add passport-local-mongoose plugin (adds password field with hash and salt)
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema)
