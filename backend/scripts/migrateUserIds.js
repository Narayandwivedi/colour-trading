require("dotenv").config();
const { connectToDb } = require("../config/mongodb.js");
const userModel = require("../models/user.js");

async function migrateUserIds() {
  try {
    await connectToDb();
    console.log("Connected to MongoDB");

    const usersWithoutUserId = await userModel.find({ userId: { $exists: false } }).sort({ _id: 1 });
    console.log(`Found ${usersWithoutUserId.length} users without userId`);

    let counter = await userModel.findOne().sort({ userId: -1 }).select("userId").lean();
    let nextId = counter && counter.userId ? counter.userId + 1 : 10001;

    for (const user of usersWithoutUserId) {
      await userModel.updateOne({ _id: user._id }, { $set: { userId: nextId++ } });
      console.log(`Assigned userId ${nextId - 1} to ${user.email || user.fullName}`);
    }

    console.log(`Migration complete. Assigned ${usersWithoutUserId.length} userIds.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrateUserIds();
