var express = require('express');
var router = express.Router();


isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.render('index')
  }
}

/* GET home page. */
router.get('/',
  isLoggedIn,
  function(req, res, next) {
  res.redirect('/diary');
});

module.exports = router;
