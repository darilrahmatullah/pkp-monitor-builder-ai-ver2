import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Dashboard from '@/components/Dashboard';
import PenilaianForm from '@/components/PenilaianForm';
import RekapSkor from '@/components/RekapSkor';
import VerifikasiPanel from '@/components/VerifikasiPanel';
import AdminDashboard from '@/components/AdminDashboard';
import BundleBuilder from '@/components/BundleBuilder';
import { BarChart3, FileText, CheckCircle, Users, Settings, Shield, Award, LogOut, User, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Load user profile to get role information
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading user profile:', error);
          // If no profile exists, determine role from email for demo accounts
          const roleFromEmail = user.email?.includes('dinkes') ? 'dinkes' : 'puskesmas';
          setUserProfile({
            id: user.id,
            email: user.email,
            nama: user.user_metadata?.nama || user.email?.split('@')[0] || 'User',
            role: roleFromEmail
          });
        } else {
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        // Fallback to email-based role detection
        const roleFromEmail = user.email?.includes('dinkes') ? 'dinkes' : 'puskesmas';
        setUserProfile({
          id: user.id,
          email: user.email,
          nama: user.user_metadata?.nama || user.email?.split('@')[0] || 'User',
          role: roleFromEmail
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const userRole = userProfile?.role || 'puskesmas';
  const userName = userProfile?.nama || user?.user_metadata?.nama || user?.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari sistem",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Gagal logout",
        variant: "destructive"
      });
    }
  };

  // Show loading while determining user role
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat profil pengguna...</p>
        </div>
      </div>
    );
  }

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
              <Badge variant="secondary" className={`${
                userRole === 'dinkes' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
              }`}>
                {userRole === 'puskesmas' ? 'Puskesmas' : 'Dinkes (Admin)'}
                {userRole === 'dinkes' && <Shield className="w-3 h-3 ml-1" />}
              </Badge>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">{userName}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      {userRole === 'dinkes' ? 'Administrator' : 'Puskesmas'}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === 'puskesmas' ? (
          // User Interface (Puskesmas) - 3 tabs
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
          // Admin Interface (Dinkes) - 4 tabs
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