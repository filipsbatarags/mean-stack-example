'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  fs = require("fs"),
  rimraf = require("rimraf"),
  mkdirp = require("mkdirp"),
  multiparty = require('multiparty'),
  express = require('express'),
  morgan = require('morgan'),
  logger = require('./logger'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  favicon = require('serve-favicon'),
  compress = require('compression'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  helmet = require('helmet'),
  flash = require('connect-flash'),
  consolidate = require('consolidate'),
  path = require('path'),
  //seo = require('mean-seo'),
  MongoClient = require('mongodb').MongoClient,
  BSON = require('bson'),
  lusca = require('lusca'),
  cors_proxy = require('cors-anywhere'),
    
 fileInputName = process.env.FILE_INPUT_NAME || "qqfile",
 publicDir = process.env.PUBLIC_DIR,
 nodeModulesDir = process.env.NODE_MODULES_DIR,
 //uploadedFilesPath = process.env.UPLOADED_FILES_DIR,
 uploadedFilesPath = "modules/core/client/img/content/",
 chunkDirName = "chunks",
 port = process.env.SERVER_PORT || 8000,
 maxFileSize = process.env.MAX_FILE_SIZE || 0;




/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.keywords = config.app.keywords;
  app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
  app.locals.facebookAppId = config.facebook.clientID;
  app.locals.jsFiles = config.files.client.js;
  app.locals.cssFiles = config.files.client.css;
  app.locals.livereload = config.livereload;
  app.locals.logo = config.logo;
  app.locals.favicon = config.favicon;

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
   
  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');

  // Should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));
    
  // Initialize favicon middleware
  app.use(favicon(app.locals.favicon));

  // Enable logger (morgan)
  app.use(morgan(logger.getFormat(), logger.getOptions()));

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true,
      limit: '50mb'
  }));
  //app.use(bodyParser.json());
    
app.use(bodyParser.json({limit: '50mb'}));
    
  app.use(bodyParser({limit: '50mb'}));
  app.use(methodOverride());

  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use(flash());   
    
    //6jan2018 - fine-uploader test
    app.listen(port);

    app.use(express.static(path.resolve('./public')));
    app.use("/node_modules", express.static(path.resolve('./node_modules')));
    app.post("/uploads", onUpload);
    app.delete("/uploads/:uuid", onDeleteFile);

    function onUpload(req, res) {
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        var partIndex = fields.qqpartindex;

        // text/plain is required to ensure support for IE9 and older
        res.set("Content-Type", "text/plain");

        if (partIndex == null) {
            onSimpleUpload(fields, files[fileInputName][0], res);
        }
        else {
            onChunkedUpload(fields, files[fileInputName][0], res);
        }
    });
}

function onSimpleUpload(fields, file, res) {
    var uuid = fields.qquuid,
        responseData = {
            success: false
        };

    file.name = fields.qqfilename;

    if (isValid(file.size)) {
        moveUploadedFile(file, uuid, function() {
                responseData.success = true;
                responseData.uuid = uuid;
                responseData.fileName = file.name;
                res.send(responseData);
            },
            function() {
                responseData.error = "Problem copying the file!";
                res.send(responseData);
            });
    }
    else {
        failWithTooBigFile(responseData, res);
    }
}

function onChunkedUpload(fields, file, res) {
    var size = parseInt(fields.qqtotalfilesize),
        uuid = fields.qquuid,
        index = fields.qqpartindex,
        totalParts = parseInt(fields.qqtotalparts),
        responseData = {
            success: false
        };

    file.name = fields.qqfilename;

    if (isValid(size)) {
        storeChunk(file, uuid, index, totalParts, function() {
            if (index < totalParts - 1) {
                responseData.success = true;
                res.send(responseData);
            }
            else {
                combineChunks(file, uuid, function() {
                        responseData.success = true;
                        res.send(responseData);
                    },
                    function() {
                        responseData.error = "Problem conbining the chunks!";
                        res.send(responseData);
                    });
            }
        },
        function(reset) {
            responseData.error = "Problem storing the chunk!";
            res.send(responseData);
        });
    }
    else {
        failWithTooBigFile(responseData, res);
    }
}

