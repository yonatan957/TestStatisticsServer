// the country groups collection - amount of attacks in each group in each country - question 4

import { Document, model, Schema } from "mongoose";

export interface ICountryGroups extends Document {
    country_txt: string;
    groups: {gname: string, count: number}[]
}

const CountryGroupsSchema = new Schema<ICountryGroups>({
    country_txt: {type: String, required: true},
    groups: [{gname: String, count: Number}]
})

export default model<ICountryGroups>("CountryGroups", CountryGroupsSchema);