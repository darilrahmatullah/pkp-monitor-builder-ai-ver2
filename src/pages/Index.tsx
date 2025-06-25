import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Dashboard from '@/components/Dashboard';
import PenilaianForm from '@/components/PenilaianForm';
import RekapSkor from '@/components/RekapSkor';
import VerifikasiPanel from '@/components/VerifikasiPanel';
import AdminDashboard from '@/components/AdminDashboard';
import BundleBuilder from '@/components/BundleBuilder';
import { BarChart3, FileText, CheckCircle, Users, Settings, Shield, Award } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<'puskesmas' | 'dinkes'>('puskesmas');

  const handleRoleToggle = (checked: boolean) => {
    setUserRole(checked ? 'dinkes' : 'puskesmas');
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PKP Monitor</h1>
                <p className="text-sm text-gray-500">Penilaian Kinerja Puskesmas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Role Toggle */}
              <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-lg">
                <Label htmlFor="role-toggle" className="text-sm font-medium text-gray-700">
                  Puskesmas
                </Label>
                <Switch
                  id="role-toggle"
                  checked={userRole === 'dinkes'}
                  onCheckedChange={handleRoleToggle}
                />
                <Label htmlFor="role-toggle" className="text-sm font-medium text-gray-700">
                  Dinkes (Admin)
                </Label>
              </div>
              
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Tahun 2024
              </Badge>
              <Badge variant="secondary" className={`${
                userRole === 'dinkes' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
              }`}>
                {userRole === 'puskesmas' ? 'Puskesmas' : 'Dinkes (Admin)'}
                {userRole === 'dinkes' && <Shield className="w-3 h-3 ml-1" />}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === 'puskesmas' ? (
          // User Interface (Puskesmas) - Now 3 tabs with separate Rekap Skor
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-3 bg-white shadow-sm border border-gray-200">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="penilaian" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Penilaian & Evaluasi</span>
              </TabsTrigger>
              <TabsTrigger value="rekap" className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>Rekap Skor</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <Dashboard />
            </TabsContent>

            <TabsContent value="penilaian" className="space-y-6">
              <PenilaianForm />
            </TabsContent>

            <TabsContent value="rekap" className="space-y-6">
              <RekapSkor />
            </TabsContent>
          </Tabs>
        ) : (
          // Admin Interface (Dinkes)
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 bg-white shadow-sm border border-gray-200">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="bundle-builder" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Buat Bundle</span>
              </TabsTrigger>
              <TabsTrigger value="verifikasi" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Verifikasi</span>
              </TabsTrigger>
              <TabsTrigger value="laporan" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Laporan</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <AdminDashboard />
            </TabsContent>

            <TabsContent value="bundle-builder" className="space-y-6">
              <BundleBuilder />
            </TabsContent>

            <TabsContent value="verifikasi" className="space-y-6">
              <VerifikasiPanel />
            </TabsContent>

            <TabsContent value="laporan" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Laporan Komprehensif</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Fitur laporan akan tersedia segera...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Index;