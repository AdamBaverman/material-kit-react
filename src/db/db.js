import { connect } from 'mongoose';
// import { env } from 'node:process';

// const uri: string = env.MONGODB_URI;
const uri = 'mongodb://localhost:27017/prod';
if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const connectDB = async () => {
  try {
    await connect(uri
    //     , {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // }
);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
