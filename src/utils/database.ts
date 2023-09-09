import mongoose from "mongoose"


mongoose.connection.on('connection', ()=> {
    console.log('connected to database')
})


mongoose.connection.on('error', ()=> {
    console.log('error connecting to database')
})


mongoose.set('debug', true)

export const connectToDb = async() => {
    try {
        await mongoose.connect(process.env.DB_URL, { autoIndex: false, })
    } catch (e) {
        console.log('error connecting to db ', e)
    }
}
