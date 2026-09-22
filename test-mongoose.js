const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const { ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;

console.log("URI check:");
console.log(uri.replace(/(mongodb\+srv:\/\/[^:]+:)[^@]+@/, "$1****@"));

console.log("\nMongoose version:", mongoose.version);
console.log("MongoDB driver:", require("mongodb/package.json").version);
console.log("Node version:", process.version);

mongoose
  .connect(uri, {
    family: 4,
    serverSelectionTimeoutMS: 15000,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  })
  .then(() => {
    console.log("\nMongoose connection successful! ✅");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nMongoose connection failed:");
    console.error(error.message);
    process.exit(1);
  });