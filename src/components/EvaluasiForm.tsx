
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const EvaluasiForm = () => {
  const [currentTribulan, setCurrentTribulan] = useState(1);
  const [evaluasiData, setEvaluasiData] = useState({
    1: { analisis: '', hambatan: '', rtl: '' },
    2: { analisis: '', hambatan: '', rtl: '' },
    3: { analisis: '', hambatan: '', rtl: '' },
    4: { analisis: '', hambatan: '', rtl: '' }
  });

  const tribunanLabels = {
    1: { label: 'Q1 (Jan-Mar)', period: 'Januari - Maret 2024' },
    2: { label: 'Q2 (Apr-Jun)', period: 'April - Juni 2024' },
    3: { label: 'Q3 (Jul-Sep)', period: 'Juli - September 2024' },
    4: { label: 'Q4 (Okt-Des)', period: 'Oktober - Desember 2024' }
  };

  const handleInputChange = (field, value) => {
    setEvaluasiData(prev => ({
      ...prev,
      [currentTribulan]: {
        ...prev[currentTribulan],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    const currentData = evaluasiData[currentTribulan];
    if (!currentData.analisis.trim() || !currentData.hambatan.trim() || !currentData.rtl.trim()) {
      toast({
        title: "Data belum lengkap",
        description: "Mohon lengkapi semua field evaluasi",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Evaluasi berhasil disimpan",
      description: `Data evaluasi ${tribunanLabels[currentTribulan].label} telah tersimpan`,
    });
  };

  const isDataComplete = (tribunan) => {
    const data = evaluasiData[tribunan];
    return data.analisis.trim() && data.hambatan.trim() && data.rtl.trim();
  };

  return (
    <div className="space-y-6">
      {/* Header dengan Pagination */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-blue-600" />
                Evaluasi Tribulan
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
          <div className="flex items-center justify-center space-x-4">
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
        </CardContent>
      </Card>

      {/* Form Evaluasi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analisis Capaian */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              📊 Analisis Capaian
            </CardTitle>
            <p className="text-sm text-gray-600">
              Jelaskan pencapaian kinerja pada tribulan ini
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Contoh: Pada tribulan ini, capaian imunisasi mencapai 85% dari target yang ditetapkan. Peningkatan signifikan terjadi pada program..."
              value={evaluasiData[currentTribulan].analisis}
              onChange={(e) => handleInputChange('analisis', e.target.value)}
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
              onChange={(e) => handleInputChange('hambatan', e.target.value)}
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
              Rencana perbaikan untuk tribulan selanjutnya
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Contoh: Untuk tribulan selanjutnya, akan dilakukan penambahan jadwal posyandu, pelatihan kader kesehatan, serta sosialisasi intensif ke masyarakat..."
              value={evaluasiData[currentTribulan].rtl}
              onChange={(e) => handleInputChange('rtl', e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <div className="mt-2 text-xs text-gray-500">
              {evaluasiData[currentTribulan].rtl.length}/500 karakter
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Summary */}
      <Card className="shadow-lg">
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

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          <Save className="w-4 h-4 mr-2" />
          Simpan Evaluasi {tribunanLabels[currentTribulan].label}
        </Button>
      </div>
    </div>
  );
};

export default EvaluasiForm;
