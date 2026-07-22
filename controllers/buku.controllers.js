import Buku from "../models/buku.models.js";
import { Sequelize } from "sequelize";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Buku.findAll();
    res.json(products);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const tambahbukubaru = async (req, res) => {
  try {
    const products = await Buku.create(req.body);
    res.json({ "message": "Buku berhasil disimpan" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const cariBukuByID = async (req, res) => {
  try {
    const products = await Buku.findAll({
      where: {
        kode_buku: req.params.id
      }
    });
    res.json(products[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const updateBuku = async (req, res) => {
  try {
    const products = await Buku.update(req.body, {
      where: {
        kode_buku: req.params.id
      }
    });
    res.json({ "message": "Buku berhasil update" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const deleteBuku = async (req, res) => {
  try {
    const products = await Buku.destroy({
      where: {
        kode_buku: req.params.id
      }
    });
    res.json({ "message": "Buku berhasil dihapus" });
  } catch (error) {
    res.json({ message: error.message });
  }
};