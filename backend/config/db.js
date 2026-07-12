const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      // On Windows, local router/ISP DNS servers often block or refuse SRV queries (_mongodb._tcp.*).
      // Setting public DNS servers ensures mongodb+srv:// connection strings resolve reliably.
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
      } catch (dnsErr) {
        // Ignore if setting servers is not allowed by OS
      }

      const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/schedulex';
      const conn = await mongoose.connect(uri, {
        family: 4, // Force IPv4 resolution (fixes OpenSSL alert 80 on Windows)
        serverSelectionTimeoutMS: 30000, // 30s instead of 5s to allow for network/DNS latency
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      retries -= 1;
      if (retries === 0) {
        if (error.message.includes('SSL') || error.message.includes('tlsv1 alert')) {
          console.error(`\n💡 SSL/TLS Alert Troubleshooting:`);
          console.error(`1. Check MongoDB Atlas Network Access: Ensure your IP (or 0.0.0.0/0) is whitelisted.`);
          console.error(`2. Connection String: In Atlas, select 'Node.js v5.5+' driver to get the standard 'mongodb+srv://' format instead of 'mongodb://'.`);
        }
        console.error('All connection retries exhausted. Exiting process...');
        process.exit(1);
      }
      console.log(`Retrying MongoDB connection in ${delay / 1000} seconds... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectDB;
