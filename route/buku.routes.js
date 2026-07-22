import express from "express";
import multer from "multer";
import {
  getAllProducts,
  tambahbukubaru,
  cariBukuByID,
  updateBuku,
  deleteBuku,
} from "../controllers/buku.controllers.js";
import {
  authenticateToken,
} from "../middleware/VerifyTokens.js";

const router = express.Router();
const upload = multer();

router.get("/",authenticateToken, getAllProducts);
router.post("/", upload.none(), authenticateToken, tambahbukubaru);
router.get("/:id", authenticateToken, cariBukuByID);
router.patch("/:id", authenticateToken, updateBuku);
router.delete("/:id", authenticateToken, deleteBuku);

export default router;