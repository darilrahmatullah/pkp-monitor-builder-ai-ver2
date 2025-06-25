import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Save, TrendingUp, ChevronLeft, ChevronRight, FileText, Target, Calendar, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ScoringIndikator {
  id: number;
  klaster: string;
  nama: string;
  definisi: string;
  type: 'scoring';
  skor: {
    0: string;
    4: string;
    7: string;
    10: string;
  };
}

interface TargetAchievementIndikator {
  id: number;
  klaster: string;
  nama: string;
  definisi: string;
  type: 'target_achievement';
  target_info: {
    target_percentage: number;
    total_sasaran: number;
    satuan: string;
    periodicity: 'annual' | 'monthly';
  };
}

type Indikator = ScoringIndikator | TargetAchievementIndikator;

interface IndikatorValue {
  score?: number;
  actual_achievement?: number;
  calculated_percentage?: number;
}

const PenilaianForm = () => {
  const [currentIndikatorIndex, setCurrentIndikatorIndex] = useState(0);
  const [selectedValues, setSelectedValues] = useState<Record<number, IndikatorValue>>({});
  const [currentTribulan, setCurrentTribulan] = useState(1);
  const [evaluasiData, setEvaluasiData] = useState({
    1: { analisis: '', hambatan: '', rencana: '' },
    2: { analisis: '', hambatan: '', rencana: '' },
    3: { analisis: '', hambatan: '', rencana: '' },
    4: { analisis: '', hambatan: '', rencana: '' }
  });

  const tribunanLabels = {
    1: { label: 'Q1 (Jan-Mar)', period: 'Januari - Maret 2024' },
    2: { label: 'Q2 (Apr-Jun)', period: 'April - Juni 2024' },
    3: { label: 'Q3 (Jul-Sep)', period: 'Juli - September 2024' },
    4: { label: 'Q4 (Okt-Des)', period: 'Oktober - Desember 2024' }
  };
  
  const mockIndikators: Indikator[] = [
    // Klaster 1: Scoring System
    {
      id: 1,
      klaster: "Klaster 1: Promosi Kesehatan",
      nama: "Rencana 5 Tahunan",
      definisi: "Apakah Puskesmas memiliki rencana 5 tahunan yang sesuai visi, misi dan analisis kebutuhan masyarakat?",
      type: 'scoring',
      skor: {
        0: "Tidak ada",
        4: "Ada, tapi tidak sesuai",
        7: "Sesuai tapi belum analisis",
        10: "Sesuai & berbasis analisis"
      }
    },
    {
      id: 2,
      klaster: "Klaster 1: Promosi Kesehatan",
      nama: "Kegiatan Pos Bindu PTM",
      definisi: "Jumlah pos bindu PTM yang aktif melakukan kegiatan rutin",
      type: 'scoring',
      skor: {
        0: "Tidak ada pos bindu yang aktif",
        4: "1-2 pos bindu aktif",
        7: "3-4 pos bindu aktif",
        10: ">4 pos bindu aktif"
      }
    },
    // Klaster 2: Target Achievement System (Annual)
    {
      id: 3,
      klaster: "Klaster 2: Kesehatan Lingkungan",
      nama: "Cakupan Inspeksi Sanitasi TPM",
      definisi: "Persentase tempat pengelolaan makanan yang diinspeksi sanitasinya (Target Tahunan)",
      type: 'target_achievement',
      target_info: {
        target_percentage: 90,
        total_sasaran: 150,
        satuan: "TPM",
        periodicity: 'annual'
      }
    },
    {
      id: 4,
      klaster: "Klaster 2: Kesehatan Lingkungan",
      nama: "Pembinaan TUPM",
      definisi: "Jumlah tempat umum dan pengelolaan makanan yang dibina per bulan (Target Bulanan)",
      type: 'target_achievement',
      target_info: {
        target_percentage: 85,
        total_sasaran: 50,
        satuan: "tempat",
        periodicity: 'monthly'
      }
    },
    // Klaster 3: Target Achievement System (Annual)
    {
      id: 5,
      klaster: "Klaster 3: Kesehatan Ibu & Anak",
      nama: "Cakupan K4",
      definisi: "Persentase ibu hamil yang mendapat pelayanan antenatal sesuai standar (Target Tahunan)",
      type: 'target_achievement',
      target_info: {
        target_percentage: 95,
        total_sasaran: 500,
        satuan: "ibu hamil",
        periodicity: 'annual'
      }
    },
    {
      id: 6,
      klaster: "Klaster 3: Kesehatan Ibu & Anak",
      nama: "Kunjungan Neonatal",
      definisi: "Jumlah kunjungan neonatal per bulan (Target Bulanan)",
      type: 'target_achievement',
      target_info: {
        target_percentage: 95,
        total_sasaran: 40,
        satuan: "kunjungan",
        periodicity: 'monthly'
      }
    },
    // Klaster 4: Target Achievement System (Mixed)
    {
      id: 7,
      klaster: "Klaster 4: Gizi Masyarakat",
      nama: "Cakupan Balita Ditimbang",
      definisi: "Persentase balita yang ditimbang di posyandu (Target Tahunan)",
      type: 'target_achievement',
      target_info: {
        target_percentage: 85,
        total_sasaran: 800,
        satuan: "balita",
        periodicity: 'annual'
      }
    },
    {
      id: 8,
      klaster: "Klaster 4: Gizi Masyarakat",
      nama: "Distribusi PMT Balita",
      definisi: "Distribusi PMT untuk balita gizi kurang per bulan (Target Bulanan)",
      type: 'target_achievement',
      target_info: {
        target_percentage: 90,
        total_sasaran: 25,
        satuan: "balita",
        periodicity: 'monthly'
      }
    },
    // Klaster 5: Target Achievement System (Mixed)
    {
      id: 9,
      klaster: "Klaster 5: Pencegahan Penyakit",
      nama: "Cakupan Penemuan TB",
      definisi: "Persentase penemuan kasus TB dari target yang ditetapkan (Target Tahunan)",
      type: 'target_achievement',
      target_info: {
        target_percentage: 70,
        total_sasaran: 100,
        satuan: "kasus",
        periodicity: 'annual'
      }
    },
    {
      id: 10,
      klaster: "Klaster 5: Pencegahan Penyakit",
      nama: "Pemeriksaan Kontak TB",
      definisi: "Jumlah pemeriksaan kontak TB per bulan (Target Bulanan)",
      type: 'target_achievement',
      target_info: {
        target_percentage: 80,
        total_sasaran: 15,
        satuan: "pemeriksaan",
        periodicity: 'monthly'
      }
    }
  ];

  // Mock monthly data for charts (0-100 scale)
  const monthlyData = [
    { bulan: 'Jan', nilai: 78 },
    { bulan: 'Feb', nilai: 82 },
    { bulan: 'Mar', nilai: 85 },
    { bulan: 'Apr', nilai: 88 },
    { bulan: 'Mei', nilai: 92 },
    { bulan: 'Jun', nilai: 89 },
    { bulan: 'Jul', nilai: 91 },
    { bulan: 'Agu', nilai: 87 },
    { bulan: 'Sep', nilai: 90 },
    { bulan: 'Okt', nilai: 94 },
    { bulan: 'Nov', nilai: 96 },
    { bulan: 'Des', nilai: 95 }
  ];

  const currentIndikator = mockIndikators[currentIndikatorIndex];

  const handleScoringChange = (indikatorId: number, value: string) => {
    const scoreValue = parseInt(value);
    const calculatedPercentage = (scoreValue / 10) * 100; // Convert 0-10 to 0-100
    
    setSelectedValues(prev => ({
      ...prev,
      [indikatorId]: {
        score: scoreValue,
        calculated_percentage: calculatedPercentage
      }
    }));
  };

  const handleTargetAchievementChange = (indikatorId: number, actualValue: number, periodTargetSasaran: number) => {
    const calculatedPercentage = Math.min(100, Math.max(0, (actualValue / periodTargetSasaran) * 100));

    setSelectedValues(prev => ({
      ...prev,
      [indikatorId]: {
        actual_achievement: actualValue,
        calculated_percentage: calculatedPercentage
      }
    }));
  };

  const handleEvaluasiChange = (field: string, value: string) => {
    setEvaluasiData(prev => ({
      ...prev,
      [currentTribulan]: {
        ...prev[currentTribulan],
        [field]: value
      }
    }));
  };

  const calculateProgress = (): number => {
    const filledIndicators = Object.keys(selectedValues).length;
    return (filledIndicators / mockIndikators.length) * 100;
  };

  const getDisplayValue = (indikatorId: number): string => {
    const value = selectedValues[indikatorId];
    if (!value) return '-';
    
    if (value.calculated_percentage !== undefined) {
      return `${Math.round(value.calculated_percentage)}%`;
    }
    
    return value.score?.toString() || value.actual_achievement?.toString() || '-';
  };

  const isDataComplete = (tribunan: number): boolean => {
    const data = evaluasiData[tribunan];
    return data.analisis.trim() && data.hambatan.trim() && data.rencana.trim();
  };

  const handlePrevious = () => {
    if (currentIndikatorIndex > 0) {
      setCurrentIndikatorIndex(currentIndikatorIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndikatorIndex < mockIndikators.length - 1) {
      setCurrentIndikatorIndex(currentIndikatorIndex + 1);
    }
  };

  const handleSave = () => {
    const currentEvaluasi = evaluasiData[currentTribulan];
    if (!currentEvaluasi.analisis.trim() || !currentEvaluasi.hambatan.trim() || !currentEvaluasi.rencana.trim()) {
      toast({
        title: "Data evaluasi belum lengkap",
        description: `Mohon lengkapi evaluasi untuk ${tribunanLabels[currentTribulan].label}`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Data berhasil disimpan",
      description: `Penilaian dan evaluasi ${tribunanLabels[currentTribulan].label} tersimpan`,
    });
  };

  const renderScoringInput = (indikator: ScoringIndikator) => (
    <RadioGroup 
      value={selectedValues[indikator.id]?.score?.toString()} 
      onValueChange={(value) => handleScoringChange(indikator.id, value)}
      className="space-y-3"
    >
      {Object.entries(indikator.skor).map(([nilai, deskripsi]) => (
        <div key={nilai} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
          <RadioGroupItem value={nilai} id={`${indikator.id}-${nilai}`} />
          <Label 
            htmlFor={`${indikator.id}-${nilai}`} 
            className="flex-1 cursor-pointer text-sm"
          >
            <div className="flex items-center justify-between">
              <span><strong>{nilai}</strong> - {deskripsi}</span>
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );

  const renderTargetAchievementInput = (indikator: TargetAchievementIndikator) => {
    const { target_percentage, total_sasaran, satuan, periodicity } = indikator.target_info;
    
    // Calculate period target based on periodicity
    let periodTargetSasaran: number;
    let periodLabel: string;
    let periodDescription: string;
    
    if (periodicity === 'annual') {
      // For annual targets: divide by 4 quarters
      periodTargetSasaran = Math.round((target_percentage / 100) * total_sasaran / 4);
      periodLabel = "Target Triwulan";
      periodDescription = `${target_percentage}% dari ${total_sasaran} ${satuan} tahunan ÷ 4 triwulan`;
    } else {
      // For monthly targets: multiply by 3 months per quarter
      periodTargetSasaran = Math.round((target_percentage / 100) * total_sasaran * 3);
      periodLabel = "Target Triwulan";
      periodDescription = `${target_percentage}% dari ${total_sasaran} ${satuan} bulanan × 3 bulan`;
    }
    
    const currentValue = selectedValues[indikator.id];
    
    return (
      <div className="space-y-4">
        {/* Periodicity Indicator */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            {periodicity === 'annual' ? (
              <Calendar className="w-4 h-4 text-blue-500" />
            ) : (
              <Clock className="w-4 h-4 text-green-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {periodicity === 'annual' ? 'Target Tahunan (Akumulatif)' : 'Target Bulanan (Per Bulan)'}
            </span>
          </div>
          <Badge variant="outline" className={periodicity === 'annual' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}>
            {periodicity === 'annual' ? 'Tahunan' : 'Bulanan'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{periodTargetSasaran}</div>
            <div className="text-sm text-gray-600">{periodLabel} ({satuan})</div>
            <div className="text-xs text-gray-500 mt-1">
              {periodDescription}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {currentValue?.calculated_percentage ? `${Math.round(currentValue.calculated_percentage)}%` : '0%'}
            </div>
            <div className="text-sm text-gray-600">Capaian Saat Ini</div>
            <div className="text-xs text-gray-500 mt-1">
              {currentValue?.actual_achievement || 0} dari {periodTargetSasaran} target
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`achievement-${indikator.id}`} className="text-sm font-medium">
            Capaian Aktual Triwulan Ini ({satuan})
          </Label>
          <Input
            id={`achievement-${indikator.id}`}
            type="number"
            min="0"
            placeholder={`Masukkan jumlah ${satuan} yang tercapai...`}
            value={currentValue?.actual_achievement || ''}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              handleTargetAchievementChange(indikator.id, value, periodTargetSasaran);
            }}
            className="text-center text-lg font-semibold"
          />
          <div className="text-xs text-gray-500 text-center">
            {periodicity === 'annual' 
              ? 'Masukkan capaian akumulatif untuk triwulan ini'
              : 'Masukkan total capaian untuk 3 bulan dalam triwulan ini'
            }
          </div>
        </div>

        {currentValue?.calculated_percentage !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress Capaian</span>
              <span className="font-medium">{Math.round(currentValue.calculated_percentage)}%</span>
            </div>
            <Progress value={currentValue.calculated_percentage} className="h-3" />
          </div>
        )}

        {/* Additional Info Box */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-xs text-yellow-800">
            <strong>Catatan:</strong> {periodicity === 'annual' 
              ? 'Target ini bersifat akumulatif sepanjang tahun. Capaian triwulan akan dijumlahkan untuk mencapai target tahunan.'
              : 'Target ini dihitung per bulan. Capaian triwulan adalah total dari 3 bulan dalam periode tersebut.'
            }
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndikatorIndex === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">Indikator</p>
            <p className="text-lg font-semibold">
              {currentIndikatorIndex + 1} dari {mockIndikators.length}
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndikatorIndex === mockIndikators.length - 1}
            className="flex items-center space-x-2"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Indikator Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {currentIndikator.klaster}
                </Badge>
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {currentIndikator.id}. {currentIndikator.nama}
                  </CardTitle>
                  {currentIndikator.type === 'target_achievement' && (
                    <div className="flex items-center space-x-1">
                      <Target className="w-5 h-5 text-green-600" />
                      {(currentIndikator as TargetAchievementIndikator).target_info.periodicity === 'annual' ? (
                        <Calendar className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentIndikator.definisi}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {currentIndikator.type === 'scoring' ? 'Skor' : 'Capaian'}
                  </p>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-lg px-3 py-1">
                    {getDisplayValue(currentIndikator.id)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentIndikator.type === 'scoring' 
              ? renderScoringInput(currentIndikator as ScoringIndikator)
              : renderTargetAchievementInput(currentIndikator as TargetAchievementIndikator)
            }
          </CardContent>
        </Card>

        {/* Monthly Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              📊 Grafik Nilai Bulanan ({currentIndikator.nama})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Capaian']} />
                <Bar dataKey="nilai" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Data Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              📋 Tabel Nilai Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2 font-medium">Indikator</th>
                    {monthlyData.map(month => (
                      <th key={month.bulan} className="text-center p-2 font-medium">{month.bulan}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">{currentIndikator.nama}</td>
                    {monthlyData.map(month => (
                      <td key={month.bulan} className="text-center p-2">{month.nilai}%</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Evaluasi Triwulanan Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-600" />
                  Evaluasi Triwulanan
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {tribunanLabels[currentTribulan].period}
                </p>
              </div>
              <Badge 
                variant={isDataComplete(currentTribulan) ? "default" : "secondary"}
                className="text-sm"
              >
                {isDataComplete(currentTribulan) ? "Lengkap" : "Belum Lengkap"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Pagination Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentTribulan(Math.max(1, currentTribulan - 1))}
                disabled={currentTribulan === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Sebelumnya
              </Button>

              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((q) => (
                  <Button
                    key={q}
                    variant={currentTribulan === q ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentTribulan(q)}
                    className="relative"
                  >
                    {tribunanLabels[q].label}
                    {isDataComplete(q) && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentTribulan(Math.min(4, currentTribulan + 1))}
                disabled={currentTribulan === 4}
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Evaluasi Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Analisis Capaian */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    📊 Analisis Capaian
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Jelaskan pencapaian kinerja pada triwulan ini
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Contoh: Pada triwulan ini, capaian imunisasi mencapai 85% dari target yang ditetapkan. Peningkatan signifikan terjadi pada program..."
                    value={evaluasiData[currentTribulan].analisis}
                    onChange={(e) => handleEvaluasiChange('analisis', e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    {evaluasiData[currentTribulan].analisis.length}/500 karakter
                  </div>
                </CardContent>
              </Card>

              {/* Hambatan */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    🚧 Hambatan & Kendala
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Identifikasi hambatan yang dihadapi
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Contoh: Kendala utama yang dihadapi antara lain keterbatasan tenaga kesehatan, kurangnya alat medis, serta kesadaran masyarakat yang masih rendah..."
                    value={evaluasiData[currentTribulan].hambatan}
                    onChange={(e) => handleEvaluasiChange('hambatan', e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    {evaluasiData[currentTribulan].hambatan.length}/500 karakter
                  </div>
                </CardContent>
              </Card>

              {/* Rencana Tindak Lanjut */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    🎯 Rencana Tindak Lanjut
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Rencana perbaikan untuk triwulan selanjutnya
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Contoh: Untuk triwulan selanjutnya, akan dilakukan penambahan jadwal posyandu, pelatihan kader kesehatan, serta sosialisasi intensif ke masyarakat..."
                    value={evaluasiData[currentTribulan].rencana}
                    onChange={(e) => handleEvaluasiChange('rencana', e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    {evaluasiData[currentTribulan].rencana.length}/500 karakter
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Summary */}
            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Progress Evaluasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((q) => (
                    <div key={q} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`text-2xl mb-2 ${isDataComplete(q) ? 'text-green-500' : 'text-gray-400'}`}>
                        {isDataComplete(q) ? '✓' : '○'}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {tribunanLabels[q].label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {isDataComplete(q) ? 'Selesai' : 'Belum Diisi'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Simpan Penilaian & Evaluasi {tribunanLabels[currentTribulan].label}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card className="sticky top-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Progress Pengisian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress Indikator</span>
                <span className="font-medium">{Math.round(calculateProgress())}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
              <p className="text-xs text-gray-500">
                {Object.keys(selectedValues).length} dari {mockIndikators.length} indikator terisi
              </p>
            </div>

            {/* Indicator List */}
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Daftar Indikator:</p>
              {mockIndikators.map((indikator, index) => (
                <div 
                  key={indikator.id} 
                  className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer transition-colors ${
                    index === currentIndikatorIndex 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentIndikatorIndex(index)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="truncate">{indikator.id}. {indikator.nama}</span>
                      {indikator.type === 'target_achievement' && (
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <Target className="w-3 h-3 text-green-600" />
                          {(indikator as TargetAchievementIndikator).target_info.periodicity === 'annual' ? (
                            <Calendar className="w-3 h-3 text-blue-500" />
                          ) : (
                            <Clock className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{indikator.klaster}</div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 ${selectedValues[indikator.id] ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
                  >
                    {getDisplayValue(indikator.id)}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Evaluasi Progress */}
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Progress Evaluasi:</p>
              {[1, 2, 3, 4].map((q) => (
                <div 
                  key={q} 
                  className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer transition-colors ${
                    q === currentTribulan 
                      ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentTribulan(q)}
                >
                  <span>{tribunanLabels[q].label}</span>
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 ${isDataComplete(q) ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
                  >
                    {isDataComplete(q) ? '✓' : '○'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PenilaianForm;