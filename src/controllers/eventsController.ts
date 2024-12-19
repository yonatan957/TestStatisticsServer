import { Request, Response } from "express";
import { IEvent } from "../models/EventModel";
import { addEvent, deleteEvent, updateEvent } from "../services/dataService";

export const addNewEvent = async (req: Request<any, any, IEvent>, res: Response) => {
    try {
        await addEvent(req.body);
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Error adding event", error: (error as Error).message });
    }
};

export const deleteEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const resulst = await deleteEvent(id);
        res.status(200).json({ message: "Event deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error: (error as Error).message });
    }
};

export const updateEventById = async (req: Request<any, any, IEvent>, res: Response) => {
    try {
        const resulst = await updateEvent(req.body);
        res.status(200).json({ message: "Event updated" });
    } catch (error) {
        res.status(500).json({ message: "Error updating event", error: (error as Error).message });
    }
};