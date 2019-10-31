const express=require('express');

const otpRoute=require('./routes/sendOtp');

const app=express();

app.use(otpRoute);
app.get('/',(req,res,next)=>{
    res.send('The site is running');
});
app.listen(3000,()=>{console.log('server is running');  })