import http from "http";
import qs from "querystring";

http.createServer(function (request, response) {
  if (request.url === "/") {
    switch (request.method) {
      case "GET":
        // Saat pertama kali dibuka, hasil kosong
        tampilkanHalaman(response, "");
        break;
      case "POST":
        simpanData(request, response);
        break;
      default:
        badRequest(response);
    }
  } else {
    notFound(response);
  }
}).listen(8000);

// Fungsi utama untuk merender HTML agar kode lebih rapi (DRY - Don't Repeat Yourself)
function tampilkanHalaman(response, hasilInput) {
  const html = `
    <html>
      <head>
        <title>Peminjaman Buku</title>
      </head>
      <body>
        <h1>Daftar Buku</h1>
        <form method="POST" action="/">
          <p><input type="text" name="buku" placeholder="Masukkan nama buku"></p>
          <p><input type="submit" value="Simpan"></p>
        </form>
        <p><b>${hasilInput}</b></p>
      </body>
    </html>`;

  response.setHeader("Content-Type", "text/html");
  response.setHeader("Content-Length", Buffer.byteLength(html));
  response.end(html);
}

function simpanData(request, response) {
  let body = "";

  request.setEncoding("utf-8");

  request.on("data", function (chunk) {
    body += chunk;
  });

  request.on("end", function () {
    const data = qs.parse(body);
    const namaBuku = data.buku || "";
    
    // Memanggil kembali fungsi tampilkanHalaman dengan membawa data input
    // Input box akan otomatis kosong karena kita merender ulang form dari awal
    tampilkanHalaman(response, namaBuku);
  });
}

function badRequest(response) {
  response.statusCode = 400;
  response.setHeader("Content-Type", "text/plain");
  response.end("400 - Bad Request");
}

function notFound(response) {
  response.statusCode = 404;
  response.setHeader("Content-Type", "text/plain");
  response.end("404 - Not Found");
}

console.log("Server running on http://localhost:8000");