const http = require('http');
const port = process.env.PORT || 8080;
const version = process.env.VERSION || "v1 (Blue)";
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(`Hello from the app - version: ${version}`);
});
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
