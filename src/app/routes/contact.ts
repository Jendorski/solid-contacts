import { Router } from "express";
import controllerWrapper from "../adaptors";
import { ContactController } from "../controllers/contact";
import ValidationMiddleware from "../validation";

const { create, findAll, update, deleteAction, findAContact } =
  ContactController;
const { validateNewContact } = ValidationMiddleware;

const router = Router();

router.post("/", validateNewContact, controllerWrapper(create));

router.get("/", controllerWrapper(findAll));

router.get("/a-contact/:id", controllerWrapper(findAContact));

router.patch("/:id", controllerWrapper(update));

router.delete("/:id", controllerWrapper(deleteAction));

export default router;
