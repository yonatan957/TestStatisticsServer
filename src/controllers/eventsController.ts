import { Request, Response } from "express";
import { IEvent } from "../models/EventModel";
import { addEvent } from "../services/dataService";

export const addNewEvent = async (req: Request<any, any, IEvent>, res: Response) => {
    try {
        await addEvent(req.body);
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Error adding event", error: (error as Error).message });
    }
};