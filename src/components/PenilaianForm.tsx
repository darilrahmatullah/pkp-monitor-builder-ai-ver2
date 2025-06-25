
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
import { Save, BarChart3, CheckCircle, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PenilaianForm = () => {
  const [selectedValues, setSelectedValues] = useState<Record<number, number>>({});
  const [evaluasiData, setEvaluasiData] = useState({
    analisis: '',
    hambatan: '',
    rencana: ''
  });
  
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

  const handleValueChange = (indikatorId: number, value: string) => {
    setSelectedValues(prev => ({
      ...prev,
      [indikatorId]: parseInt(value)
    }));
  };

  const calculateTotalScore = (): number => {
    return Object.values(selectedValues).reduce((sum: number, val: number) => sum + val, 0);
  };

  const calculateProgress = (): number => {
    return (Object.keys(selectedValues).length / mockIndikators.length) * 100;
  };

  const handleSave = () => {
    toast({
      title: "Data berhasil disimpan",
      description: `Total skor: ${calculateTotalScore()}`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {mockIndikators.map((indikator) => (
          <div key={indikator.id} className="space-y-6">
            {/* Indikator Card */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {indikator.klaster}
                    </Badge>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {indikator.id}. {indikator.nama}
                    </CardTitle>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {indikator.definisi}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Ringkasan Nilai</p>
                      <p className="text-sm font-semibold">{indikator.nama}</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {selectedValues[indikator.id] || 0}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={selectedValues[indikator.id]?.toString()} 
                  onValueChange={(value) => handleValueChange(indikator.id, value)}
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
              </CardContent>
            </Card>

            {/* Monthly Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  📊 Grafik Nilai Bulanan ({indikator.nama})
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
                        <td className="p-2 font-medium">{indikator.nama}</td>
                        {monthlyData.map(month => (
                          <td key={month.bulan} className="text-center p-2">{month.nilai}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Quarterly Evaluation */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              ✏️ Evaluasi Triwulanan
            </CardTitle>
            <div className="flex space-x-2 mt-4">
              {[1, 2, 3, 4].map((quarter) => (
                <Badge 
                  key={quarter}
                  variant={quarter === 4 ? "default" : "outline"}
                  className={quarter === 4 ? "bg-blue-600" : ""}
                >
                  {quarter}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="analisis" className="text-sm font-medium text-gray-700">Analisis</Label>
              <Textarea
                id="analisis"
                placeholder="Masukkan analisis evaluasi triwulanan..."
                value={evaluasiData.analisis}
                onChange={(e) => setEvaluasiData(prev => ({ ...prev, analisis: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="hambatan" className="text-sm font-medium text-gray-700">Hambatan</Label>
              <Textarea
                id="hambatan"
                placeholder="Masukkan hambatan yang dihadapi..."
                value={evaluasiData.hambatan}
                onChange={(e) => setEvaluasiData(prev => ({ ...prev, hambatan: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="rencana" className="text-sm font-medium text-gray-700">Rencana Tindak Lanjut</Label>
              <Textarea
                id="rencana"
                placeholder="Masukkan rencana tindak lanjut..."
                value={evaluasiData.rencana}
                onChange={(e) => setEvaluasiData(prev => ({ ...prev, rencana: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Simpan Penilaian
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PenilaianForm;
