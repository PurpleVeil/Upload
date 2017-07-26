/**
 * The file to start a server
 *
 */

var Express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var path =require('path');
var app = Express();
var fs = require("fs");
var unzip = require("unzip2");
app.use(bodyParser.json());
app.use(Express.static(path.join(__dirname, 'Images')));
app.use(Express.static(path.join(__dirname, 'zip')));
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
		if (url.substring(url.length-3,url.length)!="zip")
        res.send("<a href="+url+">" +url+ "</a >");
		else {
            function deleteall(path) {
                var files = [];
                if (fs.existsSync(path)) {
                    files = fs.readdirSync(path);
                    files.forEach(function (file, index) {
                        var curPath = path + "/" + file;
                        if (fs.statSync(curPath).isDirectory()) { // recurse
                            deleteall(curPath);
                        } else { // delete file
                            fs.unlinkSync(curPath);
                        }
                    });
                    fs.rmdirSync(path);
                }
                // clean zip dir
                deleteall("./zip")
                var extract = unzip.Extract({path: './zip'});
                extract.on('error', function (err) {
                    console.log("error++++++++++++++++++++++");
                    console.log(err);
                    //解压异常处理
                });
                extract.on('finish', function () {
                    console.log("解压完成!!");
                    //解压完成处理
                });
                fs.createReadStream("./Images/" + url).pipe(extract);
            }
var path1="";
            function explorer(path) {
                fs.readdir(path, function (err, files) {
                    //err 为错误 , files 文件名列表包含文件夹与文件
                    if (err) {
                        console.log('error:\n' + err);
                        return;
                    }
                    files.forEach(function (file) {

                        fs.stat(path + '/' + file, function (err, stat) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            if (stat.isDirectory()) {
                                // 如果是文件夹遍历
                                explorer(path + '/' + file);
                            } else {
                                // 读出所有的文件
                                console.log(path.substring(5,path.length));
                                if (path.substring(5,path.length)!="/__MACOSX")
                                path1=path1+"<a href="+path.substring(5,path.length) + '/' + file+">" +
                                    path.substring(5,path.length) + '/' + file+ "</a >"+"\n";
                                //console.log(path1)
                            }
                        });

                    });
                });
            }

            var interval = setInterval(function () {
                explorer("./zip")
                //console.log(path1)
               // res.send(path1)
                clearInterval(interval);
            }, 2000);
            var interval1 = setInterval(function () {
                res.send(path1)
                clearInterval(interval1);
            }, 2500);

        }
    });
});
const http = require('http'); 　//实例化“http”

const hostname = '127.0.0.1';
const port = 3000;
app.listen(port, hostname, function () {
	  console.log('app listening on port 3000!')
	})

module.exports = app;