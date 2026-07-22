import express from "express";
import multer from "multer";
import {
  getAllProducts,
  tambahdatabaru,
  carimahasiswaBynim,
  updatemahasiswa,
  deletemahasiswa,
} from "../controllers/mahasiswa.controller.js";

import {
  authenticateToken,
} from "../middleware/VerifyTokens.js";

const router = express.Router();
const upload = multer();

router.get("/", authenticateToken, getAllProducts);
router.post("/", upload.none(), authenticateToken, tambahdatabaru);
router.get("/:id", authenticateToken, carimahasiswaBynim);
router.patch("/:id", authenticateToken, updatemahasiswa);
router.delete("/:id", authenticateToken, deletemahasiswa);

export default router;