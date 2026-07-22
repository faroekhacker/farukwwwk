import { Sequelize } from "sequelize";
import db from "../config/db.config.js";
import Mahasiswa from "./mahasiswa.models.js";

const { DataTypes } = Sequelize;

const Pinjam = db.define(
  "pinjams",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tgl_pinjam: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tgl_kembali: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    nim: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "murid",
        key: "nim",
      },
    },
    pegawai_id: {
      type: DataTypes.INTEGER,
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
// RELASI KE MAHASISWA
Pinjam.belongsTo(Mahasiswa, {
  foreignKey: "nim",
  as: "Mahasiswa"
});

Mahasiswa.hasMany(Pinjam, {
  foreignKey: "nim",
  as: "Pinjams"
});

export default Pinjam;