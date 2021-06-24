/*
  todo.js -- Router for the ToDoList
*/
const express = require('express');
const router = express.Router();
const Diary = require('../models/Diary')


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
         photo:req.body.photo,
         location:req.body.location,
         comments:req.body.comments,
         userId: req.user._id,
         identifications: req.body.identifications.split(", "),
         createdAt: new Date()
        })
      await entry.save();
      res.redirect('/diary')
});


// get the value associated to the key
router.get('/',
  isLoggedIn,
  async (req, res, next) => {
      res.locals.diary = await Diary.find({userId:req.user._id}).sort({ walkDate: -1})
      res.render('diary');
});

// get the value associated to the key
router.get('/add-entry',
  isLoggedIn,
  (req,res) => {
    res.render('add-entry')
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
