import mongoose from "mongoose";

const Schema  = mongoose.Schema;


const Roomschema = new Schema({

    roomname: String,
    adminname: String,
    imageurl: String,
    active: {type: Array , default: []},
    chats: {type: Array , default: []},
    date: {type: Date, default: Date.now}

});

module.exports = mongoose.model('rooms', Roomschema);