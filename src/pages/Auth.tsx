import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, BarChart3, Shield, Users, Building2 } from 'lucide-react';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  
  // Sign in form state
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nama: '',
    role: 'puskesmas' as 'puskesmas' | 'dinkes',
    puskesmas_id: ''
  });

  // Mock puskesmas data for selection
  const mockPuskesmas = [
    { id: 1, nama: 'Puskesmas Cibadak' },
    { id: 2, nama: 'Puskesmas Sukabumi Utara' },
    { id: 3, nama: 'Puskesmas Pelabuhan Ratu' },
    { id: 4, nama: 'Puskesmas Cicurug' },
    { id: 5, nama: 'Puskesmas Cisolok' }
  ];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await auth.signIn(signInData.email, signInData.password);
      
      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "Login berhasil!",
          description: "Selamat datang di PKP Monitor",
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      setLoading(false);
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    if (!signUpData.nama.trim()) {
      setError('Nama harus diisi');
      setLoading(false);
      return;
    }

    if (signUpData.role === 'puskesmas' && !signUpData.puskesmas_id) {
      setError('Pilih puskesmas untuk akun puskesmas');
      setLoading(false);
      return;
    }

    try {
      // Sign up with Supabase Auth
      const { data, error } = await auth.signUp(signUpData.email, signUpData.password);
      
      if (error) {
        throw error;
      }

      if (data.user) {
        // Create user profile
        const profileData = {
          id: data.user.id,
          email: signUpData.email,
          nama: signUpData.nama,
          role: signUpData.role,
          puskesmas_id: signUpData.role === 'puskesmas' ? parseInt(signUpData.puskesmas_id) : null
        };

        const { error: profileError } = await supabase
          .from('users')
          .insert(profileData);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw here, as the user is already created in auth
          toast({
            title: "Akun berhasil dibuat",
            description: "Silakan login dengan akun yang baru dibuat",
            variant: "default"
          });
        } else {
          toast({
            title: "Registrasi berhasil!",
            description: "Akun Anda telah dibuat dan siap digunakan",
          });
        }

        // Switch to sign in tab
        setActiveTab('signin');
        setSignInData({ email: signUpData.email, password: '' });
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">PKP Monitor</h1>
          <p className="text-gray-600">Sistem Penilaian Kinerja Puskesmas</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center text-gray-800">
              Selamat Datang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Masuk</TabsTrigger>
                <TabsTrigger value="signup">Daftar</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Masukkan password"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      'Masuk'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-nama">Nama Lengkap</Label>
                    <Input
                      id="signup-nama"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={signUpData.nama}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, nama: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Peran</Label>
                    <Select 
                      value={signUpData.role} 
                      onValueChange={(value: 'puskesmas' | 'dinkes') => 
                        setSignUpData(prev => ({ ...prev, role: value, puskesmas_id: '' }))
                      }
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="puskesmas">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-green-600" />
                            <span>Puskesmas</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dinkes">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-purple-600" />
                            <span>Dinas Kesehatan</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {signUpData.role === 'puskesmas' && (
                    <div className="space-y-2">
                      <Label htmlFor="signup-puskesmas">Puskesmas</Label>
                      <Select 
                        value={signUpData.puskesmas_id} 
                        onValueChange={(value) => setSignUpData(prev => ({ ...prev, puskesmas_id: value }))}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih puskesmas" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPuskesmas.map((puskesmas) => (
                            <SelectItem key={puskesmas.id} value={puskesmas.id.toString()}>
                              {puskesmas.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Konfirmasi Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Ulangi password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      'Daftar Akun'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Accounts Info */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Akun Demo
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Puskesmas:</strong> puskesmas@demo.com / demo123</p>
              <p><strong>Dinkes:</strong> dinkes@demo.com / demo123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;