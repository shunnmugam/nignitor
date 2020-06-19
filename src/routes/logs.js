var express = require('express');
var app = express.Router();
const fs = require('fs');
const path = require('path');

const logger = use('logger');
app.get('/api/logs', function(req, res) {
    let date = req.query.date;
    let month = req.query.month;
    const year = req.query.year;

    if(req.query.AllData){
        const filePathAll = path.join(__dirname, `/../logs/`)
        fs.readdir(filePathAll,  {encoding: 'utf-8'}, function(err,files) {
            if(err) {
                logger.error(err)
            } else {
            var allDataJSON ={};
            count = files.filter(f => f.indexOf("application-")!== -1).length;
            var check=0;
            files.forEach(file => {
                
                if(file.indexOf("application-")!== -1) {
                    fs.readFile(filePathAll + file,  {encoding: 'utf-8'}, function(err,data) {
                        check++;
                        if(!err) {
                            var d = data.replace(/\n/g, ",");
                            d = d.replace(/(^,)|(,$)/g, "");
                            
                            try {
                                allDataJSON[file] = ( JSON.parse("["+d+"]"));
                                const data = JSON.stringify(allDataJSON[file])
                                res.write(data);
                            } catch(e) {
                                logger.error("error in "+file);
                            }
                            // resolve()
                        } else {
                            logger.error("error", err)
                            // reject();
                        }
                        if(count===check){
                            res.end();
                        }
                        
                    })
                }
               
              });
          }
            
          });
    }else{
    

    //const fs = require('fs');
    if(month.length === 1) {
        month="0"+month;
    }
    if(date.length === 1) {
        date="0"+date;
    }

    const filePath = path.join(__dirname, `/../logs/application-${year}-${month}-${date}.log`);
    fs.readFile(filePath,  {encoding: 'utf-8'}, function(err,data) {
        if(!err) {
            var d = data.replace(/\n/g, ",");
            d = d.replace(/(^,)|(,$)/g, "");
            
            res.json({'status': 1, data: JSON.parse("["+d+"]")})
        } else {
            res.json({'status': 0});
        }
    })
}
})

module.exports = app;