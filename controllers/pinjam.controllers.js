import Pinjam from "../models/pinjam.models.js";
import Mahasiswa from "../models/mahasiswa.models.js";
import DetilPinjam from "../models/detailpinjam.models.js";
import Buku from "../models/buku.models.js";
import sequelize from "../config/db.config.js";

// 1. Ambil semua data pinjam
export const getAllPinjam = async (req, res) => {
  try {
    const data = await Pinjam.findAll({
      include: [
        {
          model: Mahasiswa,
          as: "Mahasiswa",
        },
        {
          model: DetilPinjam,
          as: "detil_pinjams",
          include: [
            {
              model: Buku,
              as: "Buku",
            },
          ],
        },
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 3. Detail pinjam by ID

export const getDetailPinjam = async (req, res) => {
  try {
    const data = await Pinjam.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Mahasiswa,
          as: "Mahasiswa",
          attributes: ["nama"],
        },
        {
          model: DetilPinjam,
          as: "detil_pinjams",
          include: [
            {
              model: Buku,
              as: "Buku",
            },
          ],
        },
      ],
    });

    if (!data) {
      return res.status(404).json({
        message: "Detail pinjam tidak ditemukan",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 4. Tambah pinjam

export const insertPinjam = async (req, res) => {
  try {
    // Auto-set status = 1 (dipinjam) untuk setiap detail pinjam
    const detilPinjams = req.body.detil_pinjams.map((item) => ({
      buku_id: item.buku_id,
      jml_pinjam: item.jml_pinjam,
      status: 1, // otomatis status 1 saat peminjaman
    }));

    const pinjam = await Pinjam.create( //ini adalah proses create data pinjam
      {
        tgl_pinjam: req.body.tgl_pinjam,
        tgl_kembali: req.body.tgl_kembali,
        nim: req.body.nim,
        pegawai_id: req.body.pegawai_id,
        detil_pinjams: detilPinjams,
      },
      {
        include: [
          {
            model: DetilPinjam,
            as: "detil_pinjams",
          },
        ],
      }
    );
    // Kurangi stok buku
    if (pinjam && detilPinjams) { //ini adalah proses mengurangi stok buku
      for (let i = 0; i < detilPinjams.length; i++) { //cara menghitung ini adalah untuk mengulang setiap data dengan jalan nya mengurangkan stok buku
        const buku = await Buku.findByPk(detilPinjams[i].buku_id); //ini adalah proses mencari buku berdasarkan id
        if (buku) { //ini adalah proses mengecek apakah buku ditemukan
          await buku.update({ jumlah: buku.jumlah - detilPinjams[i].jml_pinjam }); //ini adalah proses mengupdate jumlah buku
        }
      }
    }
    res.status(201).json(pinjam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 5. Update pinjam

export const updatePinjam = async (req, res) => {
  try {
    const updated = await Pinjam.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated[0] === 0) {
      return res.status(404).json({
        message: "Data pinjam tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Data pinjam berhasil diupdate",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Hapus pinjam
export const deletePinjam = async (req, res) => {
  try {
    const id = req.params.id;

    // Cek apakah data pinjam ada
    const pinjam = await Pinjam.findOne({ where: { id } });
    if (!pinjam) {
      return res.status(404).json({ message: "Data pinjam tidak ditemukan" });
    }

    // Ambil semua detail pinjam yang masih berstatus dipinjam (status 1)
    // agar stok buku dikembalikan sebelum dihapus
    const detilMasihDipinjam = await DetilPinjam.findAll({
      where: { pinjam_id: id, status: 1 }
    });

    // Kembalikan stok buku untuk buku yang masih dipinjam
    for (const detil of detilMasihDipinjam) {
      const buku = await Buku.findByPk(detil.buku_id);
      if (buku) {
        await buku.update({ jumlah: buku.jumlah + detil.jml_pinjam });
      }
    }

    // Hapus semua detail pinjam terlebih dahulu (hindari foreign key constraint)
    await DetilPinjam.destroy({ where: { pinjam_id: id } });

    // Hapus data pinjam
    await Pinjam.destroy({ where: { id } });

    res.status(200).json({ message: "Data pinjam berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 10. Cari buku yang sedang dipinjam berdasarkan NIM

export const getBukuDipinjamByNim = async (req, res) => {
  try {
    const data = await DetilPinjam.findAll({
      where: { status: [1, 2] },
      include: [
        {
          model: Pinjam,
          as: "Pinjam", //as merupakan nama alias dari model yang memudahkan ketika satu tabel punya berbagai relasi
          where: { nim: req.params.nim },
          include: [
            {
              model: Mahasiswa,
              as: "Mahasiswa",
              attributes: ["nama"],
            },
          ],
        },
        {
          model: Buku,
          as: "Buku",
          attributes: ["judul"],
        },
      ],
    });

    const result = data.map((item) => ({
      nama_mahasiswa: item.Pinjam.Mahasiswa.nama, //mengambil nama mahasiswa dari relasi pinjam -> mahasiswa
      judul_buku: item.Buku.judul, //mengambil judul buku dari relasi detil pinjam -> buku
      jumlah_dipinjam: item.jml_pinjam,
      id_detil_pinjam: item.id,
      pinjam_id: item.pinjam_id,
      buku_id: item.buku_id,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 11. Pengembalian Buku (mendukung 1 buku atau banyak buku sekaligus)
export const kembalikanBuku = async (req, res) => {
  try {
    // Tentukan apakah input berupa array (banyak buku) atau single object (1 buku)
    let dataKembali = []; // array untuk menampung data pengembalian 

    if (req.body.data_kembali && Array.isArray(req.body.data_kembali)) {
      // Format array: { data_kembali: [{ id_pinjam, id_buku, jumlah_pengembalian }, ...] }
      dataKembali = req.body.data_kembali;
    } else if (req.body.id_pinjam && req.body.id_buku && req.body.jumlah_pengembalian) {
      // Format single: { id_pinjam, id_buku, jumlah_pengembalian }
      dataKembali = [req.body];
    } else {
      return res.status(400).json({
        message: "Input tidak valid. Kirim { id_pinjam, id_buku, jumlah_pengembalian } atau { data_kembali: [...] }"
      });
    }

    const hasilPengembalian = []; // array untuk menampung hasil pengembalian 

    for (let i = 0; i < dataKembali.length; i++) { //looping untuk memproses setiap data pengembalian
      const id_pinjam = parseInt(dataKembali[i].id_pinjam); //mengambil id pinjam dari data pengembalian
      const id_buku = parseInt(dataKembali[i].id_buku); //mengambil id buku dari data pengembalian
      const jumlah_pengembalian = parseInt(dataKembali[i].jumlah_pengembalian); //mengambil jumlah pengembalian dari data pengembalian

      // Validasi input per item
      if (isNaN(id_pinjam) || isNaN(id_buku) || isNaN(jumlah_pengembalian)) { //isNan adalah fungsi untuk mengecek apakah data adalah bukan angka
        return res.status(400).json({
          message: `Data ke-${i + 1} tidak lengkap. Harap kirim id_pinjam, id_buku, dan jumlah_pengembalian.` //arti dari ${i + 1} adalah posisi ke berapa dari data pengembalian
        });
      }

      if (jumlah_pengembalian <= 0) {
        return res.status(400).json({
          message: `Data ke-${i + 1}: Jumlah pengembalian harus lebih dari 0.`
        });
      }

      // Cari detail pinjam berdasarkan pinjam_id dan buku_id yang masih dipinjam
      // status 1 = dipinjam, status 2 = sudah pernah dikembalikan sebagian
      const detil = await DetilPinjam.findOne({
        where: {
          pinjam_id: id_pinjam,
          buku_id: id_buku,
          status: [1, 2] // status 1 = dipinjam, status 2 = sudah pernah dikembalikan sebagian 
        },
        include: [
          {
            model: Pinjam,
            as: "Pinjam",
            include: [{ model: Mahasiswa, as: "Mahasiswa", attributes: ["nama"] }]
          },
          {
            model: Buku,
            as: "Buku",
            attributes: ["judul", "jumlah"]
          }
        ]
      });

      if (!detil) {
        return res.status(404).json({
          message: `Data ke-${i + 1}: Pinjaman tidak ditemukan (id_pinjam: ${id_pinjam}, id_buku: ${id_buku}). Pastikan data benar dan buku masih dipinjam.`
        });
      }

      // Validasi jumlah pengembalian tidak melebihi jumlah yang dipinjam
      if (jumlah_pengembalian > detil.jml_pinjam) {
        return res.status(400).json({
          message: `Data ke-${i + 1}: Jumlah pengembalian (${jumlah_pengembalian}) melebihi jumlah yang dipinjam (${detil.jml_pinjam}).`//cara kerja kode ini adalah membandingkan jumlah pengembalian dengan jumlah yang dipinjam
        });//cara mengitung variabel ${i + 1} adalah posisi ke berapa dari data pengembalian, sedangkan ${jumlah_pengembalian} adalah jumlah pengembalian
      }

      if (jumlah_pengembalian === detil.jml_pinjam) { //ini adalah kondisi jika jumlah pengembalian sama dengan jumlah yang dipinjam
        // Pengembalian penuh (sisa = 0): ubah status menjadi 0
        await DetilPinjam.update(
          { status: 0, jml_pinjam: 0, tanggal_pengembalian: new Date() },
          { where: { id: detil.id } }
        );
      } else {
        // Pengembalian sebagian: buat baris baru untuk riwayat pengembalian dengan status 2
        await DetilPinjam.create({
          pinjam_id: id_pinjam,
          buku_id: id_buku,
          jml_pinjam: jumlah_pengembalian, //cara ngitungnya dengan cara mengurangi
          //  jumlah pengembalian yang sudah pernah dikembalikan dengan jumlah pengembalian yang baru
          status: 2, // 2 = Dikembalikan
          tanggal_pengembalian: new Date()
        });

        // Update baris lama dengan sisa pinjam yang belum dikembalikan (status tetap 1 = dipinjam)
        await DetilPinjam.update(
          {
            jml_pinjam: detil.jml_pinjam - jumlah_pengembalian, //cara menghitung ini adalah mengurangi jumlah pinjaman dengan jumlah pengembalian
            status: 1
          },
          { where: { id: detil.id } }
        );
      }

      // Sinkronisasi stok buku (tambah kembali jumlah buku)
      const buku = await Buku.findByPk(id_buku);
      if (buku) {
        await buku.update({ jumlah: buku.jumlah + jumlah_pengembalian });
      }

      hasilPengembalian.push({
        nama_mahasiswa: detil.Pinjam?.Mahasiswa?.nama || "-",
        judul_buku: detil.Buku?.judul || "-",
        jumlah_dikembalikan: jumlah_pengembalian,
        sisa_pinjam: detil.jml_pinjam - jumlah_pengembalian,
        status: jumlah_pengembalian === detil.jml_pinjam ? "Lunas" : "Masih ada sisa pinjaman"
      });
    }

    return res.status(200).json({
      message: "Pengembalian buku berhasil diproses.",
      data: hasilPengembalian
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 12. Laporan Pengembalian Buku (semua / berdasarkan NIM)
export const getLaporanPengembalian = async (req, res) => {
  try {
    // Konfigurasi include untuk Pinjam
    // Jika req.params.nim ada, tambahkan filter where nim
    const pinjamInclude = {
      model: Pinjam,
      as: "Pinjam",
      include: [
        {
          model: Mahasiswa,
          as: "Mahasiswa",
          attributes: ["nama"],
        },
      ],
    };

    // Jika ada parameter NIM, tambahkan filter
    if (req.params.nim) {
      pinjamInclude.where = { nim: req.params.nim }; //mengambil data berdasarkan nim
    }

    const data = await DetilPinjam.findAll({
      where: { status: [0, 2] }, //mengambil data berdasarkan status
      include: [
        pinjamInclude,
        {
          model: Buku,
          as: "Buku",
          attributes: ["judul"],
        },
      ],
    });

    if (data.length === 0) {
      return res.status(404).json({
        message: req.params.nim
          ? `Tidak ada data pengembalian untuk NIM: ${req.params.nim}`
          : "Tidak ada data pengembalian."
      });
    }

    const result = data.map((item) => { //kegunaannya untuk memproses setiap data pengembalian
      let hari_terlambat = 0;

      // Jika memiliki tanggal pengembalian dan tanggal target kembali
      if (item.tanggal_pengembalian && item.Pinjam && item.Pinjam.tgl_kembali) {
        const tglHarusKembali = new Date(item.Pinjam.tgl_kembali); //mengambil tanggal harus kembali
        const tglAktualKembali = new Date(item.tanggal_pengembalian); //mengambil tanggal aktual kembali

        // Hitung selisih waktu dalam milisecond
        const selisihWaktu = tglAktualKembali.getTime() - tglHarusKembali.getTime(); //cara menghitung ini adalah mengurangkan tanggal aktual kembali dengan tanggal harus kembali
        //tglaktual adalah waktu saat ini
        // Konversi milisecond ke hari
        const selisihHari = Math.ceil(selisihWaktu / (1000 * 3600 * 24)); //cara mengkonversi milisecond ke hari adalah dengan membagi selisih waktu dengan 1000 * 3600 * 24

        // Jika selisih positif, maka dia terlambat
        if (selisihHari > 0) { //ini adalah kondisi jika selisih hari lebih dari 0
          hari_terlambat = selisihHari; //ini adalah variabel yang akan diisi
        }
      }

      return {
        nama_mahasiswa: item.Pinjam?.Mahasiswa?.nama || "Tidak diketahui", //mengambil nama mahasiswa
        nama_buku: item.Buku?.judul || "Tidak diketahui", //mengambil nama buku
        jumlah_pinjam: item.jml_pinjam, //mengambil jumlah pinjam
        status: item.status === 0 ? "Sudah dikembalikan semua" : "Dikembalikan sebagian", //mengambil status
        tanggal_pengembalian: item.tanggal_pengembalian, //mengambil tanggal pengembalian
        jumlah_hari_terlambat: hari_terlambat, //mengambil jumlah hari terlambat
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};