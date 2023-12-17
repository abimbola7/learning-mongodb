const express  = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

//init app and middleware
const app = express();
app.use(express.json())

//  db connection
let db;
connectToDb((err)=> {
  if (!err){
    app.listen(3001, () =>{
      console.log("app listening on port 3001")
    })
    db = getDb();
  }
})





//routes
app.get('/books', (req, res) => {

  const page = req.query.p || "0";
  const booksPerPage = 3;



  let books = []
  db.collection('books')
    .find()
    .sort({ author : 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book => books.push(book))
    .then(()=>{
      res.status(200).json(books)
    })
    .catch((err)=>{
      res.status(500).json({ error : "Could not fetch data" })
    })
  // res.json({mssg : "Welcome to the api" })
  // connectToDb()
})

app.get('/books/:id', ( req, res )=>{
  if (ObjectId.isValid(req.params.id)) {
    db.collection('books')
    .findOne({ _id : new ObjectId(req.params.id) })
    .then((doc)=>{
      res.status(200).json(doc)
    }).catch((err)=>{
      res.status(500).json({ err : "Could not find data" })
    })
  } else {
    res.status(500).json({ error : "Not a valid doc id"})
  }
})

app.post('/books', ( req, res )=> {
  const books = req.body;
  db.collection('books').insertOne(books)
  .then((result)=>{
    res.status(200).json(result)
  })
  .catch(err=>{
    res.status(500).json({ err : "Could not create a new document" })
  })
})

app.delete('/books/:id', (req, res)=> {
  if (ObjectId.isValid(req.params.id)){
    db.collection('books')
    .deleteOne({ _id : new ObjectId(req.params.id) })
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(err=>{
      res.status(500).json({ err :  "Cannot delete data" })
    })
  } else {
    res.status(500).json({ error : "Not a valid doc id" })
  }
})

app.patch('/books/:id', (req, res)=> {
  const updates = req.body;
  if (ObjectId.isValid(req.params.id)){
    db.collection('books')
    .updateOne({ _id : new ObjectId(req.params.id) }, { $set : updates })
    .then((result) => {
      res.status(200).json(result)
    })
    .catch(err=>{
      res.status(500).json({ err :  "Cannot update document" })
    })
  } else {
    res.status(500).json({ error : "Not a valid doc id" })
  }
})