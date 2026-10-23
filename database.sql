-- Database: mengenal_sudut
-- Dibuat untuk Website Pembelajaran Etnomatematika Kraton Yogyakarta

CREATE DATABASE IF NOT EXISTS `mengenal_sudut` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mengenal_sudut`;

-- Tabel untuk menyimpan hasil evaluasi siswa
CREATE TABLE IF NOT EXISTS `evaluasi_siswa` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama_siswa` VARCHAR(100) NOT NULL,
    `kelas` VARCHAR(20) DEFAULT 'V (Lima)',
    `skor` INT NOT NULL,
    `total_soal` INT NOT NULL,
    `jawaban_pilihan` TEXT,
    `jawaban_uraian` TEXT,
    `refleksi` TEXT,
    `tanggal` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk menyimpan log game Detektif Sudut
CREATE TABLE IF NOT EXISTS `skor_detektif` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama_pemain` VARCHAR(100) NOT NULL,
    `skor` INT NOT NULL,
    `waktu_selesai` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
