// the year groups collection - amount of attacks in each group in each year - question 5

import { Document, model, Schema } from "mongoose"

export interface IYearGroups extends Document {
    year: number
    groups: {gname: string, count: number}[]
}

const YearGroupsSchema = new Schema<IYearGroups>({
    year: {type: Number, required: true},
    groups: [{gname: String, count: Number}]
});

export default model<IYearGroups>("YearGroups", YearGroupsSchema);