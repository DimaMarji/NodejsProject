const auth = require('./middleware/authenticate');
// const WebPush=require('./services/web-push')
const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const https = require('https');
const fs= require('fs');
const cors = require('cors');
const compression=require('compression')
const fileUpload=require('express-fileupload')
app.use(express.json());
app.use(express.static('./routers/uploads'));
app.use(cors());
app.use(compression());
app.use(fileUpload());

// app.use(express.static(path.join(__dirname, 'client')));
// app.use((err, req, res, next) => {
//     console.log('Unhandled error: ' + err);
//     res.status(500).send("Internal Server Error");
// });

app.use(auth);
// app.post('/subscribe',(req,res) =>{
//     const subscription=req.body;
//     res.status(201).json({});
//     WebPush.addSubscription(subscription);
//     const payload = JSON.stringify({ title: 'Push Test from YEP'});
//     WebPush.sendPushMsg(subscription,payload)
// });
app.use('/api/author', require('./routers/authors'));
app.use('/api/books', require('./routers/books'));
app.use('/api/users', require('./routers/users'));
app.use('/', (req, res) => {
    res.status(404).send('Incorrect URL!');
});
const option={
    key:fs.readFileSync('./config/key.pem','utf8'),
    cert:fs.readFileSync('./config/cert.pem','utf8')
};
  
https.createServer(option,app).listen(5000);
console.log('listening on 5000')
module.exports = app;