import express, {Express, Request,Response,NextFunction} from 'express';
import dotenv from 'dotenv';
dotenv.config()
//@ts-ignore
import jwt from 'jsonwebtoken'

//@ts-ignore
import cookieparser from 'cookie-parser'

//@ts-ignore
import morgan from 'morgan'

//@ts-ignore
import userrouter from './routes/user' 
import e from 'express';


const app: Express = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieparser())

const check = async (req:Request,res: Response, next: NextFunction)=>{

   try {

    const {refreshToken} = req.cookies
    if(refreshToken){
        const user = await jwt.verify(refreshToken,process.env.SECKEY);
       if(user){
        
           next()
       }
  
    }

    else{
        res.json({message: "Login to continue."})
      
        
    }
    
   } catch (error) {
    res.cookie("refreshToken", "",{
        maxAge: 0,
        httpOnly: true
    })

    res.cookie("accessToken", "",{
        maxAge: 0,
        httpOnly: true
    })
    res.json(error)
   }
}



app.use('/api',userrouter)


app.get('/check',check)


app.get('/',(req: Request, res: Response)=>{
    res.send("server  running")
})

app.listen(8080,()=>{
    console.log("server started")
})
