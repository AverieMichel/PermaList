import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let err = 404;

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Permalist',
  password: 'Averie1103',
  port: 5432,
});
db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

//display the data from the database
app.get("/", async (req, res) => {
  let items = await db.query('SELECT * FROM items ORDER BY id ASC');
  // console.log(items.rows);

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items.rows,
  });
});
//insert user's input into the database
app.post("/add", async (req, res) => {
  try {
    const item = req.body.newItem;
    items.push({ title: item });
    const newItem = await db.query('INSERT INTO items (title) VALUES ($1)', [item]);
    console.log('Data inserted successfully.');
    const data = await db.query('SELECT title FROM items');
    res.redirect('/');
  }   catch (err) {
    console.error('Error retrieving data:');
    res.redirect("/");
  }
});

app.post("/edit", async (req, res) => {
  //change the entries using update table 
  // Handle updatedItemId here (e.g., update the database)
  try {
    let editedItem = req.body['updatedItemTitle'];
    // console.log(editedItem);
  
    let editedItemID = req.body['updatedItemId'];
    // console.log(editedItemID);
    const edit = await db.query('UPDATE items SET title = ($1) WHERE id = ($2)', [editedItem, editedItemID]);
    
    let items = await db.query('SELECT id, title FROM items ORDER id, title');
    res.render('/' , {
      listItems: items.rows,
      listTitle: "Today",
    });
  } catch {
    console.error('Error retrieving data:', err);
    res.redirect("/");
  }
});


app.post("/delete", async (req, res) => {
  try {
    const toDelete = req.body['deleteItemId'];
    console.log(toDelete);
    const removeData = await db.query('DELETE FROM items WHERE id = ($1)', [toDelete]);
    const newData = await db.query('SELECT * FROM items');
    res.redirect('/', {
      listItems: items.rows,
      listTitle: "Today",
    });
  } catch {
    console.error('Error retrieving data:', err);
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
