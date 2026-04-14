const http = require("http");
const path = require("path");
const fs = require("fs");
const { MongoClient } = require("mongodb");

require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let slugCollection;

async function connectDB(){
    try{
        await client.connect();
        slugCollection = client.db("assignment3").collection("slugCats");
        console.log("Connected to MongoDB");
    } catch (e){
        console.error("MongoDB connection failed:", e);
        process.exit(1);
    }
}

const server = http.createServer((req, res) => {

    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'),
            (err, content) => {
                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        );
    }
    else if (req.url === '/style.css'){
        fs.readFile(path.join(__dirname, 'public', 'style.css'),
            (err,content) => {
                if(err) throw err;
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.end(content);
            }
    )
    }
    else if (req.url === '/script.js'){
        fs.readFile(path.join(__dirname, 'public', 'script.js'),
            (err, content) => {
                if(err) throw err;
                res.writeHead(200, {'Content-Type': 'application/javascript'})
                res.end(content);
            }
    )
    }

    else if(req.url === '/images/title.jpeg'){
          fs.readFile(
            path.join(__dirname, 'public', 'images', 'title.jpeg'),
            (err, content) => {
              if(err) throw err;
    
              res.writeHead(200, {'Content-Type': 'image/jpeg'})
              res.end(content);
            }
          )
        }

    else  if (req.url === '/api' && req.method === 'GET') {

            slugCollection.find({}).toArray()
                .then(results => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(results));
                })
                .catch(err => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Failed to fetch books" }));
                });
        }
});

connectDB();

const PORT = 3000;
server.listen(PORT, ()=> {
    console.log("Yay the server is running")
})