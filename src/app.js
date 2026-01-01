const express = require('express');
const connectDb = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/authRouter');
const profileRouter = require('./routes/profileRouter');
const requestRouter = require('./routes/requestRouter');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

connectDb().then(() => {
    console.log('Database is connected successfulyy!!');
    app.listen(7777, (req,res) => {
        console.log('Server is runnning on port 7777.');
    })
}).catch((error) => {
    console.error('database is not connected.', error.message)
})

app.listen(3000);
