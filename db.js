const { MongoClient } = require("mongodb")

let dbConnection
let uri = 'mongodb+srv://abimbola7:0nDv62fJLFTarnhH@cluster0.9antebv.mongodb.net/?retryWrites=true&w=majority'

// 'mongodb://localhost:27017/bookstore'
module.exports = {
  connectToDb : (cb) => {
    MongoClient.connect(uri)
    .then((client)=>{
      dbConnection = client.db()
      return cb()
    })
    .catch(error=>{
      console.log(error)
      return cb(error)
    })
  },
  getDb : () => dbConnection
}