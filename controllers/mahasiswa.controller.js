import mahasiswa from "../models/mahasiswa.models.js";
import ref_prodi from "../models/prodi.models.js";

// Ambil semua data mahasiswa + prodi
export const getAllProducts = async (req, res) => {
  try {
    const data = await mahasiswa.findAll({
      include: [
        {
          model: ref_prodi,
          attributes: ["nama_prodi"],
        },
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tambah data mahasiswa
export const tambahdatabaru = async (req, res) => {
  try {
    await mahasiswa.create(req.body);
    res.status(201).json({
      message: "Data mahasiswa berhasil disimpan",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cari mahasiswa berdasarkan NIM
export const carimahasiswaBynim = async (req, res) => {
  try {
    const data = await mahasiswa.findOne({
      where: {
        nim: req.params.id,
      },
      include: [
        {
          model: ref_prodi,
          attributes: ["nama_prodi"],
        },
      ],
    });

    if (!data) {
      return res.status(404).json({
        message: "Data mahasiswa tidak ditemukan",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update data mahasiswa
export const updatemahasiswa = async (req, res) => {
  try {
    const updated = await mahasiswa.update(req.body, {
      where: {
        nim: req.params.id,
      },
    });

    if (updated[0] === 0) {
      return res.status(404).json({
        message: "Data mahasiswa tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Data mahasiswa berhasil diupdate",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hapus data mahasiswa
export const deletemahasiswa = async (req, res) => {
  try {
    const deleted = await mahasiswa.destroy({
      where: {
        nim: req.params.id,
      },
    });

    if (deleted === 0) {
      return res.status(404).json({
        message: "Data mahasiswa tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Data mahasiswa berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};