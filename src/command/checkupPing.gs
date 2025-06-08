function checkupPing(replyToken, accessToken, inputPrompt, sheetToCheck, sheetBiodata) {
  try {
    var parts = inputPrompt.split("-");
    if (parts.length !== 2) {
      sendReply(replyToken, accessToken, "❌ Format salah! Gunakan: !pany checkup instancekey-nim2/nama/kelompok.");
      return;
    }

    var instanceKey = parts[0].trim().toLowerCase();
    var targetKeyword = parts[1].trim().toLowerCase();

    var dataBiodata = sheetBiodata.getDataRange().getValues();
    var headers = dataBiodata[0];

    var nim1Index = headers.indexOf("NIM1");
    var nim2Index = headers.indexOf("NIM2");
    var namaPanggilanIndex = headers.indexOf("Nama Panggilan");
    var namaLengkapIndex = headers.indexOf("Nama Lengkap");
    var kelompokIndex = headers.indexOf("Kelompok");

    if (nim1Index === -1 || nim2Index === -1 || namaPanggilanIndex === -1 || namaLengkapIndex === -1 || kelompokIndex === -1) {
      sendReply(replyToken, accessToken, "❌ Struktur sheet biodata tidak sesuai.");
      return;
    }

    var targetStudents = [];

    if (!isNaN(targetKeyword) && targetKeyword.length <= 2) {
      for (var i = 1; i < dataBiodata.length; i++) {
        if (String(dataBiodata[i][kelompokIndex]).toLowerCase() === targetKeyword) {
          targetStudents.push({
            nim1: dataBiodata[i][nim1Index],
            namaLengkap: dataBiodata[i][namaLengkapIndex]
          });
        }
      }
      if (targetStudents.length === 0) {
        sendReply(replyToken, accessToken, "❌ Tidak ada mahasiswa di kelompok '" + targetKeyword + "'.");
        return;
      }
    } else {
      for (var i = 1; i < dataBiodata.length; i++) {
        if (String(dataBiodata[i][nim2Index]).toLowerCase() === targetKeyword ||
            String(dataBiodata[i][namaPanggilanIndex]).toLowerCase() === targetKeyword) {
          targetStudents.push({
            nim1: dataBiodata[i][nim1Index],
            namaLengkap: dataBiodata[i][namaLengkapIndex]
          });
          break;
        }
      }
      if (targetStudents.length === 0) {
        sendReply(replyToken, accessToken, "❌ Mahasiswa dengan NIM2/Nama '" + targetKeyword + "' tidak ditemukan.");
        return;
      }
    }

    var dataCheck = sheetToCheck.getDataRange().getValues();
    var foundInstance = null;
    for (var j = 1; j < dataCheck.length; j++) {
      if (String(dataCheck[j][1]).toLowerCase() === instanceKey) {
        foundInstance = {
          title: dataCheck[j][0],
          folderIds: String(dataCheck[j][2]).split(/\s*[\n,]\s*/).filter(id => id.length > 5)
        };
        break;
      }
    }

    if (!foundInstance) {
      sendReply(replyToken, accessToken, "❌ Instance dengan key '" + instanceKey + "' tidak ditemukan.");
      return;
    }

    // ================== OPTIMIZED ==================
    var folderFilesMap = {}; // {folderName: [list of file names]}
    
    for (var f = 0; f < foundInstance.folderIds.length; f++) {
      var folderId = foundInstance.folderIds[f];
      try {
        var folder = DriveApp.getFolderById(folderId);
        var folderName = folder.getName();
        var fileNames = [];
        var files = folder.getFiles();
        while (files.hasNext()) {
          var file = files.next();
          fileNames.push(file.getName());
        }
        folderFilesMap[folderName] = fileNames;
      } catch (error) {
        Logger.log(`⚠️ Folder ID ${folderId} error. Diskip.`);
      }
    }

    var finalChecklist = `📤 𝐂𝐡𝐞𝐜𝐤𝐮𝐩 𝐏𝐞𝐧𝐠𝐮𝐦𝐩𝐮𝐥𝐚𝐧\n====================\n📚 Instance: ${foundInstance.title}\n`;

    for (var s = 0; s < targetStudents.length; s++) {
      var student = targetStudents[s];
      finalChecklist += `\n👤 Nama: ${student.namaLengkap}\n🆔 NIM: ${student.nim1}\n`;

      var idx = 1;
      for (var folderName in folderFilesMap) {
        var fileNames = folderFilesMap[folderName];
        var found = fileNames.some(name => name.includes(student.nim1));
        finalChecklist += `[${found ? "✅" : "❌"}] : ${folderName}\n`;
      }
      finalChecklist += "====================\n";
    }

    sendReply(replyToken, accessToken, finalChecklist);

  } catch (error) {
    sendReply(replyToken, accessToken, "❌ Error saat melakukan checkup: " + error.toString());
  }
}
