import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 1230;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});