require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Connected to MongoDB Atlas");
  process.exit(0);
})
.catch(err => {
  console.error("❌ Connection failed:", err.message);
  process.exit(1);
});