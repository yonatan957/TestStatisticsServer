import { Router } from "express";
import { addNewEvent, deleteEventById, updateEventById } from "../controllers/eventsController";

const router = Router();

router.post("/", addNewEvent)
router.delete("/:id", deleteEventById);
router.put("/",updateEventById);
export default router