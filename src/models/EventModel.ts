// the general events collection

import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
    eventid?: number;
    iyear: number;
    imonth: number;
    iday: number;
    country_txt: string;
    region_txt: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    attacktype1_txt: string;
    targtype1_txt: string;
    target1?: string;
    gname: string;
    weaptype1_txt: string;
    nkill?: number;
    nwound?: number;
    ransomamt?: number;
    summary?: string;
    nperps?: number;
}

const EventSchema = new Schema<IEvent>({
    eventid: { type: Number, required: false, unique: false },
    iyear: { type: Number, required: true },
    imonth: { type: Number, required: true },
    iday: { type: Number, required: true },
    country_txt: { type: String, required: true },
    region_txt: { type: String, required: true },
    city: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    attacktype1_txt: { type: String, required: true },
    targtype1_txt: { type: String, required: true },
    target1: { type: String },
    gname: { type: String, required: true },
    weaptype1_txt: { type: String, required: true },
    nkill: { type: Number, default: 0 },
    nwound: { type: Number, default: 0 },
    ransomamt: { type: Number, default: 0 },
    summary: { type: String },
    nperps: { type: Number, default: 1 },
});

export default mongoose.model<IEvent>("Event", EventSchema);