const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
var findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  strategy: {
    type: String,
    enum: ["local", "google"],
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// Define submodels for different 'pos_res' types


const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  shift: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  image: {
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }
  }
}
);






const User = mongoose.model("user", userSchema);
const Student = mongoose.model("Student", studentSchema);

module.exports = {
  Student,

  User,
};
