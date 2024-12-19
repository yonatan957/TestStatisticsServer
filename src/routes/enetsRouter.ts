import { Router } from "express";
import { addNewEvent } from "../controllers/eventsController";

const router = Router();

router.post("/", addNewEvent)

export default router