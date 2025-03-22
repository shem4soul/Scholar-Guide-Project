const mongoose = require("mongoose");

// Your ScholarGuide database connection string
const MONGO_URI = "mongodb+srv://smartresearchers82:church@nodejsexpressprojects.caj9s.mongodb.net/ScholarGuide?retryWrites=true&w=majority&appName=NodejsExpressProjects";

// Define a sample schema and model
const testSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const TestModel = mongoose.model("TestCollection", testSchema);

async function initializeDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ Connected to ScholarGuide database!");

        // Insert a test document
        const sampleData = new TestModel({
            name: "John Doe",
            email: "johndoe@example.com",
        });

        await sampleData.save();
        console.log("✅ Sample data inserted!");

        // Close the connection
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Database connection error:", error);
    }
}

// Run the function
initializeDatabase();
