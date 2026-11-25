const dns = require('node:dns');

// Use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect(
        "mongodb+srv://athulkrishnakt123_db_user:Athul123@athul.kvyjzpq.mongodb.net/"
    );
    
};

 
module.exports = connectDB
