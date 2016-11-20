import express from 'express';
import bodyParser from 'body-parser'
import chokidar from 'chokidar'
import fs from 'fs'
var sleep = require('sleep');

let app = express();
app.disable('x-powered-by');
let rootDir = __dirname + '/..';
app.use(bodyParser.json())
app.use(express.static(rootDir + '/public'))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index', { title: 'ejs' });
});

var mostRecentFile = ''
var data = []//JSON.parse(fs.readFileSync(mostRecentFile, 'utf8'))
chokidar.watch('./', {encoding: 'buffer'}).on('all', (event, path) => {
  if (event === 'add' && path.indexOf('.hlt') > 0) {

    if (mostRecentFile != path) {
      setTimeout(function() {
        mostRecentFile = path
        while (true) {
          try {
            data = JSON.parse(fs.readFileSync(path, 'utf8'));
            return
          } catch (e) {
            sleep.usleep(250)
          }
        }
      }, 500)
    }
  }
});

app.get('/latest', (req, res) => {
  res.json({ name: mostRecentFile, data: req.query['f'] == mostRecentFile ? null : data })
});

(function() {
  console.log('starting app');
  return app.listen(8888);
})();

export default app;