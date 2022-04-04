const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const VIEWS = 'views';

const resolveView = (view) => {
  view = view.replace(/^\//, '');
  const filename = path.resolve(__dirname, '../templates', VIEWS, view);

  if (fs.existsSync(filename)) {
    const stats = fs.statSync(filename);
    const isDir = stats.isDirectory();

    if (isDir) {
      return VIEWS + '/' + view + '/index';
    }
  }

  console.log({ view, filename });
};

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render(VIEWS + '/index', {});
});

router.get('*', (req, res, next) => {
  const view = resolveView(req.path);

  console.log({ view });

  return res.render(view);

  // return res.render('views/404');
});

module.exports = router;
