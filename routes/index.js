var express = require('express');
var router = express.Router();
var fs = require("fs");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index.ejs');
});

router.get('/video', (req, res) => {

   const movieFile = `movie.mp4`;
   fs.stat(movieFile, (err, stats) => {
     if (err) {
       console.log(err);
       return res.status(404).end('<h1>Movie Not found</h1>');
     }

     const { range } = req.headers;
     const { size } = stats;
     const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
     var end = size - 1;
     var chunkSize = (end - start) + 1;
      // poor hack to send smaller chunks to the browser
      var maxChunk = 1024 * 1024; // 1MB at a time
      if (chunkSize > maxChunk) {
        end = start + maxChunk - 1;
        chunkSize = (end - start) + 1;
      }

     res.set({
       'Content-Range': `bytes ${start}-${end}/${size}`,
       'Accept-Ranges': 'bytes',
       'Content-Length': chunkSize,
       'Content-Type': 'video/mp4'
     });

     res.status(206);

     const stream = fs.createReadStream(movieFile, { start, end });
     stream.on('open', () => stream.pipe(res));
     stream.on('error', (streamErr) => res.end(streamErr));

   });
});


module.exports = router;
