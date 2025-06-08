function tugasPing(replyToken, token, rangeSpreadsheet) {
  var url = "https://api.line.me/v2/bot/message/reply";

  // Ambil semua data dari spreadsheet dalam bentuk array 2D
  var data = rangeSpreadsheet.getValues();
  
  // Array untuk menampung daftar tugas yang valid
  var tugasList = [];

  // Pastikan ada tugas yang tersedia (lebih dari hanya header)
  if (data.length > 1) {
    // Loop setiap tugas, mulai dari baris ke-2 (indeks 1) untuk menghindari header
    data.slice(1).forEach((row, index) => {
      var matkul = row[1] ? row[1].trim() : "";  // Mata kuliah
      var judul = row[2] ? row[2].trim() : "";  // Judul tugas
      var countdown = row[7] ? row[7].toString().trim() : "0";  // Countdown hari
      var link = row[5] ? row[5].trim() : " - "; // Jika tidak ada link, tampilkan pesan default
      var link_2 = row[6] ? row[6].trim() : " - ";  // Judul tugas
      // Pastikan tugas memiliki informasi yang cukup untuk ditampilkan
      if (matkul && judul) {
        var nomor = (tugasList.length + 1) + "️⃣"; // Nomor berdasarkan jumlah tugas yang valid
        tugasList.push(`${nomor} ${matkul}\n📋 ${judul}\n⏳ ${countdown} hari lagi\n🔗 ${link}\n🗂 ${link_2}`);
      }
    });
  }

  // Format pesan akhir
  var pesan;
  if (tugasList.length > 0) {
    pesan = `📌 𝐓𝐮𝐠𝐚𝐬 𝐀𝐤𝐭𝐢𝐟!\n================\n\n${tugasList.join("\n\n")}\n\n================\n✅ Jangan lupa dikerjakan dan segera submit!\n📩 Ada kesalahan data? PC divisi akademik. 🚀`;
  } else {
    pesan = `📌 𝐓𝐮𝐠𝐚𝐬 𝐀𝐤𝐭𝐢𝐟!\n================\n\nSaat ini tidak ada tugas aktif.\n\n================\n✅ Nikmati harimu! 📚🚀`;
  }

  var payload = {
    replyToken: replyToken,
    messages: [{
      "type": "text",
      "text": pesan
    }]
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + token
    },
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);
}
