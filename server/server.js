var express = require("express");
var cors = require("cors");
var mongo = require("mongodb");
var app = express();
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

var url = "mongodb://127.0.0.1:27017/titans_db";
var connectionOptions = {
  useNewUrlParser: true,
  useUnifieldTopology: true,
};

var user = {};
mongo.MongoClient.connect(url, connectionOptions, (err, client) => {
  if (err) {
    console.log("Can NOt Connect to Monog DB");
    return;
  }
  console.log("Connected Succesfully to Mongo DB");
  var titans_db = client.db("titans_db");

  app.post("/todo/login", (req, res) => {
    var username1 = req.body.username;
    var password1 = req.body.password;
    console.log(username1);
    console.log(password1);
    var promiseOfData = titans_db
      .collection("userBase")
      .find({ username: username1, password: password1 })
      .toArray();
    promiseOfData
      .then((result) => {
        console.log("DataAAA RAHA he Login Se");

        res.status(200);
        console.log(result);

        if (
          result[0].username == username1 &&
          result[0].password == password1
        ) {
          res.status(200).send(result);
          console.log("Found");
          user.username = result[0].username;
          userLogedIn = user.username;

          return;
        }
      })
      .catch((error) => {
        res.status(500).send("Try Again");
      });
  });

  app.post("/todo/signup", (req, res) => {
    titans_db.collection("userBase").insertOne(req.body, (err, result) => {
      if (err) {
        res.status(500).send();
        console.log("Not Created");
        return;
      }
      res.status(201).send(result);
      console.log("Sign Up Completed");
    });
  });

  // app.post("/todo/authorize", (req, res) => {
  //   if (
  //     req.body.username === "akshaycse" &&
  //     req.body.password === "Akshay@25"
  //   ) {
  //     res.status(200).send("Login Success");
  //   } else {
  //     res.status(401).send("Now Connected Loged in");
  //   }
  // });

  app.get("/todo/list", (req, res) => {
    var filterObject = {
      username: user.username,
    };
    var promiseOfData = titans_db
      .collection("todoItems")
      .find(filterObject)
      .toArray();
    promiseOfData
      .then((result) => {
        console.log("DataAAA RAHA he");

        console.log(result);
        res.status(200).send(result);
      })
      .catch((error) => {
        res.status(500).send();
      });
  });
  app.get("/todo/filter", (req, res) => {
    var filterObject = {
      username: user.username,
      isCompleted: "Pending",
    };
    var promiseOfData = titans_db
      .collection("todoItems")
      .find(filterObject)
      .toArray();
    promiseOfData
      .then((result) => {
        console.log("DataAAA RAHA he");

        console.log(result);
        res.status(200).send(result);
      })
      .catch((error) => {
        res.status(500).send();
      });
  });
  app.post("/todo/delete", (req, res) => {
    var filterObject = {
      username: userLogedIn,
      taskTitle: req.body.taskTitle,
      taskDescription: req.body.taskDescription,
    };

    titans_db.collection("todoItems").remove(filterObject, (err, result) => {
      if (err) {
        res.status(500).send();
        console.log("Not Created");
        return;
      }
      res.status(201).send(result);
    });
  });
  app.post("/todo/create", (req, res) => {
    var filterObject = {
      username: userLogedIn,
      taskTitle: req.body.taskTitle,
      taskDescription: req.body.taskDescription,
      deadline: req.body.deadline,
      isCompleted: req.body.isCompleted,
    };

    titans_db.collection("todoItems").insertOne(filterObject, (err, result) => {
      if (err) {
        res.status(500).send();
        console.log("Not Created");
        return;
      }
      res.status(201).send(result);
    });
  });

  console.log("SERVER START ");

  app.listen(3000);
});
