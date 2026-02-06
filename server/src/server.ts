import 'dotenv/config';
console.log('Starting server...');
import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
