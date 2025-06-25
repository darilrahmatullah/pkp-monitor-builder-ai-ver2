import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Award, Target, Download, Filter, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const RekapSkor = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedKlaster, setSelectedKlaster] = useState('all');

  // Mock data for demonstration
  const mockScoreData = {
    totalSkor: 842,
    maxSkor: 1000,
    rataRata: 8.4,
    progress: 84.2,
    rank: 3,
    totalPuskesmas: 127
  };

  const mockKlasterData = [
    { nama: 'Klaster 1: Promosi Kesehatan', skor: 85, maxSkor: 100, progress: 85, indikator: 12, terisi: 10 },
    { nama: 'Klaster 2: Kesehatan Lingkungan', skor: 70, maxSkor: 100, progress: 70, indikator: 8, terisi: 6 },
    { nama: 'Klaster 3: Kesehatan Ibu & Anak', skor: 92, maxSkor: 100, progress: 92, indikator: 15, terisi: 14 },
    { nama: 'Klaster 4: Gizi Masyarakat', skor: 60, maxSkor: 100, progress: 60, indikator: 10, terisi: 6 },
    { nama: 'Klaster 5: Pencegahan Penyakit', skor: 78, maxSkor: 100, progress: 78, indikator: 12, terisi: 9 },
    { nama: 'Klaster 6: Pelayanan Kesehatan', skor: 88, maxSkor: 100, progress: 88, indikator: 18, terisi: 16 }
  ];

  const mockTrendData = [
    { bulan: 'Jan', skor: 720 },
    { bulan: 'Feb', skor: 745 },
    { bulan: 'Mar', skor: 768 },
    { bulan: 'Apr', skor: 785 },
    { bulan: 'Mei', skor: 802 },
    { bulan: 'Jun', skor: 820 },
    { bulan: 'Jul', skor: 835 },
    { bulan: 'Agu', skor: 842 },
    { bulan: 'Sep', skor: 842 },
    { bulan: 'Okt', skor: 842 },
    { bulan: 'Nov', skor: 842 },
    { bulan: 'Des', skor: 842 }
  ];

  const mockComparison = [
    { kategori: 'Sangat Baik (>90)', jumlah: 2, color: '#10B981' },
    { kategori: 'Baik (80-90)', jumlah: 2, color: '#3B82F6' },
    { kategori: 'Cukup (70-80)', jumlah: 1, color: '#F59E0B' },
    { kategori: 'Perlu Perbaikan (<70)', jumlah: 1, color: '#EF4444' }
  ];

  const handleExportData = () => {
    toast({
      title: "Export berhasil",
      description: "Data rekap skor telah diunduh dalam format Excel",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Sangat Baik';
    if (score >= 80) return 'Baik';
    if (score >= 70) return 'Cukup';
    return 'Perlu Perbaikan';
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
                Rekap Skor PKP
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Ringkasan dan analisis skor penilaian kinerja puskesmas
              </p>
            </div>
            <Button onClick={handleExportData} className="bg-gradient-to-r from-green-600 to-blue-600">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={selectedKlaster} onValueChange={setSelectedKlaster}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter Klaster" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Klaster</SelectItem>
                  <SelectItem value="1">Klaster 1: Promosi Kesehatan</SelectItem>
                  <SelectItem value="2">Klaster 2: Kesehatan Lingkungan</SelectItem>
                  <SelectItem value="3">Klaster 3: Kesehatan Ibu & Anak</SelectItem>
                  <SelectItem value="4">Klaster 4: Gizi Masyarakat</SelectItem>
                  <SelectItem value="5">Klaster 5: Pencegahan Penyakit</SelectItem>
                  <SelectItem value="6">Klaster 6: Pelayanan Kesehatan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Skor</p>
                <p className="text-3xl font-bold">{mockScoreData.totalSkor}</p>
                <p className="text-xs text-blue-100">dari {mockScoreData.maxSkor} maksimal</p>
              </div>
              <Award className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Rata-rata Nilai</p>
                <p className="text-3xl font-bold">{mockScoreData.rataRata}</p>
                <p className="text-xs text-green-100">dari skala 10</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Progress Keseluruhan</p>
                <p className="text-3xl font-bold">{mockScoreData.progress}%</p>
                <p className="text-xs text-purple-100">pencapaian target</p>
              </div>
              <Target className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Peringkat</p>
                <p className="text-3xl font-bold">#{mockScoreData.rank}</p>
                <p className="text-xs text-orange-100">dari {mockScoreData.totalPuskesmas} puskesmas</p>
              </div>
              <Award className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Status */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Status Pencapaian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${getScoreColor(mockScoreData.progress)}`}>
                {Math.round(mockScoreData.progress)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{getScoreLabel(mockScoreData.progress)}</h3>
                <p className="text-gray-600">Skor: {mockScoreData.totalSkor} dari {mockScoreData.maxSkor}</p>
                <Progress value={mockScoreData.progress} className="w-64 mt-2" />
              </div>
            </div>
            <Badge className={`text-lg px-4 py-2 ${getScoreColor(mockScoreData.progress)}`}>
              {mockScoreData.progress}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Tren Skor Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" />
                <YAxis domain={[700, 900]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="skor" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Distribusi Skor per Klaster</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockComparison}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ kategori, jumlah }) => `${jumlah} klaster`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="jumlah"
                >
                  {mockComparison.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {mockComparison.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.kategori}</span>
                  </div>
                  <span className="font-medium">{item.jumlah} klaster</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Klaster Breakdown */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Rincian Skor per Klaster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockKlasterData.map((klaster, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{klaster.nama}</h3>
                    <p className="text-sm text-gray-600">
                      {klaster.terisi} dari {klaster.indikator} indikator terisi
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">{klaster.skor}</div>
                      <div className="text-xs text-gray-500">dari {klaster.maxSkor}</div>
                    </div>
                    <Badge className={getScoreColor(klaster.progress)}>
                      {klaster.progress}%
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress Pengisian</span>
                    <span>{Math.round((klaster.terisi / klaster.indikator) * 100)}%</span>
                  </div>
                  <Progress value={(klaster.terisi / klaster.indikator) * 100} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Pencapaian Skor</span>
                    <span>{klaster.progress}%</span>
                  </div>
                  <Progress value={klaster.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Statistik Ringkasan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">75</div>
              <div className="text-sm text-gray-600">Total Indikator</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">61</div>
              <div className="text-sm text-gray-600">Indikator Terisi</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">14</div>
              <div className="text-sm text-gray-600">Belum Terisi</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">81%</div>
              <div className="text-sm text-gray-600">Kelengkapan Data</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RekapSkor;