-- Insert sample puskesmas
INSERT INTO puskesmas (nama, kode, alamat, telepon, email) VALUES
('Puskesmas Cibadak', 'PKM001', 'Jl. Raya Cibadak No. 123, Sukabumi', '0266-123456', 'cibadak@puskesmas.sukabumi.go.id'),
('Puskesmas Sukabumi Utara', 'PKM002', 'Jl. Ahmad Yani No. 45, Sukabumi', '0266-234567', 'sukabumi.utara@puskesmas.sukabumi.go.id'),
('Puskesmas Pelabuhan Ratu', 'PKM003', 'Jl. Siliwangi No. 78, Pelabuhan Ratu', '0266-345678', 'palabuhanratu@puskesmas.sukabumi.go.id'),
('Puskesmas Cicurug', 'PKM004', 'Jl. Raya Cicurug No. 90, Sukabumi', '0266-456789', 'cicurug@puskesmas.sukabumi.go.id'),
('Puskesmas Cisolok', 'PKM005', 'Jl. Pantai Cisolok No. 12, Sukabumi', '0266-567890', 'cisolok@puskesmas.sukabumi.go.id')
ON CONFLICT (kode) DO NOTHING;

-- Insert sample bundle
INSERT INTO bundles (tahun, judul, status, deskripsi) VALUES
(2024, 'Bundle PKP 2024', 'active', 'Bundle Penilaian Kinerja Puskesmas untuk tahun 2024 dengan 6 klaster utama')
ON CONFLICT (tahun) DO NOTHING;

-- Get bundle_id for 2024 and insert all data
DO $$
DECLARE
    bundle_2024_id integer;
    klaster_1_id integer;
    klaster_2_id integer;
    klaster_3_id integer;
    klaster_4_id integer;
    klaster_5_id integer;
    klaster_6_id integer;
    current_indikator_id integer;
    klaster_exists boolean;
