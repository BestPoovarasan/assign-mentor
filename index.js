const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoClient=mongodb.MongoClient;
const dotenv = require('dotenv')
dotenv.config();
const URL = process.env.DB;

//<------- middleware------------>
app.use(express.json());


// hello world
app.get('/', (req, res) => {
  res.send('Assigning Mentor and Students')
})


//Create Mentor
app.post("/mentor", async function (req, res) {
    try {
     // Open the Connection
      const connection = await mongoClient.connect(URL);
      // Select the DB
      const db = connection.db("assign");
      await db.collection("mentors").insertOne(req.body);
      await connection.close();
      res.json({
        message: "Mentor added!",
      });
    } catch (error) {
      console.log(error);
    }
  });
  
  //Create Student
  app.post("/student", async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db("assign");
      await db.collection("students").insertOne(req.body);
      await connection.close();
      res.json({
        message: "student added!",
      });
    } catch (error) {
      console.log(error);
    }
  });
  
  //Get Mentors
  app.get("/mentors", async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db("assign");
      const mentors = await db.collection("mentors").find().toArray();
      await connection.close();
      res.json(mentors);
    } catch (error) {
      console.log(error);
    }
  });
  
  //get students
  app.get("/students", async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db("assign");
      const students = await db.collection("students").find().toArray();
      await connection.close();
      res.json(students);
    } catch (error) {
      console.log(error);
    }
  });
  
  // Assign a student to Mentor
  app.put("/mentor/:id", async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db("assign");
      await db
        .collection("mentors")
        .updateOne(
          { _id: mongodb.ObjectId(req.params.id) },
          { $push: { students: mongodb.ObjectId(req.body) } }
        );
      res.json({
        message: "Updated students",
      });
    } catch (error) {
      console.log(error);
    }
  });
  
  //Assign a mentor to student
  app.put("/student/:id", async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db("assign");
      await db.collection("students").updateOne(
        { _id: mongodb.ObjectId(req.params.id) },
        { $set: { mentor: req.body } }
      );
      res.json({
        message: "Updated mentor",
      });
    } catch (error) {
      console.log(error);
    }
  });
  
  //get student for particular mentor
  app.get("/mentor/:id/assignstudents", async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db("assign");
      const mentors = await db
        .collection("mentors")
        .find(
          { _id: mongodb.ObjectId(req.params.id) },
          { name: 1, students: 1, _id: 0 }
        )
        .toArray();
      await connection.close();
      res.json(mentors);
    } catch (error) {
      console.log(error);
    }
  });
  
  //get students without mentor
  app.get("/no_mentors", async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db("assign");
      const students = await db
        .collection("students")
        .find({ mentor: undefined })
        .toArray();
      await connection.close();
      res.json(students);
    } catch (error) {
      console.log(error);
    }
  });

app.listen(process.env.PORT || 3001);