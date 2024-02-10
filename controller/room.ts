const Room = require('../model/room')

type data = {
    roomname: string
    adminname: string
    imageurl: string
    active: string[] | null
    chats: string[] | null
    
}

const createroom = async (req: Request, res: Response) =>{
    try {
        //@ts-ignore
    const Data = req.body;
    //@ts-ignore
    const {roomname,adminname,imageurl} = Data;
    if (!(roomname && adminname &&imageurl)){
        //@ts-ignore
        res.status(200).json({message: "All the fields are required"})
    }

    else{
        const room = await Room.create(Data);
        //@ts-ignore
        res.status(201).json(room);
        
    }



    } catch (error) {
        //@ts-ignore
        res.status(400).json(error)
        console.log(error)
    }


}

const findroom = async (req: Request, res: Response) =>{
    try {

        //@ts-ignore
    const {id} = req.body;

    if(!id){
        //@ts-ignore
        res.status(200).json({message: "id required"})
    }
    else{
        const room = await Room.findById(id)
        //@ts-ignore
        res.status(200).json(room);
    }
        
    } catch (error) {
        //@ts-ignore
        res.status(200).json(error)
    }
    

}


module.exports = {createroom, findroom}