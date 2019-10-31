const express=require('express');
const request=require('request');
const https=require('https');
const bodyParser=require('body-parser');
const route=express.Router();
const promise=require('promise');
const querystring=require('querystring');

var code_id=null;

route.post('/sendOtp',(request,response,next)=>{
   
    var flag=0;
    //console.log(request);
    var number =request.headers.pno;
    // console.log(number);
    // console.log(typeof number);
   
    // const params={
    //     country : 91,
    //     sender : 'SOSVER',
    //     message : `Your verification code is ##OTP##. Please don't share it with anyone`,
    //     mobile : number,
    //     authkey : '299889AtoI1ccEli5dabf539',
    //     invisible : 1,
    //     otp_length : 6,
    //     otp_expiry :1
    // };
    const params={
        template_id:'5dac02d7d6fc05265e48f5f1',
        mobile:number,
        authkey:'299889AtoI1ccEli5dabf539',
        otp_length:6,
        otp_expiry:1,
        invisible:1
    }

    const postdata=querystring.stringify(params);
    // console.log(postdata);

    var options={
        'method' : 'POST',
        'hostname' : 'control.msg91.com',
        'port' : null,
        'path' : `api/sendotp.php?${postdata}`,
        "headers" : {}
    };
    var url=`https://api.msg91.com/api/v5/otp?${postdata}`;
    
    console.log(url);
    var req=https.request(url,(res)=>{
        var chunks=[];
        res.on("data",(chunk)=>{chunks.push(chunk);});
        res.on("end",()=>{
            var body=Buffer.concat(chunks);
            var obj=JSON.parse(body.toString());
            code_id=obj.message;
            type=obj.type;
            if(type=='error'){
                flag=1;
            }
            console.log(obj);
        });
    });
    if(flag==1)
        response.status(404).send(`{"message":"Some error Occured"}`);
    else
        response.send(`{"message":"otp sent successfully"}`);
    req.end();
});

route.post('/verifyOtp',(request,response,next)=>{
    //console.log(request);
    var flag=0;
    var mobileResponse;
    const params={
        otp : request.headers.otp,
        mobile : request.headers.pno,
        authkey : '299889AtoI1ccEli5dabf539',
        request_id : code_id
    };
    var query=querystring.stringify(params);
    var url=`https://api.msg91.com/api/v5/otp/verify?${query}`;

    var req=https.request(url,(res)=>{
        var chunks=[];
        res.on("data",(chunk)=>{
            chunks.push(chunk);
        });
        res.on("end",()=>{
            var body=Buffer.concat(chunks);
            var obj=JSON.parse(body.toString());
            console.log(obj);
            if(obj.type==`error`){
                flag=1;
            }
        });
    });
    if(flag==0)
    response.json({id:1,message:"Otp Verified"});
    else
        response.json({id:0, message:"Otp not Verified"});
    req.end();
});

route.post('/resendOtp',(request,response,next)=>{
    const params={
        country:91,
        retrytype:'text',
        mobile : request.headers.pno,
        authkey : '299889AtoI1ccEli5dabf539',
    };

    var flag=0;
    var mobileResponse;
    var query=querystring.stringify(params);
    console.log(query);
    var url=`https://control.msg91.com/api/retryotp.php?${params}`;
    var req=https.request(url,(res)=>{
        var chunks=[];
        res.on("data",(chunk)=>{chunks.push(chunk);});
        res.on("end",()=>{
            var body=Buffer.concat(chunks);
            console.log(body.toString());
            var obj=JSON.parse();
            if(obj.type===`error`){
                flag=1;
            }
            console.log(obj);
            mobileResponse=obj;
        });
    });
    if(flag==0)
        response.send(mobileResponse);
    else
        response.send({message:"Error Occured"});
    req.end();
});
module.exports=route;