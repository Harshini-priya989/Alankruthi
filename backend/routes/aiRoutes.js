import express from "express";
import { generateDesignSuggestion } from "../controllers/aiController.js";

const router=express.Router();

router.post("/design-suggestion",generateDesignSuggestion);

export default router;
