import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  Calendar, 
  Users, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Settings,
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const mockBundleData = [
    { id: 1, tahun: 2024, status: 'aktif', jumlah_klaster: 8, jumlah_indikator: 45, jumlah_puskesmas: 127, progress: 78 },
    { id: 2, tahun: 2023, status: 'selesai', jumlah_klaster: 7, jumlah_indikator: 42, jumlah_puskesmas: 125, progress: 100 },
    { id: 3, tahun: 2022, status: 'selesai', jumlah_klaster: 6, jumlah_indikator: 38, jumlah_puskesmas: 123, progress: 100 }
  ];

  const mockProgressData = [
    { bulan: 'Jan', penilaian: 45, evaluasi: 30 },
    { bulan: 'Feb', penilaian: 67, evaluasi: 45 },
    { bulan: 'Mar', penilaian: 89, evaluasi: 78 },
    { bulan: 'Apr', penilaian: 112, evaluasi: 89 },
    { bulan: 'Mei', penilaian: 127, evaluasi: 102 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bundle Aktif</p>
                <p className="text-3xl font-bold text-blue-600">1</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Puskesmas</p>
                <p className="text-3xl font-bold text-green-600">127</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Perlu Verifikasi</p>
                <p className="text-3xl font-bold text-orange-600">23</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress Keseluruhan</p>
                <p className="text-3xl font-bold text-purple-600">78%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bundle Management */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Management Bundle PKP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBundleData.map((bundle) => (
              <div key={bundle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">Bundle PKP {bundle.tahun}</h3>
                    <p className="text-sm text-gray-600">
                      {bundle.jumlah_klaster} Klaster • {bundle.jumlah_indikator} Indikator • {bundle.jumlah_puskesmas} Puskesmas
                    </p>
                  </div>
                  <Badge variant={bundle.status === 'aktif' ? 'default' : 'secondary'}>
                    {bundle.status === 'aktif' ? 'Aktif' : 'Selesai'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right min-w-[100px]">
                    <p className="text-sm text-gray-600">Progress</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={bundle.progress} className="w-20 h-2" />
                      <span className="text-sm font-medium">{bundle.progress}%</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Progress Penilaian & Evaluasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="penilaian" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="evaluasi" stroke="#8B5CF6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Status Verifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-green-800">Terverifikasi</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">89</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <span className="font-medium text-orange-800">Perlu Verifikasi</span>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">23</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-red-800">Butuh Revisi</span>
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-700">15</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;