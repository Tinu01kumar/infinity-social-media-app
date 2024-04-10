import mongoose from "mongoose";
const connection=async(username , password)=>{
    const url=`mongodb+srv://${username}:${password}@cluster0.k96vdst.mongodb.net/?retryWrites=true&w=majority`;
    try{
        await mongoose.connect(url, {useNewUrlParser:true});
        console.log('database is connected successfullly');
    }catch(error){
        console.log('error while connecting database ' , error)
    }
};

export default connection;