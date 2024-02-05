import express, {Express, Request,Response,NextFunction} from 'express';
import { createServer } from 'http';
import { Server} from 'socket.io'
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config()
import mongoose from 'mongoose';
//@ts-ignore
import jwt from 'jsonwebtoken'

//@ts-ignore
import cookieparser from 'cookie-parser'

//@ts-ignore
import morgan from 'morgan'

//@ts-ignore
import userrouter from './routes/user' 
//@ts-ignore
import roomrouter from './routes/room'


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`mongodb+srv://vidit:${process.env.VIDIT}@cluster0.ip74ash.mongodb.net/?retryWrites=true&w=majority`);
    console.log("Database Connected");
  }


const app: Express = express();
const server = createServer(app);

app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieparser());
app.use(cors())

app.use('/api',userrouter)
app.use('/roomapi',roomrouter)





app.get('/',(req: Request, res: Response)=>{
    res.send("server  running")
})

const check = async (req:Request,res: Response, next: NextFunction)=>{

    try {
 
     const {refreshToken , accessToken} = req.cookies
     if(refreshToken){
         const user = await jwt.verify(refreshToken,process.env.SECKEY);
        if(user){
             if(accessToken){
                 res.json({message: "Logged in successfully"})
                 
             }
             else{
 
                 const token =   jwt.sign( {id: user.id, email: user.email},
                     
                 
                     process.env.SECKEY,
                     {
                         expiresIn : "45s"
                     }
 
                 )
 
                 res.cookie("accessToken",token,{
                     maxAge: 300000,
                     httpOnly: true
                 })
 
                 res.json({message: "Logged in successfully"})
                 
 
             }
            
        }
   
     }
 
     else{
        
         if(accessToken){
 
             res.cookie("accessToken", "",{
                 maxAge: 0,
                 httpOnly: true
             })
             res.json({message: "Login to continue."})
         }
 
         else{
             res.json({message: "Login to continue."})
         }
     }
     
    } catch (error) {
     const {refreshToken , accessToken} = req.cookies;
 
     if(refreshToken && accessToken){
 
         res.cookie("refreshToken", "",{
                 maxAge: 0,
                 httpOnly: true
             })
             
         res.cookie("accessToken", "",{
                     maxAge: 0,
                     httpOnly: true
                 })
                 
         res.status(401).json({message: "Login to continue", error})     
 
     }
 
     else{
 
         res.status(401).json({message: "Login to continue", error})
     }
                 
    }
 }

app.get('/check',check)


let name:string;

const activeuser : string[] = [];

const newuser = (x: string) =>{
     const user = activeuser.concat(x)
    return user;
}

const io = new Server(server,{
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on("chatstart",(msg)=>{
        name = msg;
    })

    socket.on("message", ({ room, mychats }) => {
        console.log({ room, mychats });
        socket.to(room).emit("receive-message", mychats);
      });

    socket.on("status", ({ room, stat }) => {
        console.log({ room, stat });
        socket.to(room).emit("receive-status", stat);
      });

      socket.on('send-name', ({room, name})=>{
        socket.to(room).emit("my-name", name);
      })

      socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
        io.to(room).emit("user-joined",`${name} joined ${room}`)
        io.to(room).emit("active-user",`${name}`)
        

        socket.on('disconnect',()=>{
            io.to(room).emit("user-left",`${name} left ${room}`)
            io.to(room).emit("leeft",`${name}`)
        })
    
      });

      
}
)






server.listen(8080,()=>{
    console.log("server started")
})

