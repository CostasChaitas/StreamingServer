router.post("/upload", multer({dest: "./public/uploads/"}).single("upload"), function(req, res) {
    /** When using the "single"
     data come in "req.file" regardless of the attribute "name". **/
    var tmp_path = req.file.path;
    /** The original name of the uploaded file
     stored in the variable "originalname". **/
    var target_path = 'public/uploads/' + req.file.originalname;

    /** A better way to copy the uploaded file. **/
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);

    dest.on('finish', function(){
        var ffmpeg = require('fluent-ffmpeg');

        //make sure you set the correct path to your video file
        var proc = new ffmpeg({ source: "C:\\xampp\\htdocs\\seed\\public\\uploads\\"+req.file.originalname, nolog: true });

        //Set the path to where FFmpeg is installed
        proc.setFfmpegPath("C:\\Users\\Siddharth\\Documents\\ffmpeg\\bin\\ffmpeg.exe");

        proc
        //set the size
            .withSize('50%')

            // set fps
            .withFps(24)

            // set output format to force
            .toFormat('ogv')

            // setup event handlers
            .on('end', function() {
                console.log('file has been converted successfully');
            })
            .on('error', function(err) {
                console.log('an error happened: ' + err.message);
            })
            // save to file <-- the new file I want -->
            .saveToFile("C:\\xampp\\htdocs\\seed\\public\\uploads\\"+req.file.originalname.split('.')[0]+".ogv");
        console.log('Write completed');
        return res.status(200).json({
            title: 'Success!',
            error: {
                message: 'Video Uploaded Successfully!'
            }
        });
    });
    //src.on('error', function(err) { res.render('error'); });
});
