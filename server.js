'use strict';
/*-----------------API DATA EXTRAPOLATION BELOW------------*/

var googleTrends = require('./lib/google-trends-api.min.js');
var http = require('http');
var fs = require('fs');

const PORT=process.env.PORT;
var data;

googleTrends.relatedQueries({
keyword: '*',
startTime: new Date(new Date().setDate(new Date().getDate() - 7)),
endTime: new Date(Date.now()),
geo: 'US',
property: 'news',
})
.then((res) => {
  data = res;
})
.catch((err) => {
  console.log(err);
})

// var url='https://newsapi.org/v2/top-headlines?country=us&apiKey=af2c24b426a34038888bd4e88d263052'; // GOOGLE NEWS API DATA PULL HERE
//                                 // 'from='+ new Date(new Date().setDate(new Date().getDate() - 30)) +'&' +
//                                 // 'apiKey=af2c24b426a34038888bd4e88d263052';
//                             var req = new Request(url);
//                             fetch(req)
//                                 .then(response => response.json())
//                                 .then(function(post){ // WAIT FOR DATA: ERROR HERE IF MAX LIMIT REACHED
//                                     data = post.articles;
//                                     console.log(post.articles);
//                                 }); 
/*-----------------HTTP WEB SERVER BELOW--------------------*/

var http = require('http');
var fs = require('fs');


fs.readFile('./index.html', function (err, html) {

    if (err) throw err;    

    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"}); 
        response.write("<script type=\"text/javascript\">var data ="+data+";console.log(data);</script>"); 
        response.write(html);
        response.end();  
    }).listen(PORT);
});
