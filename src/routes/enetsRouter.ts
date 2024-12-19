import { Router } from "express";
import { addNewEvent, deleteEventById } from "../controllers/eventsController";

const router = Router();

router.post("/", addNewEvent)
router.delete("/:id", deleteEventById);

export default router