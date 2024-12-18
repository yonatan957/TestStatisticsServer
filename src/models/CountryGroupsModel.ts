// the country groups collection - amount of attacks in each group in each country - question 4 & 6

import { Document, model, Schema } from "mongoose";

export interface ICountryGroups extends Document {
    country_txt: string;
    groups: { gname: string; count: number }[];
    lat: number;
    lng: number;
}

const CountryGroupsSchema = new Schema<ICountryGroups>({
    country_txt: { type: String, required: true },
    groups: [{ gname: String, count: Number }],
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
});

export default model<ICountryGroups>("CountryGroups", CountryGroupsSchema);