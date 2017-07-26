/**
 * The file to start a server
 *
 */

var Express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var path =require('path');
var app = Express();
app.use(bodyParser.json());
app.use(Express.static(path.join(__dirname, 'Images')));
var url;
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./Images");
    },
    filename: function (req, file, callback) {
        url=file.fieldname + "_" + Date.now() + "_" + file.originalname;
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
upload = multer({ storage: Storage }).array("imgUploader", 3); //Field name and max count
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/upload.html");
});
app.post("/", function (req, res) {
	upload(req, res, function (err) {
		if (err) {
			return res.end("Something went wrong!");
		}
        res.send("<a href="+url+">" +url+ "</a >");

    });
});
const http = require('http'); 　//实例化“http”

const hostname = '127.0.0.1';
const port = 3000;
app.listen(port, hostname, function () {
	  console.log('Revision app listening on port 3000!')
	})

module.exports = app;