function addtugas(db_sheet, input_data, replyToken, accessToken) {
  // Cek apakah input dimulai dengan "nform1"

    if (!input_data || input_data.trim() === "!pany addtugas") {
    var templateMessage = "📌 𝐏𝐞𝐝𝐨𝐦𝐚𝐧 𝐏𝐞𝐧𝐜𝐚𝐭𝐚𝐭𝐚𝐧 𝐓𝐮𝐠𝐚𝐬\n" +
                          "======================\n" +
                          "Gunakan format berikut untuk menambahkan tugas:\n\n================\n" +
                          "!pany addtugas ep25drive\n\n" +
                          "Matkul:\"XXMATKULXX\"\n" +
                          "Judul:\"XXJUDULXX\"\n" +
                          "Desc:\"XXDESCXX\"\n" +
                          "Deadline:\"MM/DD/YYYY\"\n" +
                          "Link:\"XXOPTIONALXX\"\n================\n\n" +
                          "🔄 Ganti placeholder XX dengan data tugas yang sesuai.";
    return sendReply(replyToken, accessToken, templateMessage);
  }

  if (!input_data.startsWith("ep25drive")) {
    //Logger.log("❌ Format input salah!");
    return sendReply(replyToken, accessToken, "❌ Database Tidak Tersedia, Gunakan : ep25drive !");
  }

  // Parsing input user
  var tugas = parseTugas(input_data);

  // Validasi: Pastikan semua data yang dibutuhkan ada
  if (!tugas.matkul || !tugas.judul || !tugas.desc || !tugas.deadline) {
    Logger.log("❌ Data tugas tidak lengkap!");
    return sendReply(replyToken, accessToken, "❌ Data tugas tidak lengkap! Pastikan format benar!." + tugas);
  }

  // Default link jika tidak diberikan
  if (!tugas.link) {
    tugas.link = "Tidak ada link";
  }

  // Hitung countdown hari berdasarkan Deadline
  var today = new Date();
  var deadlineDate = new Date(tugas.deadline);

  // Ambil ID terakhir untuk tugas baru
  var lastRow = db_sheet.getLastRow();
  var nextID = lastRow > 0 ? lastRow + 1 : 1;

  // Tambahkan data ke spreadsheet
  db_sheet.appendRow([
    nextID,         // ID tugas
    tugas.matkul,   // Mata kuliah
    tugas.judul,    // Judul tugas
    tugas.desc,     // Deskripsi
    deadlineDate, // Deadline
    tugas.link,     // Link pendukung
  ]);

  // Buat pesan rekapitulasi tugas yang telah ditambahkan
  var responseMessage = `𝐓𝐮𝐠𝐚𝐬 𝐁𝐞𝐫𝐡𝐚𝐬𝐢𝐥 𝐃𝐢𝐭𝐚𝐦𝐛𝐚𝐡𝐤𝐚𝐧! ✅  \n` +
                        `📥 Database : ep25drive\n\n` +
                        ' ======================= \n' +
                        `📌 𝗷𝘂𝗱𝘂𝗹: ${tugas.judul}\n` +
                        `📚 𝗠𝗮𝘁𝗮 𝗞𝘂𝗹𝗶𝗮𝗵: ${tugas.matkul}\n` +
                        `📝 𝗗𝗲𝘀𝗸𝗿𝗶𝗽𝘀𝗶: ${tugas.desc}\n` +
                        `⏳ 𝗗𝗲𝗮𝗱𝗹𝗶𝗻𝗲: ${tugas.deadline}\n` +
                        `🔗 𝗟𝗶𝗻𝗸: ${tugas.link}`;
                        ' ======================= \n' +

  // Kirim respon ke pengguna melalui API LINE
  sendReply(replyToken, accessToken, responseMessage);
}

// Fungsi untuk memparsing input user
function parseTugas(text) {
  var lines = text.split("\n"); // Pecah teks berdasarkan baris
  var tugas = {}; // Objek untuk menyimpan hasil parsing

  lines.forEach(function (line) {
    var match = line.match(/^(\w+):\s*"(.+)"$/); // Regex menangkap format Key: "Value"
    if (match) {
      var key = match[1].toLowerCase(); // Ubah key jadi lowercase
      var value = match[2]; // Ambil nilai dari dalam tanda kutip
      tugas[key] = value;
    }
  });

  return tugas; // Mengembalikan objek hasil parsing
}

// Fungsi untuk mengirim pesan ke pengguna via LINE
function sendReply(replyToken, accessToken, message) {
  var url = "https://api.line.me/v2/bot/message/reply";
  var payload = {
    replyToken: replyToken,
    messages: [{
      "type": "text",
      "text": message
    }]
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + accessToken
    },
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);
}
