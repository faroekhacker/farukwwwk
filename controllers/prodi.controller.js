import prodi from "../models/prodi.models.js";
import { Sequelize } from "sequelize";

export const getAllProducts = async (req, res) => {
  try {
    const products = await prodi.findAll();
    res.json(products);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const tambahdatabaru = async (req, res) => {
  try {
    const products = await prodi.create(req.body);
    res.json({ "message": "data prodi berhasil disimpan" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const cariprodibykode = async (req, res) => {
  try {
    const products = await prodi.findAll({
      where: {
        kode_prodi: req.params.id
      }
    });
    res.json(products[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const updateprodi= async (req, res) => {
  try {
    const updated = await prodi.update(req.body, {
      where: {
        kode_prodi: req.params.kode_prodi  // diperbaiki: sesuai nama param di route /:kode_prodi
      }
    });

    if (updated[0] === 0) {
      return res.status(404).json({ message: "Data prodi tidak ditemukan" });
    }

    res.json({ "message": "data prodi berhasil update" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const deleteprodi = async (req, res) => {
  try {
    const products = await prodi.destroy({
      where: {
        kode_prodi: req.params.id
      }
    });
    res.json({ "message": "data prodi berhasil dihapus" });
  } catch (error) {
    res.json({ message: error.message });
  }
};