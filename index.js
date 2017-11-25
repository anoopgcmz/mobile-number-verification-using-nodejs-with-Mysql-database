const express = require('express');
const mysql = require('mysql'); 
const bodyParser = require('body-parser'); 
const path = require('path');
const http = require('http');
const Nexmo = require('nexmo');

//Nexmo Config
const nexmo = new Nexmo({
    apiKey:'',
    apiSecret: ''
},{debug:true});
//Express Initializing
const app = express(); 
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))

//Body Parse Middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//Mysql Connection
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'mysqlnode'
});

//connecting the app with Mysql
db.connect((err)=>{
if(err){
    throw err;
}else{
    console.log('Mysql Connected')
}
});

app.get('/',function(req,res){ 
    res.render('form',{
              title:"Registration Form"
          });
  })

app.post('/registration',function(req,res){

    //Getting variables from form
    var userName = req.body.Ename;
    var userEmail = req.body.Eemail;
    var userPhone = req.body.Ephone;

    //Random Number Generating For verification
    var code = Math.floor(1000 + Math.random() * 9000); 

    //Registation Table
    let post = {users_name:userName, users_email:userEmail, users_phn:userPhone};
    let sql = 'insert into users set ?';

    //Verification Table
    let postverify = {verification_phone:userPhone,verification_code:code};
    let sqlverify = 'insert into verification set ?';

    //Sql Query Execution
    let query = db.query(sql,post,(err,result)=>{
        if(err)throw err;
        console.log(result);
        //adding other query to insert for varification table
        let verificationquery = db.query(sqlverify,postverify,(err,result)=>{
            if(err)throw err;

            //Verification Code Sending via MSG
            var codeMsg= "Your Verification code is "+ code +" ";
            nexmo.message.sendSms(
               'Your Number', userPhone,codeMsg,{ type : 'unicode'},
               (err,responseData)=>{
                   if(err){
                       console.log(err);
                   }else{
                       console.dir(responseData);
                   }
               }
            );
            res.render('Verification',{
                title:"Number Verification"
            })
        })
    })
})
app.get('/verification',function(res,req){
    res.render('Verification',{
        title:"Number Verification"
    })
})

app.post('/verification',function(req,res){
    //Getting variables from form
    var userPhoneNo = req.body.VRphone;
    var userCodeVal = req.body.VRemail; 
    //Verification Table
    //let postverify = {userPhoneNo,userCodeVal};
    let sqlverify = 'select verification_id from verification where verification_phone ='+userPhoneNo+' AND verification_code= '+ userCodeVal;
    let queryVerify = db.query(sqlverify,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            let ConfVerify = {users_status:1};
            let ConfSqlVerify = 'UPDATE users SET ? where users_phn= '+userPhoneNo;
            let ConfQuery = db.query(ConfSqlVerify,ConfVerify,(err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    res.render('success',{
                        title:"Verification Sucessfull with Mobile Number "+ userPhoneNo ,
                    })
                }
            })

        }
    })
})

app.listen('3000',()=>{
    console.log('running in port 3000')
})