const express = require('express')
const http = require('http')
const path = require('path')

const app = express()
const port = 0

require('child_process').fork('./data/dataServer.js')

app.use('/',express.static(path.join(__dirname,'angular')));

app.get('/*', (req,res)=>   res.sendFile(path.join(__dirname)))

const server = http.createServer(app)

server.listen(port,()=> console.log('Running at http://localhost:'+server.address().port))