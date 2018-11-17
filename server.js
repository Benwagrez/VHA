'use strict';
/*-----------------API DATA EXTRAPOLATION BELOW------------*/

var googleTrends = require('./lib/google-trends-api.min.js');
var data;

googleTrends.relatedTopics({
keyword: '*',
startTime: new Date(new Date().setDate(new Date().getDate() - 30)),
endTime: new Date(Date.now()),
geo: 'US',
category: '1209',
})
.then((res) => {
  data = res;
})
.catch((err) => {
  console.log(err);
})

/*-----------------HTTP WEB SERVER BELOW--------------------*/

var http = require('http');
var fs = require('fs');

const PORT=8080; 

fs.readFile('./index.html', function (err, html) {

    if (err) throw err;    

    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"}); 
        response.write("<script type=\"text/javascript\">var data ="+data+";console.log(data);</script>"); 
        response.write(html);
        response.end();  
    }).listen(PORT);
});