import express from "express";
import multer from "multer";

import {
  getAllPinjam,
  getDetailPinjam,
  insertPinjam,
  updatePinjam,
  deletePinjam,
  getBukuDipinjamByNim,
  kembalikanBuku,
  getLaporanPengembalian
} from "../controllers/pinjam.controllers.js";

import {
  authenticateToken,
} from "../middleware/VerifyTokens.js";

const router = express.Router();
const upload = multer();
router.get("/", authenticateToken, getAllPinjam);

router.get("/dipinjam/:nim", authenticateToken, getBukuDipinjamByNim);

router.get("/detail/:id", authenticateToken, getDetailPinjam);

// Route untuk laporan pengembalian buku (semua / by NIM)
router.get("/laporan-pengembalian", authenticateToken, getLaporanPengembalian);
router.get("/laporan-pengembalian/:nim", authenticateToken, getLaporanPengembalian);

router.post("/", upload.none(), authenticateToken, insertPinjam);

router.patch("/:id", upload.none(), authenticateToken, updatePinjam);

router.delete("/:id", authenticateToken, deletePinjam);

// Route untuk pengembalian buku (Gabungan array dan kembalikan semua)
router.post("/kembali", upload.none(), authenticateToken, kembalikanBuku);

export default router;