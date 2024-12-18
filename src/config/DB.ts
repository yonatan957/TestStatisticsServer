import { connect } from "mongoose";

export const conectToMongo = async () => {
    try {
        await connect(process.env.DB_URI as string)
        console.log('connected to mongo')
    } catch (error) {
        console.log("can't connect to mongo", error)
    }
}
