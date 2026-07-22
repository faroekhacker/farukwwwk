import { Sequelize } from "sequelize";
import db from "../config/db.config.js";
import Pinjam from "./pinjam.models.js";
import Buku from "./buku.models.js";

const { DataTypes } = Sequelize;

const DetailPinjam = db.define(
  "detail_pinjams",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pinjam_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pinjams",
        key: "id",
      },
      onDelete: "CASCADE",  // otomatis hapus detail saat pinjam induk dihapus
    },
    buku_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "bukus",
        key: "kode_buku",
      },
    },
    jml_pinjam: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tanggal_pengembalian: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// RELASI KE PINJAM
DetailPinjam.belongsTo(Pinjam, {
  foreignKey: "pinjam_id",
  as: "Pinjam",
  onDelete: "CASCADE"
});

Pinjam.hasMany(DetailPinjam, {
  foreignKey: "pinjam_id",
  as: "detil_pinjams",
  onDelete: "CASCADE"
});

// RELASI KE BUKU
DetailPinjam.belongsTo(Buku, {
  foreignKey: "buku_id",
  as: "Buku"
});

Buku.hasMany(DetailPinjam, {
  foreignKey: "buku_id",
});

export default DetailPinjam;