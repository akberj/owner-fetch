var mysql = require("mysql"),
  express = require("express"),
  cors = require("cors");
var path = require("path");

var http = require("http");

app = express();
app.use(express.json());
app.use(cors());

var server = http.createServer(app);

var con = mysql.createConnection({
  host: "localhost",
  user: "studiow2_carwash",
  password: "Carwash!!",
  database: "studiow2_CWA",
});

// con.connect(function(err) {
//   if (err) throw err;})
//   console.log("Connected!");
//   var customers = "DELETE FROM customers WHERE id = 2"
//   con.query(customers, function (err, result) {
//     if (err) throw err;
//     console.log(result);
//   });
// });

//
//
// app.get("/api/mytable/search", (req, res) =>{
// console.log(res);
//   //   con.query("SELECT * FROM mytable", function (err, result, fields) {
//   //
//   //   res.json(result);
//   // //  console.log(result)
//   //   });
// //     con.query("ALTER TABLE mytable ADD ID INT IDENTITY(1,1)", function (err, result, fields) {
// //
// //     res.send(result);
// //     console.log(result)
// //     });
// //
//  });

app.get("/api/mytable/con", (req, res) => {
  console.log(req.query);
  console.log(req.query.q);
  var query = req.query.q.substring(0, 10);
  console.log(query);
  if (req.query.q) {
    con.query(
      `SELECT * FROM carwash WHERE Name LIKE '${query}%' `,
      function (err, result, fields) {
        //  con.query(`SELECT * FROM carwash GROUP BY left('${req.query.q}',10)` , function (err, result, fields) {
        if (err) throw err;
        res.json(result);
        console.log(result);
      }
    );
  }
});

app.get("/api/mytable", (req, res) => {
  console.log(req.query);
  console.log(req.query.q);

  if (req.query.q) {
    con.query(
      `SELECT * FROM carwash WHERE Name LIKE "%${req.query.q}%" `,
      function (err, result, fields) {
        //  con.query(`SELECT * FROM carwash GROUP BY left('${req.query.q}',10)` , function (err, result, fields) {
        if (err) throw err;
        res.json(result);
        console.log(result);
      }
    );
  } else {
    // con.query("SELECT *  ,MAX(Google_Reviews), count(Name) as count, count(Google_Reviews) FROM carwash GROUP BY Name HAVING count > 0", function (err, result, fields){
    con.query(
      "SELECT * ,COUNT(id) as count FROM carwash GROUP BY left(Name,10)",
      function (err, result, fields) {
        //con.query("SELECT * FROM carwash", function (err, result, fields) {

        res.json(result);
        //  console.log(result)
      }
    );
    //     con.query("ALTER TABLE `carwash` ADD `id` INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`)", function (err, result, fields) {
    //
    //     res.send(result);
    //     console.log(result)
    //     });
    //
  }
});

app.get("/api/mytable/:id", (req, res) => {
  console.log(res.RowDataPacket);
  const id = parseInt(req.params.id);
  sql = `SELECT * FROM carwash WHERE id = ${id}`;
  con.query(sql, function (err, result, fields) {
    res.send(result[0]);
    console.log(result?.RowDataPacket);
  });
});

app.delete("/api/mytable/:id", (req, res) => {
  const id = parseInt(req.params.id);
  sql = `DELETE FROM carwash WHERE id = ${id}`;
  con.query(sql, function (err, result, fields) {
    res.json(result);
  });
});

app.patch("/api/mytable/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const Name = req.body.Name;
  const Address = req.body.Address;
  const Phone = req.body.Phone;
  const Email = req.body.Email;
  const reviews = req.body.Google_Reviews;
  console.log(req.body.Address);
  sql = `UPDATE carwash
SET Name="${Name}" , Address = "${Address}", Phone = "${Phone}" , Email = "${Email}" ,Google_Reviews = "${reviews}" WHERE id = ${id}`;
  con.query(sql, function (err, result, fields) {
    res.json(result);
  });
});

app.post("/api/mytable", (req, res) => {
  const Name = req.body.Name;
  const Address = req.body.Address;
  const Phone = req.body.Phone;
  const Email = req.body.Email;
  const reviews = req.body.Google_Reviews;
  console.log(req.body.Address);

  sql = `INSERT INTO carwash (Name, Address, Phone, Email, Google_Reviews) VALUES ("${Name}","${Address}","${Phone}","${Email}","${Google_Reviews}")`;
  con.query(sql, function (err, result, fields) {
    res.json(result);
    console.log(result);
  });
});

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen();

// server.listen();