BEGIN
    SELECT id INTO bundle_2024_id FROM bundles WHERE tahun = 2024;
    
    -- Check if klasters already exist for this bundle
    SELECT EXISTS(SELECT 1 FROM klasters WHERE bundle_id = bundle_2024_id) INTO klaster_exists;
    
    -- Only insert klasters if they don't exist
    IF NOT klaster_exists THEN
        INSERT INTO klasters (bundle_id, nama_klaster, deskripsi, urutan) VALUES
        (bundle_2024_id, 'Klaster 1: Promosi Kesehatan', 'Kegiatan promosi kesehatan dan pemberdayaan masyarakat', 1),
        (bundle_2024_id, 'Klaster 2: Kesehatan Lingkungan', 'Penilaian kesehatan lingkungan dan sanitasi', 2),
        (bundle_2024_id, 'Klaster 3: Kesehatan Ibu & Anak', 'Pelayanan kesehatan ibu, anak, dan keluarga berencana', 3),
        (bundle_2024_id, 'Klaster 4: Gizi Masyarakat', 'Program gizi dan pencegahan stunting', 4),
        (bundle_2024_id, 'Klaster 5: Pencegahan Penyakit', 'Pencegahan dan pengendalian penyakit menular dan tidak menular', 5),
        (bundle_2024_id, 'Klaster 6: Pelayanan Kesehatan', 'Kualitas pelayanan kesehatan dasar', 6);
    END IF;

    -- Get klaster IDs
    SELECT id INTO klaster_1_id FROM klasters WHERE bundle_id = bundle_2024_id AND nama_klaster LIKE 'Klaster 1:%';
    SELECT id INTO klaster_2_id FROM klasters WHERE bundle_id = bundle_2024_id AND nama_klaster LIKE 'Klaster 2:%';
    SELECT id INTO klaster_3_id FROM klasters WHERE bundle_id = bundle_2024_id AND nama_klaster LIKE 'Klaster 3:%';
    SELECT id INTO klaster_4_id FROM klasters WHERE bundle_id = bundle_2024_id AND nama_klaster LIKE 'Klaster 4:%';
    SELECT id INTO klaster_5_id FROM klasters WHERE bundle_id = bundle_2024_id AND nama_klaster LIKE 'Klaster 5:%';
    SELECT id INTO klaster_6_id FROM klasters WHERE bundle_id = bundle_2024_id AND nama_klaster LIKE 'Klaster 6:%';

    -- Insert indikators for Klaster 1 (Promosi Kesehatan) with conflict handling
    INSERT INTO indikators (klaster_id, nama_indikator, definisi_operasional, type, urutan) 
    SELECT klaster_1_id, 'Rencana 5 Tahunan', 'Apakah Puskesmas memiliki rencana 5 tahunan yang sesuai visi, misi dan analisis kebutuhan masyarakat?', 'scoring', 1
    WHERE NOT EXISTS (SELECT 1 FROM indikators WHERE klaster_id = klaster_1_id AND nama_indikator = 'Rencana 5 Tahunan');
    
    INSERT INTO indikators (klaster_id, nama_indikator, definisi_operasional, type, urutan) 
    SELECT klaster_1_id, 'Kegiatan Pos Bindu PTM', 'Jumlah pos bindu PTM yang aktif melakukan kegiatan rutin', 'scoring', 2
    WHERE NOT EXISTS (SELECT 1 FROM indikators WHERE klaster_id = klaster_1_id AND nama_indikator = 'Kegiatan Pos Bindu PTM');
    
    INSERT INTO indikators (klaster_id, nama_indikator, definisi_operasional, type, urutan) 
    SELECT klaster_1_id, 'Cakupan Penyuluhan Kesehatan', 'Persentase kegiatan penyuluhan kesehatan yang dilaksanakan per bulan', 'target_achievement', 3
    WHERE NOT EXISTS (SELECT 1 FROM indikators WHERE klaster_id = klaster_1_id AND nama_indikator = 'Cakupan Penyuluhan Kesehatan');

    -- Insert indikators for Klaster 2 (Kesehatan Lingkungan)
    INSERT INTO indikators (klaster_id, nama_indikator, definisi_operasional, type, urutan) 
    SELECT klaster_2_id, 'Cakupan Inspeksi Sanitasi TPM', 'Persentase tempat pengelolaan makanan yang diinspeksi sanitasinya', 'target_achievement', 1
    WHERE NOT EXISTS (SELECT 1 FROM indikators WHERE klaster_id = klaster_2_id AND nama_indikator = 'Cakupan Inspeksi Sanitasi TPM');
    
    INSERT INTO indikators (klaster_id, nama_indikator, definisi_operasional, type, urutan) 
    SELECT klaster_2_id, 'Pembinaan TUPM', 'Jumlah tempat umum dan pengelolaan makanan yang dibina per bulan', 'target_achievement', 2
    WHERE NOT EXISTS (SELECT 1 FROM indikators WHERE klaster_id = klaster_2_id AND nama_indikator = 'Pembinaan TUPM');

    -- Insert indikators for Klaster 3 (Kesehatan Ibu & Anak)
    INSERT INTO indikators (klaster_id, nama_indikator, definisi_operasional, type, urutan) 
    SELECT klaster_3_id, 'Cakupan K4', 'Persentase ibu hamil yang mendapat pelayanan antenatal sesuai standar', 'target_achievement', 1
    WHERE NOT EXISTS (SELECT 1 FROM indikators WHERE klaster_id = klaster_3_id AND nama_indikator = 'Cakupan K4');
    
    INSERT INTO indikators (klaster_id, nama_indikator, definisi_operasional, type, urutan) 
    SELECT klaster_3_id, 'Kunjungan Neonatal', 'Jumlah kunjungan neonatal per bulan', 'target_achievement', 2
    WHERE NOT EXISTS (SELECT 1 FROM indikators WHERE klaster_id = klaster_3_id AND nama_indikator = 'Kunjungan Neonatal');

    -- Insert indikators for Klaster 4 (Gizi Masyarakat)
    INSERT INTO indikators (klaster_id, nama_indikator, definisi_operasional, type, urutan) 
    SELECT klaster_4_id, 'Cakupan Balita Ditimbang', 'Persentase balita yang ditimbang di posyandu', 'target_achievement', 1
    WHERE NOT EXISTS (SELECT 1 FROM indikators WHERE klaster_id = klaster_4_id AND nama_indikator = 'Cakupan Balita Ditimbang');
    
    INSERT INTO indikators (klaster_id, nama_indikator, definisi_operasional, type, urutan) 
    SELECT klaster_4_id, 'Distribusi PMT Balita', 'Distribusi PMT untuk balita gizi kurang per bulan', 'target_achievement', 2
    WHERE NOT EXISTS (SELECT 1 FROM indikators WHERE klaster_id = klaster_4_id AND nama_indikator = 'Distribusi PMT Balita');

    -- Insert indikators for Klaster 5 (Pencegahan Penyakit)
    INSERT INTO indikators (klaster_id, nama_indikator, definisi_operasional, type, urutan) 
    SELECT klaster_5_id, 'Cakupan Penemuan TB', 'Persentase penemuan kasus TB dari target yang ditetapkan', 'target_achievement', 1
    WHERE NOT EXISTS (SELECT 1 FROM indikators WHERE klaster_id = klaster_5_id AND nama_indikator = 'Cakupan Penemuan TB');
    
    INSERT INTO indikators (klaster_id, nama_indikator, definisi_operasional, type, urutan) 
    SELECT klaster_5_id, 'Pemeriksaan Kontak TB', 'Jumlah pemeriksaan kontak TB per bulan', 'target_achievement', 2
    WHERE NOT EXISTS (SELECT 1 FROM indikators WHERE klaster_id = klaster_5_id AND nama_indikator = 'Pemeriksaan Kontak TB');

    -- Insert indikators for Klaster 6 (Pelayanan Kesehatan)
    INSERT INTO indikators (klaster_id, nama_indikator, definisi_operasional, type, urutan) 
    SELECT klaster_6_id, 'Waktu Tunggu Pelayanan', 'Rata-rata waktu tunggu pelayanan pasien', 'scoring', 1
    WHERE NOT EXISTS (SELECT 1 FROM indikators WHERE klaster_id = klaster_6_id AND nama_indikator = 'Waktu Tunggu Pelayanan');
    
    INSERT INTO indikators (klaster_id, nama_indikator, definisi_operasional, type, urutan) 
    SELECT klaster_6_id, 'Kepuasan Pasien', 'Tingkat kepuasan pasien terhadap pelayanan', 'scoring', 2
    WHERE NOT EXISTS (SELECT 1 FROM indikators WHERE klaster_id = klaster_6_id AND nama_indikator = 'Kepuasan Pasien');

    -- Insert scoring details for scoring type indikators with conflict handling
    
    -- Rencana 5 Tahunan
    SELECT id INTO current_indikator_id FROM indikators WHERE klaster_id = klaster_1_id AND nama_indikator = 'Rencana 5 Tahunan';
    IF current_indikator_id IS NOT NULL THEN
        INSERT INTO scoring_indikators (indikator_id, skor_0, skor_4, skor_7, skor_10) 
        SELECT current_indikator_id, 'Tidak ada rencana 5 tahunan', 'Ada rencana tapi tidak sesuai visi misi', 'Sesuai visi misi tapi belum berbasis analisis kebutuhan', 'Sesuai visi misi dan berbasis analisis kebutuhan masyarakat'
        WHERE NOT EXISTS (SELECT 1 FROM scoring_indikators WHERE scoring_indikators.indikator_id = current_indikator_id);
    END IF;

    -- Kegiatan Pos Bindu PTM
    SELECT id INTO current_indikator_id FROM indikators WHERE klaster_id = klaster_1_id AND nama_indikator = 'Kegiatan Pos Bindu PTM';
    IF current_indikator_id IS NOT NULL THEN
        INSERT INTO scoring_indikators (indikator_id, skor_0, skor_4, skor_7, skor_10) 
        SELECT current_indikator_id, 'Tidak ada pos bindu yang aktif', '1-2 pos bindu aktif', '3-4 pos bindu aktif', 'Lebih dari 4 pos bindu aktif'
        WHERE NOT EXISTS (SELECT 1 FROM scoring_indikators WHERE scoring_indikators.indikator_id = current_indikator_id);
    END IF;

    -- Waktu Tunggu Pelayanan
    SELECT id INTO current_indikator_id FROM indikators WHERE klaster_id = klaster_6_id AND nama_indikator = 'Waktu Tunggu Pelayanan';
    IF current_indikator_id IS NOT NULL THEN
        INSERT INTO scoring_indikators (indikator_id, skor_0, skor_4, skor_7, skor_10) 
        SELECT current_indikator_id, 'Lebih dari 60 menit', '31-60 menit', '16-30 menit', 'Kurang dari 15 menit'
        WHERE NOT EXISTS (SELECT 1 FROM scoring_indikators WHERE scoring_indikators.indikator_id = current_indikator_id);
    END IF;

    -- Kepuasan Pasien
    SELECT id INTO current_indikator_id FROM indikators WHERE klaster_id = klaster_6_id AND nama_indikator = 'Kepuasan Pasien';
    IF current_indikator_id IS NOT NULL THEN
        INSERT INTO scoring_indikators (indikator_id, skor_0, skor_4, skor_7, skor_10) 
        SELECT current_indikator_id, 'Kurang dari 60%', '60-74%', '75-89%', '90% atau lebih'
        WHERE NOT EXISTS (SELECT 1 FROM scoring_indikators WHERE scoring_indikators.indikator_id = current_indikator_id);
    END IF;

    -- Insert target achievement details for target_achievement type indikators with conflict handling
    
    -- Cakupan Penyuluhan Kesehatan (Monthly)
    SELECT id INTO current_indikator_id FROM indikators WHERE klaster_id = klaster_1_id AND nama_indikator = 'Cakupan Penyuluhan Kesehatan';
    IF current_indikator_id IS NOT NULL THEN
        INSERT INTO target_achievement_indikators (indikator_id, target_percentage, total_sasaran, satuan, periodicity) 
        SELECT current_indikator_id, 80, 20, 'kegiatan', 'monthly'
        WHERE NOT EXISTS (SELECT 1 FROM target_achievement_indikators WHERE target_achievement_indikators.indikator_id = current_indikator_id);
    END IF;

    -- Cakupan Inspeksi Sanitasi TPM (Annual)
    SELECT id INTO current_indikator_id FROM indikators WHERE klaster_id = klaster_2_id AND nama_indikator = 'Cakupan Inspeksi Sanitasi TPM';
    IF current_indikator_id IS NOT NULL THEN
        INSERT INTO target_achievement_indikators (indikator_id, target_percentage, total_sasaran, satuan, periodicity) 
        SELECT current_indikator_id, 90, 150, 'TPM', 'annual'
        WHERE NOT EXISTS (SELECT 1 FROM target_achievement_indikators WHERE target_achievement_indikators.indikator_id = current_indikator_id);
    END IF;

    -- Pembinaan TUPM (Monthly)
    SELECT id INTO current_indikator_id FROM indikators WHERE klaster_id = klaster_2_id AND nama_indikator = 'Pembinaan TUPM';
    IF current_indikator_id IS NOT NULL THEN
        INSERT INTO target_achievement_indikators (indikator_id, target_percentage, total_sasaran, satuan, periodicity) 
        SELECT current_indikator_id, 85, 50, 'tempat', 'monthly'
        WHERE NOT EXISTS (SELECT 1 FROM target_achievement_indikators WHERE target_achievement_indikators.indikator_id = current_indikator_id);
    END IF;

    -- Cakupan K4 (Annual)
    SELECT id INTO current_indikator_id FROM indikators WHERE klaster_id = klaster_3_id AND nama_indikator = 'Cakupan K4';
    IF current_indikator_id IS NOT NULL THEN
        INSERT INTO target_achievement_indikators (indikator_id, target_percentage, total_sasaran, satuan, periodicity) 
        SELECT current_indikator_id, 95, 500, 'ibu hamil', 'annual'
        WHERE NOT EXISTS (SELECT 1 FROM target_achievement_indikators WHERE target_achievement_indikators.indikator_id = current_indikator_id);
    END IF;

    -- Kunjungan Neonatal (Monthly)
    SELECT id INTO current_indikator_id FROM indikators WHERE klaster_id = klaster_3_id AND nama_indikator = 'Kunjungan Neonatal';
    IF current_indikator_id IS NOT NULL THEN
        INSERT INTO target_achievement_indikators (indikator_id, target_percentage, total_sasaran, satuan, periodicity) 
        SELECT current_indikator_id, 95, 40, 'kunjungan', 'monthly'
        WHERE NOT EXISTS (SELECT 1 FROM target_achievement_indikators WHERE target_achievement_indikators.indikator_id = current_indikator_id);
    END IF;

    -- Cakupan Balita Ditimbang (Annual)
    SELECT id INTO current_indikator_id FROM indikators WHERE klaster_id = klaster_4_id AND nama_indikator = 'Cakupan Balita Ditimbang';
    IF current_indikator_id IS NOT NULL THEN
        INSERT INTO target_achievement_indikators (indikator_id, target_percentage, total_sasaran, satuan, periodicity) 
        SELECT current_indikator_id, 85, 800, 'balita', 'annual'
        WHERE NOT EXISTS (SELECT 1 FROM target_achievement_indikators WHERE target_achievement_indikators.indikator_id = current_indikator_id);
    END IF;

    -- Distribusi PMT Balita (Monthly)
    SELECT id INTO current_indikator_id FROM indikators WHERE klaster_id = klaster_4_id AND nama_indikator = 'Distribusi PMT Balita';
    IF current_indikator_id IS NOT NULL THEN
        INSERT INTO target_achievement_indikators (indikator_id, target_percentage, total_sasaran, satuan, periodicity) 
        SELECT current_indikator_id, 90, 25, 'balita', 'monthly'
        WHERE NOT EXISTS (SELECT 1 FROM target_achievement_indikators WHERE target_achievement_indikators.indikator_id = current_indikator_id);
    END IF;

    -- Cakupan Penemuan TB (Annual)
    SELECT id INTO current_indikator_id FROM indikators WHERE klaster_id = klaster_5_id AND nama_indikator = 'Cakupan Penemuan TB';
    IF current_indikator_id IS NOT NULL THEN
        INSERT INTO target_achievement_indikators (indikator_id, target_percentage, total_sasaran, satuan, periodicity) 
        SELECT current_indikator_id, 70, 100, 'kasus', 'annual'
        WHERE NOT EXISTS (SELECT 1 FROM target_achievement_indikators WHERE target_achievement_indikators.indikator_id = current_indikator_id);
    END IF;

    -- Pemeriksaan Kontak TB (Monthly)
    SELECT id INTO current_indikator_id FROM indikators WHERE klaster_id = klaster_5_id AND nama_indikator = 'Pemeriksaan Kontak TB';
    IF current_indikator_id IS NOT NULL THEN
        INSERT INTO target_achievement_indikators (indikator_id, target_percentage, total_sasaran, satuan, periodicity) 
        SELECT current_indikator_id, 80, 15, 'pemeriksaan', 'monthly'
        WHERE NOT EXISTS (SELECT 1 FROM target_achievement_indikators WHERE target_achievement_indikators.indikator_id = current_indikator_id);
    END IF;

END $$;