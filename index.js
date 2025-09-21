const express = require('express')
const cors = require('cors');

const authRoutes = require('./routes/authRoutes.js');


const PORT =  8000

const app = express()
app.use(cors());

app.use(express.json());

app.use('/api', authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

})