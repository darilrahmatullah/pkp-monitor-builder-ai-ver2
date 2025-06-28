import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, testSupabaseConnection } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, UserPlus, AlertTriangle, Database } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

interface AuthWrapperProps {
  children: React.ReactNode;
}

interface UserProfile {
  id: string;
  email: string;
  role: 'puskesmas' | 'dinkes';
  nama: string;
  puskesmas_id: number | null;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'demo'>('demo');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nama: '',
    role: 'puskesmas' as 'puskesmas' | 'dinkes',
    puskesmas_id: null as number | null
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    
    if (!isSupabaseConfigured()) {
      setConnectionStatus('disconnected');
      setLoading(false);
      return;
    }

    const isConnected = await testSupabaseConnection();
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    
    if (isConnected) {
      await getInitialSession();
    } else {
      setLoading(false);
    }
  };

  const getInitialSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error getting session:', error);
    } finally {
      setLoading(false);
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
        return;
      }

      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Login berhasil",
          description: "Selamat datang kembali!",
        });
      } else {
        // Register
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.user) {
          // Create user profile
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: formData.email,
              nama: formData.nama,
              role: formData.role,
              puskesmas_id: formData.role === 'puskesmas' ? 1 : null
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          }

          toast({
            title: "Registrasi berhasil",
            description: "Akun Anda telah dibuat!",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    toast({
      title: "Logout berhasil",
      description: "Sampai jumpa lagi!",
    });
  };

  const enterDemoMode = () => {
    // Create a mock user profile for demo
    const demoProfile: UserProfile = {
      id: 'demo-user',
      email: 'demo@puskesmas.com',
      role: 'puskesmas',
      nama: 'Demo User Puskesmas',
      puskesmas_id: 1
    };
    
    setUserProfile(demoProfile);
    setUser({ id: 'demo-user', email: 'demo@puskesmas.com' } as User);
    
    toast({
      title: "Mode Demo Aktif",
      description: "Anda sedang menggunakan mode demo. Data tidak akan tersimpan.",
    });
  };

  const enterDemoModeAdmin = () => {
    // Create a mock admin profile for demo
    const demoProfile: UserProfile = {
      id: 'demo-admin',
      email: 'admin@dinkes.com',
      role: 'dinkes',
      nama: 'Demo Admin Dinkes',
      puskesmas_id: null
    };
    
    setUserProfile(demoProfile);
    setUser({ id: 'demo-admin', email: 'admin@dinkes.com' } as User);
    
    toast({
      title: "Mode Demo Admin Aktif",
      description: "Anda sedang menggunakan mode demo admin. Data tidak akan tersimpan.",
    });
  };

  if (loading && connectionStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Memeriksa koneksi...</span>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'disconnected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center">
              <Database className="w-6 h-6 mr-2 text-red-500" />
              Koneksi Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Tidak dapat terhubung ke database. Silakan:
                <br />
                1. Periksa file .env Anda
                <br />
                2. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah benar
                <br />
                3. Atau gunakan mode demo untuk melihat aplikasi
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button onClick={enterDemoMode} className="w-full" variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Demo Mode (Puskesmas)
              </Button>
              <Button onClick={enterDemoModeAdmin} className="w-full" variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Demo Mode (Admin Dinkes)
              </Button>
              <Button onClick={checkConnection} className="w-full">
                <Database className="w-4 h-4 mr-2" />
                Coba Koneksi Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {authMode === 'login' ? 'Login' : authMode === 'register' ? 'Registrasi' : 'PKP Monitor'} 
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {authMode === 'demo' ? (
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Pilih mode untuk mengakses aplikasi:
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Button onClick={enterDemoMode} className="w-full" size="lg">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Demo Puskesmas
                  </Button>
                  <Button onClick={enterDemoModeAdmin} className="w-full" size="lg" variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Demo Admin Dinkes
                  </Button>
                </div>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setAuthMode('login')}
                  >
                    Atau login dengan akun Supabase
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>

                {authMode === 'register' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nama">Nama Lengkap</Label>
                      <Input
                        id="nama"
                        value={formData.nama}
                        onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: 'puskesmas' | 'dinkes') => 
                          setFormData(prev => ({ ...prev, role: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="puskesmas">Puskesmas</SelectItem>
                          <SelectItem value="dinkes">Dinkes (Admin)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : authMode === 'login' ? (
                    <LogIn className="w-4 h-4 mr-2" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  {authMode === 'login' ? 'Login' : 'Daftar'}
                </Button>

                <div className="text-center space-y-2">
                  <Button
                    variant="link"
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  >
                    {authMode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Login'}
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => setAuthMode('demo')}
                  >
                    Kembali ke mode demo
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is logged in but no profile, show profile creation
  if (!userProfile && user.id !== 'demo-user' && user.id !== 'demo-admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-gray-800">
              Lengkapi Profil Anda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const { error } = await supabase
                  .from('users')
                  .insert({
                    id: user.id,
                    email: user.email!,
                    nama: formData.nama,
                    role: formData.role,
                    puskesmas_id: formData.role === 'puskesmas' ? 1 : null
                  });

                if (error) throw error;

                await loadUserProfile(user.id);
                toast({
                  title: "Profil berhasil dibuat",
                  description: "Selamat datang di PKP Monitor!",
                });
              } catch (error: any) {
                toast({
                  title: "Error",
                  description: error.message,
                  variant: "destructive"
                });
              }
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: 'puskesmas' | 'dinkes') => 
                    setFormData(prev => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="puskesmas">Puskesmas</SelectItem>
                    <SelectItem value="dinkes">Dinkes (Admin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Simpan Profil
              </Button>
            </form>

            <Button variant="outline" onClick={handleSignOut} className="w-full">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pass user profile to children
  return (
    <div>
      {React.cloneElement(children as React.ReactElement, { 
        userProfile, 
        onSignOut: handleSignOut 
      })}
    </div>
  );
};

export default AuthWrapper;