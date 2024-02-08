import express, {Express, Request,Response,NextFunction} from 'express';
import dotenv from 'dotenv';
dotenv.config()

//@ts-ignore
import jwt from 'jsonwebtoken'
//@ts-ignore
import _ from 'lodash'
import { runInNewContext } from 'vm';
const User = require('../model/user');

const userdata: Array<object> = [
    {id: "iv1",email: 'vidit.tam@gmail.com', pass: "1234"},
    {id: "ij1", email: 'junaid@gmail.com', pass: "5678"},
    
]

const createuser = async (req: Request, res: Response)=>{
    try {

        const data = req.body;

    //@ts-ignore
    const {email, name} = data;

    if(!(email && name)){
        res.send(200).json({message: "An unexpected error occured while logging in !"})
    }
    else{
        const data = await User.find({email: email})
        if(data){
            res.status(201).json(data);
            // console.log("user already exists")
        }
        else{
            const user = await User.create(data)
            res.status(201).json(user);
        }
       
    }
        
    } catch (error) {
        res.json(error)
    }
}

const createaccess = async (req: Request, res: Response)=>{
    try {

        
        //@ts-ignore
        const {email ,pass}  = req.body

        const user: any = _.find(userdata, {email: email })
        
        
        if(user){

          const token =   jwt.sign( {id: user.id, email: user.email},
                
                    process.env.SECKEY,
                    {
                        expiresIn : "45s"
                    }

                )

            //@ts-ignore    
            req.user = user;   
            
            
                
            //@ts-ignore

            res.cookie("accessToken", token,{
                maxAge: 300000,
                httpOnly: true
            })

            

               //@ts-ignore
            // res.json(user); 

            res.redirect('http://localhost:8080/api/session') //change the url during hosting
        }

        else{
            //@ts-ignore
        res.status(401).json({message: "Invalid email or password"})

        }
        
        
    } catch (error) {
        //@ts-ignore
        res.status(401).json({message: "Error occured while loggin in.", error})
        console.log(error)
    }
}

const createsession = async (req: Request, res: Response )=>{
    try {

        const {accessToken} = req.cookies
        if(accessToken){
            const user = await jwt.verify(accessToken, process.env.SECKEY);
            console.log(user)
           if(user){

            const token = jwt.sign( {id: user.id,}, process.env.SECKEY,
                {
                    expiresIn : "65h"
                }

            )

        //@ts-ignore    
            req.user = user;  

        

            res.cookie("refreshToken", token,{
            maxAge: 345600000,
            httpOnly: true
            })
               
           res.json(token);    
        }

        else{
            //@ts-ignore
          res.status(401).json({message: "cannot able to verify token"})

           }
      
        }
    
        else{

            res.cookie("accessToken", "", {
                maxAge: 0,
                httpOnly: true
            })
            res.json("Expired")
            
        }
        
       } catch (error) {
        res.cookie("accessToken", "", {
            maxAge: 0,
            httpOnly: true
        })

        res.cookie("refreshToken", "", {
            maxAge: 0,
            httpOnly: true
        })

        res.json(error)
       }
}


module.exports = {createaccess, createsession,createuser};