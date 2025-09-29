import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const DB = process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connect error", err));

// 📂 đọc toàn bộ file demo.json
const data = JSON.parse(fs.readFileSync("./demo.json", "utf-8"));

// Xử lý chuyển đổi $oid và $date trong JSON (Mongo hiểu ObjectId/Date)
const parseSpecialTypes = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(parseSpecialTypes);
  } else if (obj && typeof obj === "object") {
    if (obj.$oid) return new mongoose.Types.ObjectId(obj.$oid);
    if (obj.$date) return new Date(obj.$date);
    const newObj = {};
    for (const [k, v] of Object.entries(obj)) {
      newObj[k] = parseSpecialTypes(v);
    }
    return newObj;
  }
  return obj;
};

// 🌱 import data
const importData = async () => {
  try {
    for (const [collection, docs] of Object.entries(data)) {
      if (Array.isArray(docs) && docs.length > 0) {
        const parsedDocs = parseSpecialTypes(docs);
        await mongoose.connection.collection(collection).insertMany(parsedDocs, { ordered: false });
        console.log(`✅ Imported ${docs.length} docs into ${collection}`);
      }
    }
    process.exit();
  } catch (err) {
    console.error("❌ Import error:", err);
    process.exit(1);
  }
};

// ❌ delete data
const deleteData = async () => {
  try {
    for (const collection of Object.keys(data)) {
      await mongoose.connection.collection(collection).deleteMany({});
      console.log(`🗑️ Cleared collection: ${collection}`);
    }
    process.exit();
  } catch (err) {
    console.error("❌ Delete error:", err);
    process.exit(1);
  }
};

// 📌 chạy lệnh trong terminal
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
} else {
  console.log("⚠️ Please use --import or --delete");
  process.exit();
}
