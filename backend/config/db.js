const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dbconnection = async () => {
  try {
    await mongoose.connect('mongodb://muhizi:1234@ac-2btlcjy-shard-00-00.obkm4b5.mongodb.net:27017,ac-2btlcjy-shard-00-01.obkm4b5.mongodb.net:27017,ac-2btlcjy-shard-00-02.obkm4b5.mongodb.net:27017/busTicketDB?ssl=true&replicaSet=atlas-5d8jua-shard-0&authSource=admin&appName=Cluster0')
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }   
}
    module.exports = dbconnection;