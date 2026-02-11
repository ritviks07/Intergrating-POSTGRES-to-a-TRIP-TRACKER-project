import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"world",
  password:"ritvik123",
  port:5432,
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let countries = []; 

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries;");
  console.log(result.rows)
  result.rows.forEach((cont) => {countries.push(cont.country_code);});
  res.render("index.ejs",{total:result.rowCount,countries:countries,error:null});
});

app.post("/add", async (req,res) => {
  var code = await db.query(`SELECT country_code FROM countries where country_name = '${req.body.country}'`);
  code.rows.forEach((cont) => {
    if (countries.includes(cont.country_code)) {
      res.render("index.ejs",{total:countries.length,countries:countries,error:"Country Already Exists !!"});
    } else {
      countries.push(cont.country_code);
      res.render("index.ejs",{total:countries.length,countries:countries});
      db.query("INSERT INTO visited_countries (country_code) VALUES ($1)",[cont.country_code]);
    }
  });
  //res.render("index.ejs",{total:countries.length,countries:countries});
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
