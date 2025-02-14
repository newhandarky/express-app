import express from 'express';
var indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
  res.json({ message: 'Success' });

});

export default indexRouter;
