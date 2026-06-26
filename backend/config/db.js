const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Force IPv4 resolution (fixes OpenSSL alert 80 on Windows)
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (error.message.includes('SSL') || error.message.includes('tlsv1 alert')) {
      console.error(`\n💡 SSL/TLS Alert Troubleshooting:`);
      console.error(`1. Check MongoDB Atlas Network Access: Ensure your IP (or 0.0.0.0/0) is whitelisted.`);
      console.error(`2. Connection String: In Atlas, select 'Node.js v5.5+' driver to get the standard 'mongodb+srv://' format instead of 'mongodb://'.`);
    }
    process.exit(1);
  }
};

module.exports = connectDB;
