const mongoose = require('mongoose');

export default connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://<username>:<password>@cluster0.xmqbh.mongodb.net/<database>', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    // Continue with your application logic here
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Handle the error or retry connection if needed
  }
};
