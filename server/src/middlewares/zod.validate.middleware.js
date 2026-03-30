import { boolean, ZodError } from "zod";
import {validationMessages} from "../helper/constants.js";

// ========================= Zod Validation Middleware =========================
const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.parse(req.body);
        req.validatedData = result;
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: validationMessages.invalidData,
                errors: error.issues.map((issue) => ({
                    path: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }
        next(error);
    }
}

export {validate};