
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Dashboard from '@/components/Dashboard';
import PenilaianForm from '@/components/PenilaianForm';
import EvaluasiForm from '@/components/EvaluasiForm';
import VerifikasiPanel from '@/components/VerifikasiPanel';
import { BarChart3, FileText, CheckCircle, Users } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole] = useState('puskesmas'); // Could be 'puskesmas' or 'dinkes'

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
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Tahun 2024
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {userRole === 'puskesmas' ? 'Puskesmas' : 'Dinkes'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 bg-white shadow-sm border border-gray-200">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="penilaian" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Penilaian</span>
            </TabsTrigger>
            <TabsTrigger value="evaluasi" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Evaluasi</span>
            </TabsTrigger>
            {userRole === 'dinkes' && (
              <TabsTrigger value="verifikasi" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Verifikasi</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="penilaian" className="space-y-6">
            <PenilaianForm />
          </TabsContent>

          <TabsContent value="evaluasi" className="space-y-6">
            <EvaluasiForm />
          </TabsContent>

          {userRole === 'dinkes' && (
            <TabsContent value="verifikasi" className="space-y-6">
              <VerifikasiPanel />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
