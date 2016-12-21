var isDevelopment = process.env.NODE_ENV === 'development';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

var mainWindow = null;
var connect;

if (isDevelopment) {
  connect = require('electron-connect').client;
}

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var webApp = express();
var port = 3000;

var routes = require('./routes/index'); //Express同様に設定する。

// view engine setup
webApp.set('views', path.join(__dirname, 'views'));
webApp.set('view engine', 'ejs'); // viewエンジンは適宜変える。

webApp.use(logger('dev'));
webApp.use(bodyParser.json());
webApp.use(bodyParser.urlencoded({ extended: false }));
webApp.use(cookieParser());
webApp.use(express.static(path.join(__dirname, 'public')));

webApp.use('/', routes); //Expressと同じようにこのへんは設定する。

var server = webApp.listen(port, function () {
  console.log('app listening at http://127.0.0.1/' + port, server.address().host, server.address().port);
});


// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {

    mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    'node-integration': false
  });

  mainWindow.loadURL('http://localhost:'+ port);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

});
