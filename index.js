const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const connectToDB = require('./config');
const User = require('./models/user.model');

connectToDB(process.env.mongourl)
.then(() => console.log('DB Connection sucessfull...'))
.catch(err => console.log('Something went wrong while connecting to db...'));

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// user creation
// app.post('/api/users', async (req,res) => {
//   const insertedDoc = await User.create({username: req.body.username})
//   res.json({username: req.body.username, _id: insertedDoc['_id']});
// })

// the other way of doing this insertion is as follows 
app.post('/api/users', async (req,res) => {
  const user = new User({username: req.body.username})
  try {
    const insertedDoc = await user.save()
    res.json({username: req.body.username, _id: insertedDoc['_id']});
  } catch (error) {
    console.log(error, ' ----------- occured in insertion -----');
  }
})

// Add excercise details to a user
// app.post('/api/users/:_id/exercises', async (req,res) => {
//   const bodyData = 
// })

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
