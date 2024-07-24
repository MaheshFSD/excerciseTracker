const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const connectToDB = require('./config');
const User = require('./models/user.model');
const Excercise = require('./models/excercise.model');

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

// Add excercise details of a user
app.post('/api/users/:_id/exercises', async (req,res) => {
  console.log(req.body, req.body[':_id'],req.params._id, ' ------------- body ----');
  const {duration, date, description} = req.body;
  const id = req.params._id;
  // validate whether the user is there or not and 
  try {
      const user = await User.findOne({_id: id});
      // console.log(user, ' ------- user');
      if(!user) res.send('User not found.')
      else {
        const excercise = new Excercise({
          username: user.username,
          description: description,
          duration: duration,
          date: date? new Date(date): new Date(),
          userId: id
        })
        const doc = await excercise.save();
        console.log(doc, ' --------- inserted doc =------- ');
        res.json({
          username: doc.username,
          description: doc.description,
          duration: doc.duration,
          date: new Date(doc.date).toDateString(),
          _id: user._id
        })
      }
  } catch (error) {
    console.log(error);
  }
})

// route to get all the users
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  if(!users) res.send('No users')
  else res.json(users);
})

// creating a get route for getting the logs of a user
app.get('/api/users/:_id/logs', async (req,res)=> {
  const id = req.params._id;
  const {from, to, limit} = req.query;
  if(id) {
    const user = await User.findOne({_id: id})
    if(!user) res.send('No user found for the id');
    else{
      const dateFilter = {}
      const filter = {userId: id}
      if(from) dateFilter.$gte = new Date(from);
      if(to) dateFilter.$lte = new Date(to);
      if(from || to) filter.date = dateFilter;

      try {
        const excersises = await Excercise.find(filter).limit(+limit ?? 100);
        if(!excersises) res.send('You havenot started working out');
        else {
          const log = excersises.map(e => ({
            description: e.description,
            duration: e.duration,
            date: e.date.toDateString()
          }))
          res.json({
            username: user._id,
            count: excersises.length,
            _id: user._id,
            log
          })
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  else console.log('Id is required here....');
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
