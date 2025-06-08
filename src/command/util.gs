function is_commandActive(command, controlSheet) {
  try {
    var data = controlSheet.getValues(); // Ambil semua data dari sheet

    if (data.length < 2) return false; // Jika tidak ada data (selain header), langsung return false

    var commandMap = new Map();
    
    // Simpan semua command dalam Map untuk pencarian cepat
    for (var i = 1; i < data.length; i++) { // Mulai dari baris ke-2 (index 1)
      commandMap.set(String(data[i][1]).trim().toUpperCase(), String(data[i][2]).trim().toUpperCase());
    }

    // Periksa apakah command ada dan aktif
    return commandMap.get(command.toUpperCase()) === "TRUE";
  } catch (error) {
    return false;
  }
}
