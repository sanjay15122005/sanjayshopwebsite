const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb+srv://sanjay:sanjayvijay1976@sanjaycluster.aumoorb.mongodb.net/sanjayDB?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Connection Error:", err));

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Admin = mongoose.model("Admin", AdminSchema);

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new Admin({
    username: "admin",
    password: hashedPassword
  });

  await admin.save();
  console.log("Admin user created successfully!");
  mongoose.disconnect();
}

createAdmin();
