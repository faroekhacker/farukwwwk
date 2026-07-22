import express from "express";
import multer from "multer";
import {
  getAllProducts,
  tambahdatabaru,
  cariprodibykode,
  updateprodi,
  deleteprodi,
} from "../controllers/prodi.controller.js";

import {
  authenticateToken,
} from "../middleware/VerifyTokens.js";

const router = express.Router();
const upload = multer();

router.get("/", authenticateToken, getAllProducts);
router.post("/", upload.none(), authenticateToken, tambahdatabaru);
router.get("/:id", authenticateToken, cariprodibykode);
router.patch("/:kode_prodi", authenticateToken, updateprodi);
router.delete("/:id", authenticateToken, deleteprodi);

export default router;