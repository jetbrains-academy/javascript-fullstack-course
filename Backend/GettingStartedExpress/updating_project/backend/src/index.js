import express from 'express';
import http from 'http';

const app = express();

app.get('/', (req, res) => {
    res.status(200).type('text/plain').send('Hello, World!');
});

// Try to move this app.use above app.get handler definition and check what's changed
app.use((req, res) => {
    res.status(404).type('text/plain').send('Page Not Found');
});

const PORT = 8000;
const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});

export { httpServer };
