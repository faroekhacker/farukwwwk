import { Sequelize } from "sequelize";
import db from "../config/db.config.js";
import ref_prodi from "./prodi.models.js";

const { DataTypes } = Sequelize;

const Mahasiswa = db.define(
  "murid",
  {
    nim: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tempat_lahir: {
      type: DataTypes.STRING,
    },
    tgl_lahir: {
      type: DataTypes.DATE,
    },
    kode_prodi: {
      type: DataTypes.INTEGER,
      references: {
        model: "prodis",
        key: "kode_prodi",
      },
    },
    th_masuk: {
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

// RELASI
ref_prodi.hasMany(Mahasiswa, {
  foreignKey: "kode_prodi",
});

Mahasiswa.belongsTo(ref_prodi, {
  foreignKey: "kode_prodi",
});

export default Mahasiswa;