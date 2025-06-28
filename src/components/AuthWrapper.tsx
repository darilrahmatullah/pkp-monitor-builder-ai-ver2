import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
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
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nama: '',
    role: 'puskesmas' as 'puskesmas' | 'dinkes',
    puskesmas_id: null as number | null
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

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
  }, []);

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
              puskesmas_id: formData.role === 'puskesmas' ? 1 : null // Default to first puskesmas
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

  // Quick login functions for testing
  const quickLoginDinkes = async () => {
    setFormData({
      email: 'dinkes@test.com',
      password: 'password123',
      nama: '',
      role: 'dinkes',
      puskesmas_id: null
    });
    
    // Try to login first
    const { error } = await supabase.auth.signInWithPassword({
      email: 'dinkes@test.com',
      password: 'password123',
    });

    if (error) {
      // If login fails, register the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: 'dinkes@test.com',
        password: 'password123',
      });

      if (!signUpError && data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: 'dinkes@test.com',
          nama: 'Admin Dinkes',
          role: 'dinkes',
          puskesmas_id: null
        });
      }
    }
  };

  const quickLoginPuskesmas = async () => {
    setFormData({
      email: 'puskesmas@test.com',
      password: 'password123',
      nama: '',
      role: 'puskesmas',
      puskesmas_id: 1
    });
    
    // Try to login first
    const { error } = await supabase.auth.signInWithPassword({
      email: 'puskesmas@test.com',
      password: 'password123',
    });

    if (error) {
      // If login fails, register the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: 'puskesmas@test.com',
        password: 'password123',
      });

      if (!signUpError && data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email: 'puskesmas@test.com',
          nama: 'User Puskesmas',
          role: 'puskesmas',
          puskesmas_id: 1
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Memuat...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {authMode === 'login' ? 'Login' : 'Registrasi'} PKP Monitor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            </form>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              >
                {authMode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Login'}
              </Button>
            </div>

            {/* Quick login buttons for testing */}
            <div className="border-t pt-4 space-y-2">
              <p className="text-sm text-gray-600 text-center">Quick Login (Testing):</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={quickLoginDinkes}>
                  Login Dinkes
                </Button>
                <Button variant="outline" size="sm" onClick={quickLoginPuskesmas}>
                  Login Puskesmas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is logged in but no profile, show profile creation
  if (!userProfile) {
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