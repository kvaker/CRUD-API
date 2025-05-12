import dotenv from 'dotenv';
import http from 'http';
import { userRouter } from './routes/users';
import { errorHandler, notFoundHandler } from './utils/handlers';

dotenv.config();

const server = http.createServer(async (req, res) => {
    try {
        await userRouter(req, res);
    } catch (err) {
        errorHandler(err, res);
        return;
    }
    notFoundHandler(req, res);
});

server.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});
