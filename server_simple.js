var express = require("express");
var app     = express();
var path    = require("path");


app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/err',function(req,res){
  res.sendFile(path.join(__dirname+'/err.html'));
});

app.get('/success',function(req,res){
  res.sendFile(path.join(__dirname+'/success.html'));
});

app.listen(3500);
console.log("Running at Port 3500");
