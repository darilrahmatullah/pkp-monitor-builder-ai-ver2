import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Save, BarChart3, CheckCircle, TrendingUp, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PenilaianForm = () => {
  const [currentIndikatorIndex, setCurrentIndikatorIndex] = useState(0);
  const [selectedValues, setSelectedValues] = useState<Record<number, number>>({});
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
  
  const mockIndikators = [
    {
      id: 1,
      klaster: "Klaster 1: Promosi Kesehatan",
      nama: "Rencana 5 Tahunan",
      definisi: "Apakah Puskesmas memiliki rencana 5 tahunan yang sesuai visi, misi dan analisis kebutuhan masyarakat?",
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
      skor: {
        0: "Tidak ada pos bindu yang aktif",
        4: "1-2 pos bindu aktif",
        7: "3-4 pos bindu aktif",
        10: ">4 pos bindu aktif"
      }
    },
    {
      id: 3,
      klaster: "Klaster 2: Pelayanan Kesehatan",
      nama: "Ketersediaan Obat Esensial",
      definisi: "Persentase ketersediaan obat esensial di Puskesmas",
      skor: {
        0: "< 60%",
        4: "60-74%",
        7: "75-89%",
        10: ">= 90%"
      }
    }
  ];

  // Mock monthly data for charts
  const monthlyData = [
    { bulan: 'Jan', nilai: 7 },
    { bulan: 'Feb', nilai: 8 },
    { bulan: 'Mar', nilai: 9 },
    { bulan: 'Apr', nilai: 10 },
    { bulan: 'Mei', nilai: 10 },
    { bulan: 'Jun', nilai: 8 },
    { bulan: 'Jul', nilai: 9 },
    { bulan: 'Agu', nilai: 7 },
    { bulan: 'Sep', nilai: 8 },
    { bulan: 'Okt', nilai: 10 },
    { bulan: 'Nov', nilai: 9 },
    { bulan: 'Des', nilai: 10 }
  ];

  const currentIndikator = mockIndikators[currentIndikatorIndex];

  const handleValueChange = (indikatorId: number, value: string) => {
    setSelectedValues(prev => ({
      ...prev,
      [indikatorId]: parseInt(value)
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

  const calculateTotalScore = (): number => {
    return Object.values(selectedValues).reduce((sum: number, val: number) => sum + val, 0);
  };

  const calculateProgress = (): number => {
    return (Object.keys(selectedValues).length / mockIndikators.length) * 100;
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
    // Validate evaluation data for current tribunan
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
      description: `Total skor: ${calculateTotalScore()} | Evaluasi ${tribunanLabels[currentTribulan].label} tersimpan`,
    });
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
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {currentIndikator.id}. {currentIndikator.nama}
                </CardTitle>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentIndikator.definisi}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Ringkasan Nilai</p>
                  <p className="text-sm font-semibold">{currentIndikator.nama}</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {selectedValues[currentIndikator.id] || 0}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedValues[currentIndikator.id]?.toString()} 
              onValueChange={(value) => handleValueChange(currentIndikator.id, value)}
              className="space-y-3"
            >
              {Object.entries(currentIndikator.skor).map(([nilai, deskripsi]) => (
                <div key={nilai} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={nilai} id={`${currentIndikator.id}-${nilai}`} />
                  <Label 
                    htmlFor={`${currentIndikator.id}-${nilai}`} 
                    className="flex-1 cursor-pointer text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span><strong>{nilai}</strong> - {deskripsi}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
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
                <YAxis domain={[0, 10]} />
                <Tooltip />
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
                      <td key={month.bulan} className="text-center p-2">{month.nilai}</td>
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

      {/* Sticky Sidebar */}
      <div className="space-y-6">
        <Card className="sticky top-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Rekap Skor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-800">{calculateTotalScore()}</div>
              <p className="text-sm text-gray-600">Total Skor</p>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress Pengisian</span>
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
                  <span className="truncate">{indikator.id}. {indikator.nama}</span>
                  <Badge 
                    variant="secondary" 
                    className={`ml-2 ${selectedValues[indikator.id] ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
                  >
                    {selectedValues[indikator.id] || '-'}
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