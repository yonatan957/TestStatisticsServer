import { connect } from "mongoose";

export const conectToMongo = async () => {
    try {
        await connect(process.env.DB_URI as string)
    } catch (error) {
        console.log("can't connect to mongo", error)
    }
}
