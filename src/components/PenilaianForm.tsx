
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Save, BarChart3, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PenilaianForm = () => {
  const [selectedValues, setSelectedValues] = useState({});
  
  const mockIndikators = [
    {
      id: 1,
      klaster: "Klaster 1: Promosi Kesehatan",
      nama: "Cakupan Penyuluhan Kesehatan",
      definisi: "Persentase kegiatan penyuluhan kesehatan yang dilaksanakan terhadap target yang ditetapkan",
      skor: {
        0: "Tidak ada kegiatan penyuluhan (0%)",
        4: "Kegiatan penyuluhan 1-40% dari target",
        7: "Kegiatan penyuluhan 41-80% dari target", 
        10: "Kegiatan penyuluhan >80% dari target"
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
      klaster: "Klaster 2: Kesehatan Lingkungan", 
      nama: "Inspeksi Sanitasi Dasar",
      definisi: "Persentase rumah yang telah diinspeksi sanitasi dasarnya",
      skor: {
        0: "Tidak ada inspeksi sanitasi (0%)",
        4: "Inspeksi sanitasi 1-25% dari target",
        7: "Inspeksi sanitasi 26-75% dari target",
        10: "Inspeksi sanitasi >75% dari target"
      }
    }
  ];

  const handleValueChange = (indikatorId, value) => {
    setSelectedValues(prev => ({
      ...prev,
      [indikatorId]: parseInt(value)
    }));
  };

  const calculateTotalScore = () => {
    return Object.values(selectedValues).reduce((sum, val) => sum + val, 0);
  };

  const calculateProgress = () => {
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
      {/* Form Penilaian - Left Panel */}
      <div className="lg:col-span-3 space-y-6">
        {mockIndikators.map((indikator) => (
          <Card key={indikator.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {indikator.klaster}
                  </Badge>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {indikator.nama}
                  </CardTitle>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {indikator.definisi}
                  </p>
                </div>
                {selectedValues[indikator.id] !== undefined && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {selectedValues[indikator.id]} poin
                    </Badge>
                  </div>
                )}
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
                        <span>{deskripsi}</span>
                        <Badge 
                          variant={nilai === '10' ? 'default' : nilai === '7' ? 'secondary' : nilai === '4' ? 'outline' : 'destructive'}
                          className="ml-2"
                        >
                          {nilai} poin
                        </Badge>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Simpan Penilaian
          </Button>
        </div>
      </div>

      {/* Sticky Sidebar - Right Panel */}
      <div className="space-y-6">
        {/* Score Summary */}
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

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Distribusi Skor:</h4>
              {[10, 7, 4, 0].map(score => {
                const count = Object.values(selectedValues).filter(val => val === score).length;
                return (
                  <div key={score} className="flex justify-between text-xs">
                    <span className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        score === 10 ? 'bg-green-500' : 
                        score === 7 ? 'bg-blue-500' : 
                        score === 4 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      {score} poin
                    </span>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Tips Pengisian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
              <p>Baca definisi operasional dengan teliti sebelum memilih skor</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
              <p>Pastikan data yang digunakan akurat dan terverifikasi</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
              <p>Simpan secara berkala untuk menghindari kehilangan data</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PenilaianForm;
