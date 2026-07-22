import express from "express";
import cors from "cors";
import db from "./config/db.config.js";
import "./models/buku.models.js";
import "./models/mahasiswa.models.js";
import "./models/prodi.models.js";
import "./models/pinjam.models.js";
import "./models/detailpinjam.models.js"
import Bukuroutes from "./route/buku.routes.js";
import mahasiswaroutes from "./route/mahasiswa.routes.js";
import prodiroutes from "./route/prodi.routes.js";
import Pinjamroutes from "./route/pinjam.route.js";
//import DetailPinjamroutes from "./route/detailpinjam.route.js";
import routerUser from "./route/user.routes.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/',(req,res)=>{
res.json({message:"Hello coba backend untuk vercel"});
});
app.use("/api/book", Bukuroutes);
app.use("/api/murid", mahasiswaroutes);
app.use("/api/prodi", prodiroutes);
app.use("/api/pinjam", Pinjamroutes);
//app.use("/api/detailpinjam", DetailPinjamroutes);
app.use("/api/user", routerUser);
try {
  await db.authenticate();
  console.log("Database terkoneksi");

  await db.sync({ alter: true });
  console.log("Semua tabel berhasil dibuat");
} catch (error) {
  console.log("Database gagal:", error);
}

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