function failWithTooBigFile(responseData, res) {
    responseData.error = "Too big!";
    responseData.preventRetry = true;
    res.send(responseData);
}

function onDeleteFile(req, res) {
    var uuid = req.params.uuid,
        dirToDelete = uploadedFilesPath + uuid;

    rimraf(dirToDelete, function(error) {
        if (error) {
            console.error("Problem deleting file! " + error);
            res.status(500);
        }

        res.send();
    });
}

function isValid(size) {
    return maxFileSize === 0 || size < maxFileSize;
}

function moveFile(destinationDir, sourceFile, destinationFile, success, failure) {
    mkdirp(destinationDir, function(error) {
        var sourceStream, destStream;

        if (error) {
            console.error("Problem creating directory " + destinationDir + ": " + error);
            failure();
        }
        else {
            sourceStream = fs.createReadStream(sourceFile);
            destStream = fs.createWriteStream(destinationFile);

            sourceStream
                .on("error", function(error) {
                    console.error("Problem copying file: " + error.stack);
                    destStream.end();
                    failure();
                })
                .on("end", function(){
                    destStream.end();
                    success();
                })
                .pipe(destStream);
        }
    });
}

function moveUploadedFile(file, uuid, success, failure) {
    var destinationDir = uploadedFilesPath + uuid + "/",
        fileDestination = destinationDir + file.name;

    moveFile(destinationDir, file.path, fileDestination, success, failure);
}

function storeChunk(file, uuid, index, numChunks, success, failure) {
    var destinationDir = uploadedFilesPath + uuid + "/" + chunkDirName + "/",
        chunkFilename = getChunkFilename(index, numChunks),
        fileDestination = destinationDir + chunkFilename;

    moveFile(destinationDir, file.path, fileDestination, success, failure);
}

function combineChunks(file, uuid, success, failure) {
    var chunksDir = uploadedFilesPath + uuid + "/" + chunkDirName + "/",
        destinationDir = uploadedFilesPath + uuid + "/",
        fileDestination = destinationDir + file.name;


    fs.readdir(chunksDir, function(err, fileNames) {
        var destFileStream;

        if (err) {
            console.error("Problem listing chunks! " + err);
            failure();
        }
        else {
            fileNames.sort();
            destFileStream = fs.createWriteStream(fileDestination, {flags: "a"});

            appendToStream(destFileStream, chunksDir, fileNames, 0, function() {
                rimraf(chunksDir, function(rimrafError) {
                    if (rimrafError) {
                        console.log("Problem deleting chunks dir! " + rimrafError);
                    }
                });
                success();
            },
            failure);
        }
    });
}

function appendToStream(destStream, srcDir, srcFilesnames, index, success, failure) {
    if (index < srcFilesnames.length) {
        fs.createReadStream(srcDir + srcFilesnames[index])
            .on("end", function() {
                appendToStream(destStream, srcDir, srcFilesnames, index + 1, success, failure);
            })
            .on("error", function(error) {
                console.error("Problem appending chunk! " + error);
                destStream.end();
                failure();
            })
            .pipe(destStream, {end: false});
    }
    else {
        destStream.end();
        success();
    }
}

function getChunkFilename(index, count) {
    var digits = new String(count).length,
        zeros = new Array(digits + 1).join("0");

    return (zeros + index).slice(-digits);
}
    
    //6jan2018 - fine-uploader test end
    
    
    //Initialize multer middleware for image file upload to ftp folder (27.12.2017)
    //var multer = require('multer');
    //app.use(multer({ dest: '../../modules/core/client/img/content/'}).single('photo'));
    
    /*
    var cors_host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';
    var cors_port = process.env.PORT || 8080;
    
    cors_proxy.createServer({
    originWhitelist: [], // Allow all origins 
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(cors_port, cors_host, function() {
    console.log('Running CORS Anywhere on ' + cors_host + ':' + cors_port);
});*/
    
    
      //EXPRESS SEO MIDDLEWARE MODULE BEGIN
    
      //load seo middleware module
      var seo = require('express-seo')(app);
      //load module that provides access to db object
      var expressMongoDb = require('express-mongo-db');
      app.use(expressMongoDb('mongodb://localhost:27017/mean-dev'));
        //req.db is the db object usable!

     //app.use(seo());
    
