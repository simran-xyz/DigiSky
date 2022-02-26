const express = require("express");
const app = express();
const fs = require("fs");
var requests = require("requests");


const homefile = fs.readFileSync("index.html", "utf-8");
//const form = homefile.querySelector('form');

const replaceVal = (tempVal, orgVal) => {
    let temprature = tempVal.replace("{%tempval%}", (orgVal.main.temp-273.15).toFixed(2));
    temprature = temprature.replace("{%tempmin%}", (orgVal.main.temp_min-273.15).toFixed(2));
    temprature = temprature.replace("{%tempmax%}", (orgVal.main.temp_max-273.15).toFixed(2));
    temprature = temprature.replace("{%location%}", orgVal.name);
    temprature = temprature.replace("{%country%}", orgVal.sys.country);
    return temprature;
}

app.get("/user", function(request, response)
{
  const p = request.query;
    requests(`https://api.openweathermap.org/data/2.5/weather?q=${p.cityName}&appid=728d2a969565a15b6de772457e105987`)
.on('data', function (chunk) {
    const objdata = JSON.parse(chunk);
    const arrData = [objdata]; 
  //console.log((arrData[0].main.temp-273.15).toFixed(2));
  const realTimeData = arrData.map((val) => replaceVal(homefile, val)).join("");
  response.send(realTimeData);
  //console.log(realTimeData);
})
.on('end', function (err) {
  if (err) return console.log('connection closed due to errors', err);
 response.end();
});
}
);

app.get("/", function(request, response)
{
    requests("https://api.openweathermap.org/data/2.5/weather?q=Shimla&appid=728d2a969565a15b6de772457e105987")
.on('data', function (chunk) {
    const objdata = JSON.parse(chunk);
    const arrData = [objdata]; 
  //console.log((arrData[0].main.temp-273.15).toFixed(2));
  const realTimeData = arrData.map((val) => replaceVal(homefile, val)).join("");
  response.send(realTimeData);
  //console.log(realTimeData);
})
.on('end', function (err) {
  if (err) return console.log('connection closed due to errors', err);
 response.end();
});
}
);

app.listen(5000, ()=> {
   console.log("Server is listening on port 5000.");
});