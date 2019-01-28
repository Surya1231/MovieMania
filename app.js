var express = require("express");
var app = express();
var bodyparse = require("body-parser");
var request = require("request");
app.use(bodyparse.urlencoded({extended: true}));
app.use(express.static('public'));

var port = 3000 || process.env.PORT;
var host = '127.0.0.1' || process.env.HOST;

var movie = [];
var total = 0;
var pageon = 1;
var title;

app.get("/",function(req,res){
  console.log(pageon);
  res.render("main.ejs",{movie:movie,total:total,pageon:pageon});
});


app.post("/post",function(req,res){
  title = req.body.title;
  var q = "http://www.omdbapi.com/?s="+req.body.title+"&apikey=c07910c2";
  request(q ,function(error,response,body){
    if(!error && response.statusCode == 200){
      var data = JSON.parse(body);

      if(data["Response"] == "True"){
        movie= data["Search"];
        total = data["totalResults"];
        pageon = 1;

       }
      else {movie = []; }
        res.redirect("/");
    }
  });

});

app.post("/pageganger",function(req,res){
  pageon = Number(req.body["page"]);
  var q = "http://www.omdbapi.com/?s="+title+"&page="+pageon+"&apikey=c07910c2";
  console.log(q);
  request(q ,function(error,response,body){
    if(!error && response.statusCode == 200){
      var data = JSON.parse(body);


      if(data["Response"] == "True"){
        movie= data["Search"];
        total = data["totalResults"];

       }
      else {movie = []; }
        res.redirect("/");
    }
  });
});

app.listen(port , host , function(){
  console.log("Server running at : http:/"+host+":"+port+"/");
});
