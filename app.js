const express = require('express');
const expressNunjucks = require('express-nunjucks');
const nunjucks = require('nunjucks');

const path = require('path');
const cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');

const logger = require('morgan');

const sassMiddleware = require('node-sass-middleware');
const browserify = require('browserify-middleware');

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: true });

const indexRouter = require('./routes/index');

const app = express();
var sessionStore = new session.MemoryStore;

app.set('config', {
  "root": "",
  "env": app.get('env'),
  "project": "Bootstrap Theme",
  "version": "v1",
  "repo": "http://example.com"
});

const isDev = app.get('env') === 'development';

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/templates');

const njk = expressNunjucks(app, {
    dev: isDev,
    watch: isDev,
    noCache: false,
    trimBlocks: true,
    lstripBlocks: true,
    loader: nunjucks.FileSystemLoader
});

njk.env.addGlobal('config', app.get('config'));

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    cookie: { maxAge: 1e3 * 60 * 60 * 24 },
    store: sessionStore,
    saveUninitialized: true,
    resave: true,
    secret: "secret"
}));
app.use(flash());

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use('/assets/js/', browserify(path.join(__dirname, 'public/assets/js')));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