//seo.setConfig({
//    langs: ["en"]
//});

 // Set the default tags 
seo.setDefaults({
    //html: "<a href='https://www.lrma.lv'>Latvijas Rokmūzikas Asociācija</a>",
    title: "Latvijas Rokmūzikas Asociācija",
    description:  "LRMA mērķis ir radīt, uzturēt un popularizēt ilgtspējīgu un starptautiski atzītu kultūras vidi Latvijā, popularizējot Latvijas rokmūziku.",
    image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
    
});
    
    //add seo route
    
    
    
    seo.add("/recenzijas/:number", function(req, opts, next) {
            var interviewnum = req.params.number;
          
         if (interviewnum.length === 12 || interviewnum.length === 24) {
          var o_id = new BSON.ObjectID(interviewnum);
          
          req.db.collection('reviews').find({"_id":o_id}).toArray()
          .then(function (interview) {
              
              var effingarticlegiefalready = interview[0];
              //console.log(effingarticlegiefalready.title);
				//req[property] = db;
				next({
        title: effingarticlegiefalready.title,
        description: effingarticlegiefalready.description || "LRMA - Recenzijas",
        image: effingarticlegiefalready.imgurl || "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
              
			})
			.catch(function (err) {
              
              console.log(err);
				//connection = undefined;
				next({
        //description: dbstatus,
        description: "LRMA - Recenzijas",
        title: "Latvijas Rokmūzikas Asociācija",
        //title: mydoc.title,
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
              
			});
         } else {
             next({
        //description: dbstatus,
        description: "LRMA - Recenzijas",
        title: "Latvijas Rokmūzikas Asociācija",
        //title: mydoc.title,
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
         };
  
    /*
    req: Express request
    opts: Object {
        service: String ("facebook" || "twitter" || "search-engine")
        lang: String (Detected language)
    }
    */
});
    
    
    
    
     seo.add("/atrastsprieksnama/:number", function(req, opts, next) {
            var interviewnum = req.params.number;
          
         if (interviewnum.length === 12 || interviewnum.length === 24) {
          var o_id = new BSON.ObjectID(interviewnum);
          
          req.db.collection('pinterviews').find({"_id":o_id}).toArray()
          .then(function (interview) {
              
              var effingarticlegiefalready = interview[0];
              //console.log(effingarticlegiefalready.title);
				//req[property] = db;
				next({
        title: effingarticlegiefalready.title,
        description: effingarticlegiefalready.description || "LRMA - Atrasts Priekšnamā",
        image: effingarticlegiefalready.imgurl || "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
              
			})
			.catch(function (err) {
              
              console.log(err);
				//connection = undefined;
				next({
        //description: dbstatus,
        description: "LRMA - Atrasts Priekšnamā",
        title: "Latvijas Rokmūzikas Asociācija",
        //title: mydoc.title,
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
              
			});
         } else {
             next({
        //description: dbstatus,
        description: "LRMA - Atrasts Priekšnamā",
        title: "Latvijas Rokmūzikas Asociācija",
        //title: mydoc.title,
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
         };
  
    /*
    req: Express request
    opts: Object {
        service: String ("facebook" || "twitter" || "search-engine")
        lang: String (Detected language)
    }
    */
});
    
    
    seo.add("/jaunumi/:number", function(req, opts, next) {
            var interviewnum = req.params.number;
          
            if (interviewnum.length === 12 || interviewnum.length === 24) {
          var o_id = new BSON.ObjectID(interviewnum);
          
          req.db.collection('headlines').find({"_id":o_id}).toArray()
          .then(function (interview) {
              
              var effingarticlegiefalready = interview[0];
              //console.log(effingarticlegiefalready.title);
				//req[property] = db;
				next({
        title: effingarticlegiefalready.title,
        description: effingarticlegiefalready.description || "LRMA - Jaunumi",
        image: effingarticlegiefalready.imgurl || "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
              
			})
			.catch(function (err) {
              
              console.log(err);
				//connection = undefined;
				next({
        //description: dbstatus,
        description: "LRMA - Jaunumi",
        title: "Latvijas Rokmūzikas Asociācija",
        //title: mydoc.title,
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
              
			});
                 } else {
             next({
        //description: dbstatus,
        description: "LRMA - Jaunumi",
        title: "Latvijas Rokmūzikas Asociācija",
        //title: mydoc.title,
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
         };
  
    /*
    req: Express request
    opts: Object {
        service: String ("facebook" || "twitter" || "search-engine")
        lang: String (Detected language)
    }
    */
});
    
    
      seo.add("/intervijas/:number", function(req, opts, next) {
            var interviewnum = req.params.number;
          
          if (interviewnum.length === 12 || interviewnum.length === 24) {
          var o_id = new BSON.ObjectID(interviewnum);
          
          req.db.collection('interviews').find({"_id":o_id}).toArray()
          .then(function (interview) {
              
              var effingarticlegiefalready = interview[0];
              //console.log(effingarticlegiefalready.title);
				//req[property] = db;
				next({
        title: effingarticlegiefalready.title,
        description: effingarticlegiefalready.description || "LRMA - Intervijas",
        image: effingarticlegiefalready.imgurl || "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
              
			})
			.catch(function (err) {
              
              console.log(err);
				//connection = undefined;
				next({
        //description: dbstatus,
        description: "LRMA - Intervijas",
        title: "Latvijas Rokmūzikas Asociācija",
        //title: mydoc.title,
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
              
			});
               } else {
             next({
        //description: dbstatus,
        description: "LRMA - Intervijas",
        title: "Latvijas Rokmūzikas Asociācija",
        //title: mydoc.title,
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
         };
  
    /*
    req: Express request
    opts: Object {
        service: String ("facebook" || "twitter" || "search-engine")
        lang: String (Detected language)
    }
    */
});
    
 
    seo.add("/recenzijas", function(req, opts, next) {
    /*
    req: Express request
    opts: Object {
        service: String ("facebook" || "twitter" || "search-engine")
        lang: String (Detected language)
    }
    */
    next({
        description: "Latvijas Rokmūzikas Recenzijas.",
        title: "LRMA - Recenzijas",
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        twitsite: "https://www.lrma.lv/recenzijas",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
});
    
    
    
seo.add("/atrastsprieksnama", function(req, opts, next) {
    /*
    req: Express request
    opts: Object {
        service: String ("facebook" || "twitter" || "search-engine")
        lang: String (Detected language)
    }
    */
    next({
        description: "Atrasts Priekšnamā - interviju cikls sadarbībā ar Radio SWH topu Priekšnams.",
        title: "Atrasts Priekšnamā",
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        twitsite: "https://www.lrma.lv/atrastsprieksnama",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
});
    
    seo.add("/intervijas", function(req, opts, next) {
    /*
    req: Express request
    opts: Object {
        service: String ("facebook" || "twitter" || "search-engine")
        lang: String (Detected language)
    }
    */
    next({
        description: "Latvijas Rokmūzikas Asociācijas interviju cikls ar Latvijas rokgrupām.",
        title: "Latvijas Rokmūzikas Asociācija - Intervijas",
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        twitsite: "https://www.lrma.lv/intervijas",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
});
    
    seo.add("/latvijasrokmuzikasvesture", function(req, opts, next) {
    /*
    req: Express request
    opts: Object {
        service: String ("facebook" || "twitter" || "search-engine")
        lang: String (Detected language)
    }
    */
    next({
        description: "Latvijas Rokmūzikas Vēsture - rakstu sērija par Latvijas roka pirmsākumiem.",
        title: "LRMA - Latvijas Rokmūzikas Vēsture",
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        twitsite: "https://www.lrma.lv/latvijasrokmuzikasvesture",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
});
    
    seo.add("/rokastasti", function(req, opts, next) {
    /*
    req: Express request
    opts: Object {
        service: String ("facebook" || "twitter" || "search-engine")
        lang: String (Detected language)
    }
    */
    next({
        description: "LRMA Roka Stāsti.",
        title: "LRMA - Roka Stāsti",
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        twitsite: "https://www.lrma.lv/rokastāsti",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
});
    
     seo.add("/jaunumi", function(req, opts, next) {
    /*
    req: Express request
    opts: Object {
        service: String ("facebook" || "twitter" || "search-engine")
        lang: String (Detected language)
    }
    */
    next({
        description: "Latvijas Rokmūzikas Jaunumi.",
        title: "LRMA - Jaunumi",
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        twitsite: "https://www.lrma.lv/jaunumi",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
});
    
     seo.add("/events", function(req, opts, next) {
    /*
    req: Express request
    opts: Object {
        service: String ("facebook" || "twitter" || "search-engine")
        lang: String (Detected language)
    }
    */
    next({
        description: "Latvijas Rokmūzikas Pasākumi.",
        title: "LRMA - Pasākumi",
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        twitsite: "https://www.lrma.lv/events",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
});
    
      seo.add("/events/:number", function(req, opts, next) {
            var articlenum = req.params.number;
          
          if (articlenum.length === 12 || articlenum.length === 24) {
          var o_id = new BSON.ObjectID(articlenum);
          
          req.db.collection('events').find({"_id":o_id}).toArray()
          .then(function (article) {
              
              var effingarticlegiefalready = article[0];
              //console.log(effingarticlegiefalready.title);
				//req[property] = db;
				next({
        title: effingarticlegiefalready.title,
        description: effingarticlegiefalready.description || "LRMA - Pasākumi",
        image: effingarticlegiefalready.imgurl || "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
              
			})
			.catch(function (err) {
              
              console.log(err);
				//connection = undefined;
				next({
        //description: dbstatus,
        description: "LRMA - Pasākumi",
        title: "Latvijas Rokmūzikas Asociācija",
        //title: mydoc.title,
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
              
			});
               } else {
             next({
        //description: dbstatus,
        description: "LRMA - Pasākumi",
        title: "Latvijas Rokmūzikas Asociācija",
        //title: mydoc.title,
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
         };
  
    /*
    req: Express request
    opts: Object {
        service: String ("facebook" || "twitter" || "search-engine")
        lang: String (Detected language)
    }
    */
});
    
    
    
     seo.add("/rokastasti/:number", function(req, opts, next) {
            var articlenum = req.params.number;
          
         if (articlenum.length === 12 || articlenum.length === 24) {
          var o_id = new BSON.ObjectID(articlenum);
          
          req.db.collection('rockarticles').find({"_id":o_id}).toArray()
          .then(function (article) {
              
              var effingarticlegiefalready = article[0];
              //console.log(effingarticlegiefalready.title);
				//req[property] = db;
				next({
        title: effingarticlegiefalready.title,
        description: effingarticlegiefalready.description || "LRMA - Roka Stāsti",
        image: effingarticlegiefalready.imgurl || "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
              
			})
			.catch(function (err) {
              
              console.log(err);
				//connection = undefined;
				next({
        //description: dbstatus,
        description: "LRMA - Roka Stāsti",
        title: "Latvijas Rokmūzikas Asociācija",
        //title: mydoc.title,
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
              
			});
              } else {
             next({
        //description: dbstatus,
        description: "LRMA - Roka Stāsti",
        title: "Latvijas Rokmūzikas Asociācija",
        //title: mydoc.title,
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
         };
  
    /*
    req: Express request
    opts: Object {
        service: String ("facebook" || "twitter" || "search-engine")
        lang: String (Detected language)
    }
    */
});
    
    
    
     seo.add("/latvijasrokmuzikasvesture/:number", function(req, opts, next) {
            var articlenum = req.params.number;
          
         if (articlenum.length === 12 || articlenum.length === 24) {
          var o_id = new BSON.ObjectID(articlenum);
          
          req.db.collection('harticles').find({"_id":o_id}).toArray()
          .then(function (article) {
              
              var effingarticlegiefalready = article[0];
              //console.log(effingarticlegiefalready.title);
				//req[property] = db;
				next({
        title: effingarticlegiefalready.title,
        description: effingarticlegiefalready.description || "LRMA - Latvijas Rokmūzikas Vēsture",
        image: effingarticlegiefalready.imgurl || "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
              
			})
			.catch(function (err) {
              
              console.log(err);
				//connection = undefined;
				next({
        //description: dbstatus,
        description: "LRMA - Latvijas Rokmūzikas Vēsture",
        title: "Latvijas Rokmūzikas Asociācija",
        //title: mydoc.title,
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
              
			});
              } else {
             next({
        //description: dbstatus,
        description: "LRMA - Latvijas Rokmūzikas Vēsture",
        title: "Latvijas Rokmūzikas Asociācija",
        //title: mydoc.title,
        image: "https://www.lrma.lv/modules/core/client/img/brand/lrma.png",
        twitter: "@rockassociation",
        twitsummary: "summary",
        fbappid: "112034179491052",
        typeofwebsite: "website",
        sitename: "Latvijas Rokmūzikas Asociācija"
    });
         };
  
    /*
    req: Express request
    opts: Object {
        service: String ("facebook" || "twitter" || "search-engine")
        lang: String (Detected language)
    }
    */
});
//EXPRESS SEO MIDDLEWARE MODULE END
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
  // Set swig as the template engine
  app.engine('server.view.html', consolidate[config.templateEngine]);

  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', './');
};

/**
 * Configure Express session
 */
module.exports.initSession = function (app, db) {
  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure && config.secure.ssl
    },
    key: config.sessionKey,
    store: new MongoStore({
      mongooseConnection: db.connection,
      collection: config.sessionCollection
    })
  }));    
    
  // Add Lusca CSRF Middleware
  app.use(lusca(config.csrf));
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function (app, db) {
  config.files.server.configs.forEach(function (configPath) {
    require(path.resolve(configPath))(app, db);
  });
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function (app) {
  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
  // Setting the app router and static folder
  app.use('/', express.static(path.resolve('./public')));

  // Globbing static routing
  config.folders.client.forEach(function (staticPath) {
    app.use(staticPath, express.static(path.resolve('./' + staticPath)));
  });
};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = function (app) {
  // Globbing policy files
  config.files.server.policies.forEach(function (policyPath) {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app) {
  // Globbing routing files
  config.files.server.routes.forEach(function (routePath) {
    require(path.resolve(routePath))(app);
  });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
  app.use(function (err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    res.redirect('/server-error');
  });
};

/**
 * Configure Socket.io
 */
module.exports.configureSocketIO = function (app, db) {
  // Load the Socket.io configuration
  var server = require('./socket.io')(app, db);

  // Return server object
  return server;
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
  // Initialize express app
  var app = express();

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Express view engine
  this.initViewEngine(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize modules static client routes, before session!
  this.initModulesClientRoutes(app);

  // Initialize Express session
  this.initSession(app, db);

  // Initialize Modules configuration
  this.initModulesConfiguration(app);

  // Initialize modules server authorization policies
  this.initModulesServerPolicies(app);

  // Initialize modules server routes
  this.initModulesServerRoutes(app);

  // Initialize error routes
  this.initErrorRoutes(app);

  // Configure Socket.io
  app = this.configureSocketIO(app, db);

  return app;
};
