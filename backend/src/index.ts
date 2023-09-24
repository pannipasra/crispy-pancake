import app from './app';
import { connectToDB } from './db/connectToDb';

const PORT = 7821;



app.listen(PORT, () => {
    console.log(`🌈Server is running at http://localhost:${PORT} ⚡`);
});

connectToDB();