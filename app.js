const express=require('express');
const port = process.env.PORT || 3000;
const otpRoute=require('./routes/sendOtp');

const app=express();

app.use(otpRoute);
app.get('/',(req,res,next)=>{
    res.send('The site is running');
});
app.listen(port,()=>{console.log('server is running');  })