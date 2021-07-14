// express port 3000
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    }
});
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const cors = require("cors");


io.sockets.on("connection", (socket) => {
    console.log("new connection")
})

function getFFMPEGCommand(url, roomId) {
    return `ffmpeg -re -i ${url} -profile:v baseline -level 3.0 -s 640x360 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls server/room/${roomId}/index.m3u8`;
}


// check if directory exists node js
function checkDirectory(directory) {
   if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
}

app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true,
}));

// child_process started

app.post("/createRoom", async (req, res) => {
    const { movie } = req.body;
    
    // generate room id
    const roomId = uuidv4();
    // check if the directory not exist create one
    checkDirectory(path.resolve(__dirname, "room", roomId));
    
    const ffmpeg = await exec(getFFMPEGCommand(movie ,roomId), function (code, stdout, stderr) {
        console.log("Exit code:", code);
        console.log("Program output:", stdout); // could print: 'server up!'
        console.log("Program stderr:", stderr);
    });


    ffmpeg.stdout.on("data", (data) => {
        console.log(`Number of files ${data}`);
    });


    res.send({ roomId });

});

app.get("/:room/:file", (req, res) => {
    console.log("new request...");
    const _path = path.resolve(__dirname, "room", req.params.room, req.params.file);
    fs.readFile(_path, function(error, content) {
        if (!content || error) {
            res.send("not found") 
            return;
        }
        else {
            res.end(content, 'utf-8');
            return;
        }
    });
})

http.listen(3000, () => {
    console.log("app listening on port 3000");
});
