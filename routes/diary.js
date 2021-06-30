/*
  todo.js -- Router for the ToDoList
*/
const express = require('express');
const router = express.Router();
const Diary = require('../models/Diary');
const axios = require("axios");

/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* add the value in the body to the list associated to the key */
router.post('/new',
  isLoggedIn,
  async (req, res, next) => {
      const entry = new Diary(
        {walkDate:req.body.date,
         photo: req.body.photo,
         location:req.body.location,
         comments:req.body.comments,
         userId: req.user._id,
         identifications: req.body.identifications.split(", "),
         songs: req.body.songs,
         createdAt: new Date()
        })
      await entry.save();
      res.redirect('/diary')
});

router.get('/add-entry',
  isLoggedIn,
  (req,res) => {
    res.render('songs')
   });

router.post("/add-entry-2",
 async (req,res,next) => {
   try {
     const loc = req.body.location
     const url = "https://www.xeno-canto.org/api/2/recordings?query=loc:" + loc
     const result = await axios.get(url)
     res.locals.results = result.data.recordings
     res.locals.location = loc
     res.render('add-entry')
   } catch(error){
     next(error)
   }
})

// get diary for given user in reverse chronological order by walk date
router.get('/',
  isLoggedIn,
  async (req, res, next) => {
      res.locals.diary = await Diary.find({userId:req.user._id}).sort({ walkDate: -1})
      res.render('diary');
});

router.get('/:entryId',
 isLoggedIn,
 async (req, res, next) => {
     const entryId = req.params.entryId
     res.locals.entry = await Diary.findOne({_id:entryId})
     res.render('view');
});

router.get('/remove/:entryId',
  isLoggedIn,
  async (req, res, next) => {
      await Diary.remove({_id:req.params.entryId});
      res.redirect('/diary')
});

module.exports = router;
