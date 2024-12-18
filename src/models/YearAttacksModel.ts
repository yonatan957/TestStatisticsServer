// the year attacks collection - how many attacks happened in each year - question 3

import { model, Schema } from "mongoose"

interface IyearAttacks {
    year: number,
    count: number,
    countKill: number,
    countWound: number
}

const YearAttacksSchema = new Schema<IyearAttacks>({
    year: {type: Number, required: true},
    count: {type: Number, required: true, default: 0},
    countKill: {type: Number, required: true, default: 0},
    countWound: {type: Number, required: true, default: 0}
})

export default model<IyearAttacks>("YearAttacks", YearAttacksSchema);