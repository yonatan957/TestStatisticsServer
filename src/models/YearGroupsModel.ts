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
