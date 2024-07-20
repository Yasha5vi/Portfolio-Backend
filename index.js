import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

const app = express();
const port = 3000;
dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); 

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URL);
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});

async function sendMail(email,msg){
    try{
        const accessToken = oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
                type:'OAUTH2',
                user:'yashasvi8532@gmail.com',
                clientId:CLIENT_ID,
                clientSecret:CLIENT_SECRET,
                refreshToken:REFRESH_TOKEN,
                accessToken:accessToken
            }
        })

        const mailOptions = {
            from:`contact <${email}>`,
            to:'yashasvichandra84@gmail.com',
            subject:'Message from Portfolio',
            text:msg,
            // html:<h1>HEllo from portfolio</h1> optional
        }

        const result = await transport.sendMail(mailOptions); // as a promise
        return result;

    }catch(err){
        return err;
    }
}


app.post("/contact/yashasvi",(req,res)=>{
    console.log(req.body);
    try{
        sendMail(req.body.email,req.body.msg)
        .then((result)=>{
            console.log("Mail Sent "+result);
            res.send("Message sent");
        });
    }catch(err){
        console.log(err.message);
    }
})

app.listen(port,()=>{
    console.log(`Server Running on port ${port}`);
})