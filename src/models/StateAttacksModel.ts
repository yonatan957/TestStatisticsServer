// the country attacks collection - how many attacks happened in each country - question 2

import { Document, model, Schema } from "mongoose";

export interface ICountryAttacks extends Document{
    country_txt: string,
    count: number,
    countKill: number,
    countWound: number,
    latitude: number,
    longitude: number
}

export const CountryAttacksSchema = new Schema<ICountryAttacks>({
    country_txt: {type: String, required: true},
    count: {type: Number, required: true, default: 0},
    countKill: {type: Number, required: true, default: 0},
    countWound: {type: Number, required: true, default: 0},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true}
})

export default model<ICountryAttacks>("CountryAttacks", CountryAttacksSchema);