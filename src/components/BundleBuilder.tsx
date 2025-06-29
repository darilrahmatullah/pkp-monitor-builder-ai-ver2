import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Eye, 
  Copy,
  FolderPlus,
  Target,
  Calendar,
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import type { 
  Bundle, 
  BundleInsert, 
  Klaster, 
  KlasterInsert, 
  Indikator, 
  IndikatorInsert,
  ScoringIndikatorInsert,
  TargetAchievementIndikatorInsert 
} from '@/types/database';

interface ScoringIndikator {
  id: number;
  nama_indikator: string;
  definisi_operasional: string;
  type: 'scoring';
  skor: {
    0: string;
    4: string;
    7: string;
    10: string;
  };
}

interface TargetAchievementIndikator {
  id: number;
  nama_indikator: string;
  definisi_operasional: string;
  type: 'target_achievement';
  target_info: {
    target_percentage: number;
    total_sasaran: number;
    satuan: string;
    periodicity: 'annual' | 'monthly';
  };
}

type IndikatorLocal = ScoringIndikator | TargetAchievementIndikator;

interface KlasterLocal {
  id: number;
  nama_klaster: string;
  indikator: IndikatorLocal[];
  isNew?: boolean;
}

interface BundlePKP {
  id?: number;
  tahun: number;
  judul: string;
  status: 'draft' | 'active' | 'completed';
  deskripsi?: string;
  klaster: KlasterLocal[];
  isNew?: boolean;
}

const BundleBuilder = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<BundlePKP | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingKlaster, setEditingKlaster] = useState<number | null>(null);
  const [editingIndikator, setEditingIndikator] = useState<number | null>(null);

  // Load existing bundles
  useEffect(() => {
    loadBundles();
  }, []);

  const loadBundles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .order('tahun', { ascending: false });

      if (error) {
        console.error('Error loading bundles:', error);
        throw error;
      }
      setBundles(data || []);
    } catch (error) {
      console.error('Error loading bundles:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data bundle: " + (error?.message || 'Unknown error'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBundleDetails = async (bundleId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bundles')
        .select(`
          *,
          klasters (
            *,
            indikators (
              *,
              scoring_indikators (*),
              target_achievement_indikators (*)
            )
          )
        `)
        .eq('id', bundleId)
        .single();

      if (error) {
        console.error('Error loading bundle details:', error);
        throw error;
      }

      console.log('Raw bundle data from database:', data);

      // Transform database data to local format
      const transformedBundle: BundlePKP = {
        id: data.id,
        tahun: data.tahun,
        judul: data.judul,
        status: data.status,
        deskripsi: data.deskripsi,
        klaster: data.klasters?.map((k: any) => ({
          id: k.id,
          nama_klaster: k.nama_klaster,
          indikator: k.indikators?.map((i: any) => {
            if (i.type === 'scoring') {
              const scoringData = i.scoring_indikators?.[0];
              console.log('Loading scoring data for indikator:', i.nama_indikator, scoringData);
              
              return {
                id: i.id,
                nama_indikator: i.nama_indikator,
                definisi_operasional: i.definisi_operasional,
                type: 'scoring' as const,
                skor: {
                  0: scoringData?.skor_0 || '',
                  4: scoringData?.skor_4 || '',
                  7: scoringData?.skor_7 || '',
                  10: scoringData?.skor_10 || ''
                }
              };
            } else {
              const targetData = i.target_achievement_indikators?.[0];
              return {
                id: i.id,
                nama_indikator: i.nama_indikator,
                definisi_operasional: i.definisi_operasional,
                type: 'target_achievement' as const,
                target_info: {
                  target_percentage: targetData?.target_percentage || 80,
                  total_sasaran: targetData?.total_sasaran || 100,
                  satuan: targetData?.satuan || 'unit',
                  periodicity: targetData?.periodicity || 'annual'
                }
              };
            }
          }) || []
        })) || []
      };

      console.log('Transformed bundle data:', transformedBundle);
      setSelectedBundle(transformedBundle);
    } catch (error) {
      console.error('Error loading bundle details:', error);
      toast({
        title: "Error",
        description: "Gagal memuat detail bundle: " + (error?.message || 'Unknown error'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewBundle = () => {
    const currentYear = new Date().getFullYear();
    const newBundle: BundlePKP = {
      tahun: currentYear + 1,
      judul: `Bundle PKP ${currentYear + 1}`,
      status: 'draft',
      deskripsi: '',
      klaster: [],
      isNew: true
    };
    setSelectedBundle(newBundle);
  };

  const addKlaster = () => {
    if (!selectedBundle) return;
    
    const newKlaster: KlasterLocal = {
      id: Date.now(),
      nama_klaster: 'Klaster Baru',
      indikator: [],
      isNew: true
    };
    
    setSelectedBundle(prev => ({
      ...prev!,
      klaster: [...prev!.klaster, newKlaster]
    }));
  };

  const addIndikator = (klasterId: number, type: 'scoring' | 'target_achievement') => {
    if (!selectedBundle) return;

    let newIndikator: IndikatorLocal;
    
    if (type === 'scoring') {
      newIndikator = {
        id: Date.now(),
        nama_indikator: 'Indikator Baru',
        definisi_operasional: 'Definisi operasional indikator',
        type: 'scoring',
        skor: {
          0: '',
          4: '',
          7: '',
          10: ''
        }
      };
    } else {
      newIndikator = {
        id: Date.now(),
        nama_indikator: 'Indikator Target Baru',
        definisi_operasional: 'Definisi operasional indikator target',
        type: 'target_achievement',
        target_info: {
          target_percentage: 80,
          total_sasaran: 100,
          satuan: 'unit',
          periodicity: 'annual'
        }
      };
    }

    setSelectedBundle(prev => ({
      ...prev!,
      klaster: prev!.klaster.map(k => 
        k.id === klasterId 
          ? { ...k, indikator: [...k.indikator, newIndikator] }
          : k
      )
    }));
  };

  const deleteKlaster = (klasterId: number) => {
    if (!selectedBundle) return;
    
    setSelectedBundle(prev => ({
      ...prev!,
      klaster: prev!.klaster.filter(k => k.id !== klasterId)
    }));
  };

  const deleteIndikator = (klasterId: number, indikatorId: number) => {
    if (!selectedBundle) return;
    
    setSelectedBundle(prev => ({
      ...prev!,
      klaster: prev!.klaster.map(k => 
        k.id === klasterId 
          ? { ...k, indikator: k.indikator.filter(i => i.id !== indikatorId) }
          : k
      )
    }));
  };

  const updateKlasterName = (klasterId: number, nama: string) => {
    if (!selectedBundle) return;
    
    setSelectedBundle(prev => ({
      ...prev!,
      klaster: prev!.klaster.map(k => 
        k.id === klasterId ? { ...k, nama_klaster: nama } : k
      )
    }));
  };

  const updateIndikator = (klasterId: number, indikatorId: number, field: string, value: any) => {
    if (!selectedBundle) return;
    
    setSelectedBundle(prev => ({
      ...prev!,
      klaster: prev!.klaster.map(k => 
        k.id === klasterId 
          ? {
              ...k, 
              indikator: k.indikator.map(i => 
                i.id === indikatorId ? { ...i, [field]: value } : i
              )
            }
          : k
      )
    }));
  };

  const updateTargetInfo = (klasterId: number, indikatorId: number, field: string, value: any) => {
    if (!selectedBundle) return;
    
    setSelectedBundle(prev => ({
      ...prev!,
      klaster: prev!.klaster.map(k => 
        k.id === klasterId 
          ? {
              ...k, 
              indikator: k.indikator.map(i => 
                i.id === indikatorId && i.type === 'target_achievement'
                  ? { ...i, target_info: { ...i.target_info, [field]: value } }
                  : i
              )
            }
          : k
      )
    }));
  };

  // Fixed updateSkor function with proper state management
  const updateSkor = (klasterId: number, indikatorId: number, skorKey: string, value: string) => {
    if (!selectedBundle) return;
    
    console.log('Updating skor:', { klasterId, indikatorId, skorKey, value });
    
    setSelectedBundle(prev => {
      if (!prev) return prev;
      
      const newBundle = {
        ...prev,
        klaster: prev.klaster.map(k => {
          if (k.id !== klasterId) return k;
          
          return {
            ...k,
            indikator: k.indikator.map(i => {
              if (i.id !== indikatorId || i.type !== 'scoring') return i;
              
              const updatedIndikator = {
                ...i,
                skor: {
                  ...i.skor,
                  [skorKey]: value
                }
              };
              
              console.log('Updated indikator skor:', updatedIndikator);
              return updatedIndikator;
            })
          };
        })
      };
      
      console.log('New bundle state after skor update:', newBundle);
      return newBundle;
    });
  };

  const saveBundle = async () => {
    if (!selectedBundle) return;

    setSaving(true);
    try {
      console.log('Starting save process for bundle:', selectedBundle);

      // Validate bundle data
      if (!selectedBundle.judul.trim()) {
        throw new Error('Judul bundle harus diisi');
      }

      if (selectedBundle.klaster.length === 0) {
        throw new Error('Bundle harus memiliki minimal 1 klaster');
      }

      // Check if year already exists (for new bundles)
      if (selectedBundle.isNew) {
        const { data: existingBundle } = await supabase
          .from('bundles')
          .select('id')
          .eq('tahun', selectedBundle.tahun)
          .single();

        if (existingBundle) {
          throw new Error(`Bundle untuk tahun ${selectedBundle.tahun} sudah ada`);
        }
      }

      let bundleId = selectedBundle.id;

      // Save or update bundle
      if (selectedBundle.isNew) {
        console.log('Creating new bundle...');
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error getting user:', userError);
          throw new Error('Tidak dapat mengidentifikasi user');
        }

        const bundleData: BundleInsert = {
          tahun: selectedBundle.tahun,
          judul: selectedBundle.judul,
          status: selectedBundle.status,
          deskripsi: selectedBundle.deskripsi || null,
          created_by: user?.id || null
        };

        console.log('Bundle data to insert:', bundleData);

        const { data: newBundle, error: bundleError } = await supabase
          .from('bundles')
          .insert(bundleData)
          .select()
          .single();

        if (bundleError) {
          console.error('Error creating bundle:', bundleError);
          throw new Error(`Gagal membuat bundle: ${bundleError.message}`);
        }

        console.log('Bundle created successfully:', newBundle);
        bundleId = newBundle.id;
      } else {
        console.log('Updating existing bundle...');
        const { error: updateError } = await supabase
          .from('bundles')
          .update({
            judul: selectedBundle.judul,
            status: selectedBundle.status,
            deskripsi: selectedBundle.deskripsi || null
          })
          .eq('id', bundleId);

        if (updateError) {
          console.error('Error updating bundle:', updateError);
          throw new Error(`Gagal mengupdate bundle: ${updateError.message}`);
        }
      }

      // Save klasters and indikators
      for (const klaster of selectedBundle.klaster) {
        let klasterId = klaster.id;

        if (klaster.isNew || klaster.id > 1000000) { // New klaster (using timestamp as temp ID)
          console.log('Creating new klaster:', klaster.nama_klaster);
          
          const klasterData: KlasterInsert = {
            bundle_id: bundleId!,
            nama_klaster: klaster.nama_klaster,
            urutan: selectedBundle.klaster.indexOf(klaster) + 1
          };

          const { data: newKlaster, error: klasterError } = await supabase
            .from('klasters')
            .insert(klasterData)
            .select()
            .single();

          if (klasterError) {
            console.error('Error creating klaster:', klasterError);
            throw new Error(`Gagal membuat klaster: ${klasterError.message}`);
          }

          klasterId = newKlaster.id;
        } else {
          // Update existing klaster
          console.log('Updating existing klaster:', klaster.nama_klaster);
          const { error: updateError } = await supabase
            .from('klasters')
            .update({
              nama_klaster: klaster.nama_klaster,
              urutan: selectedBundle.klaster.indexOf(klaster) + 1
            })
            .eq('id', klasterId);

          if (updateError) {
            console.error('Error updating klaster:', updateError);
            throw new Error(`Gagal mengupdate klaster: ${updateError.message}`);
          }
        }

        // Save indikators
        for (const indikator of klaster.indikator) {
          let indikatorId = indikator.id;

          if (indikator.id > 1000000) { // New indikator (using timestamp as temp ID)
            console.log('Creating new indikator:', indikator.nama_indikator);
            
            const indikatorData: IndikatorInsert = {
              klaster_id: klasterId,
              nama_indikator: indikator.nama_indikator,
              definisi_operasional: indikator.definisi_operasional,
              type: indikator.type,
              urutan: klaster.indikator.indexOf(indikator) + 1
            };

            const { data: newIndikator, error: indikatorError } = await supabase
              .from('indikators')
              .insert(indikatorData)
              .select()
              .single();

            if (indikatorError) {
              console.error('Error creating indikator:', indikatorError);
              throw new Error(`Gagal membuat indikator: ${indikatorError.message}`);
            }

            indikatorId = newIndikator.id;

            // Save indikator details
            if (indikator.type === 'scoring') {
              console.log('Creating scoring details for indikator:', indikator.nama_indikator);
              console.log('Scoring data to save:', indikator.skor);
              
              const scoringData: ScoringIndikatorInsert = {
                indikator_id: indikatorId,
                skor_0: indikator.skor[0] || '',
                skor_4: indikator.skor[4] || '',
                skor_7: indikator.skor[7] || '',
                skor_10: indikator.skor[10] || ''
              };

              console.log('Scoring data to insert:', scoringData);

              const { error: scoringError } = await supabase
                .from('scoring_indikators')
                .insert(scoringData);

              if (scoringError) {
                console.error('Error creating scoring details:', scoringError);
                throw new Error(`Gagal membuat detail scoring: ${scoringError.message}`);
              }
            } else {
              console.log('Creating target achievement details for indikator:', indikator.nama_indikator);
              
              const targetData: TargetAchievementIndikatorInsert = {
                indikator_id: indikatorId,
                target_percentage: indikator.target_info.target_percentage,
                total_sasaran: indikator.target_info.total_sasaran,
                satuan: indikator.target_info.satuan,
                periodicity: indikator.target_info.periodicity
              };

              const { error: targetError } = await supabase
                .from('target_achievement_indikators')
                .insert(targetData);

              if (targetError) {
                console.error('Error creating target achievement details:', targetError);
                throw new Error(`Gagal membuat detail target: ${targetError.message}`);
              }
            }
          } else {
            // Update existing indikator
            console.log('Updating existing indikator:', indikator.nama_indikator);
            const { error: updateError } = await supabase
              .from('indikators')
              .update({
                nama_indikator: indikator.nama_indikator,
                definisi_operasional: indikator.definisi_operasional,
                urutan: klaster.indikator.indexOf(indikator) + 1
              })
              .eq('id', indikatorId);

            if (updateError) {
              console.error('Error updating indikator:', updateError);
              throw new Error(`Gagal mengupdate indikator: ${updateError.message}`);
            }

            // Update indikator details
            if (indikator.type === 'scoring') {
              console.log('Updating scoring details for indikator:', indikator.nama_indikator);
              console.log('Scoring data to update:', indikator.skor);
              
              const { error: scoringError } = await supabase
                .from('scoring_indikators')
                .update({
                  skor_0: indikator.skor[0] || '',
                  skor_4: indikator.skor[4] || '',
                  skor_7: indikator.skor[7] || '',
                  skor_10: indikator.skor[10] || ''
                })
                .eq('indikator_id', indikatorId);

              if (scoringError) {
                console.error('Error updating scoring details:', scoringError);
                throw new Error(`Gagal mengupdate detail scoring: ${scoringError.message}`);
              }
            } else {
              const { error: targetError } = await supabase
                .from('target_achievement_indikators')
                .update({
                  target_percentage: indikator.target_info.target_percentage,
                  total_sasaran: indikator.target_info.total_sasaran,
                  satuan: indikator.target_info.satuan,
                  periodicity: indikator.target_info.periodicity
                })
                .eq('indikator_id', indikatorId);

              if (targetError) {
                console.error('Error updating target achievement details:', targetError);
                throw new Error(`Gagal mengupdate detail target: ${targetError.message}`);
              }
            }
          }
        }
      }

      console.log('Bundle saved successfully!');

      toast({
        title: "Berhasil!",
        description: `Bundle PKP ${selectedBundle.tahun} telah disimpan`,
      });

      // Reload bundles and clear selection
      await loadBundles();
      setSelectedBundle(null);

    } catch (error: any) {
      console.error('Error saving bundle:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan bundle",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const activateBundle = async (bundleId: number) => {
    try {
      // First, deactivate all other bundles
      await supabase
        .from('bundles')
        .update({ status: 'completed' })
        .neq('id', bundleId)
        .eq('status', 'active');

      // Then activate the selected bundle
      const { error } = await supabase
        .from('bundles')
        .update({ status: 'active' })
        .eq('id', bundleId);

      if (error) throw error;

      toast({
        title: "Bundle Diaktifkan",
        description: "Bundle berhasil diaktifkan dan bundle lain telah dinonaktifkan",
      });

      await loadBundles();
    } catch (error) {
      console.error('Error activating bundle:', error);
      toast({
        title: "Error",
        description: "Gagal mengaktifkan bundle",
        variant: "destructive"
      });
    }
  };

  const renderIndikatorForm = (klaster: KlasterLocal, indikator: IndikatorLocal) => {
    return (
      <div key={indikator.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              {indikator.type === 'target_achievement' ? (
                <Target className="w-4 h-4 text-green-500" />
              ) : (
                <Target className="w-4 h-4 text-blue-500" />
              )}
              <Input
                value={indikator.nama_indikator}
                onChange={(e) => updateIndikator(klaster.id, indikator.id, 'nama_indikator', e.target.value)}
                className="font-medium"
                placeholder="Nama indikator..."
              />
            </div>
            <Textarea
              value={indikator.definisi_operasional}
              onChange={(e) => updateIndikator(klaster.id, indikator.id, 'definisi_operasional', e.target.value)}
              placeholder="Definisi operasional..."
              className="text-sm"
            />
            
            {/* Type Selection */}
            <div className="flex items-center space-x-4">
              <Label className="text-sm font-medium">Tipe Penilaian:</Label>
              <RadioGroup
                value={indikator.type}
                onValueChange={(value) => {
                  // Convert existing indicator to new type
                  if (value === 'scoring' && indikator.type === 'target_achievement') {
                    const newIndikator: ScoringIndikator = {
                      id: indikator.id,
                      nama_indikator: indikator.nama_indikator,
                      definisi_operasional: indikator.definisi_operasional,
                      type: 'scoring',
                      skor: {
                        0: '',
                        4: '',
                        7: '',
                        10: ''
                      }
                    };
                    setSelectedBundle(prev => ({
                      ...prev!,
                      klaster: prev!.klaster.map(k => 
                        k.id === klaster.id 
                          ? { ...k, indikator: k.indikator.map(i => i.id === indikator.id ? newIndikator : i) }
                          : k
                      )
                    }));
                  } else if (value === 'target_achievement' && indikator.type === 'scoring') {
                    const newIndikator: TargetAchievementIndikator = {
                      id: indikator.id,
                      nama_indikator: indikator.nama_indikator,
                      definisi_operasional: indikator.definisi_operasional,
                      type: 'target_achievement',
                      target_info: {
                        target_percentage: 80,
                        total_sasaran: 100,
                        satuan: 'unit',
                        periodicity: 'annual'
                      }
                    };
                    setSelectedBundle(prev => ({
                      ...prev!,
                      klaster: prev!.klaster.map(k => 
                        k.id === klaster.id 
                          ? { ...k, indikator: k.indikator.map(i => i.id === indikator.id ? newIndikator : i) }
                          : k
                      )
                    }));
                  }
                }}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scoring" id={`scoring-${indikator.id}`} />
                  <Label htmlFor={`scoring-${indikator.id}`} className="text-sm">Sistem Skor (0-10)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="target_achievement" id={`target-${indikator.id}`} />
                  <Label htmlFor={`target-${indikator.id}`} className="text-sm">Target & Capaian</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => deleteIndikator(klaster.id, indikator.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        <Separator className="my-3" />
        
        {indikator.type === 'scoring' ? (
          // Scoring System Form
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: '0' as const, label: 'Skor 0', color: 'bg-red-50 border-red-200' },
              { key: '4' as const, label: 'Skor 4', color: 'bg-yellow-50 border-yellow-200' },
              { key: '7' as const, label: 'Skor 7', color: 'bg-blue-50 border-blue-200' },
              { key: '10' as const, label: 'Skor 10', color: 'bg-green-50 border-green-200' }
            ].map(({ key, label, color }) => (
              <div key={key} className={`p-2 rounded border ${color}`}>
                <Label className="text-xs font-medium text-gray-700">{label}</Label>
                <Textarea
                  value={(indikator as ScoringIndikator).skor[key] || ''}
                  onChange={(e) => {
                    console.log(`Updating ${label} with value:`, e.target.value);
                    updateSkor(klaster.id, indikator.id, key, e.target.value);
                  }}
                  placeholder={`Deskripsi untuk ${label.toLowerCase()}...`}
                  className="mt-1 text-xs bg-white"
                  rows={2}
                />
              </div>
            ))}
          </div>
        ) : (
          // Target Achievement System Form
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">Target (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={(indikator as TargetAchievementIndikator).target_info.target_percentage}
                  onChange={(e) => updateTargetInfo(klaster.id, indikator.id, 'target_percentage', parseInt(e.target.value) || 0)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">Total Sasaran</Label>
                <Input
                  type="number"
                  min="0"
                  value={(indikator as TargetAchievementIndikator).target_info.total_sasaran}
                  onChange={(e) => updateTargetInfo(klaster.id, indikator.id, 'total_sasaran', parseInt(e.target.value) || 0)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">Satuan</Label>
                <Input
                  value={(indikator as TargetAchievementIndikator).target_info.satuan}
                  onChange={(e) => updateTargetInfo(klaster.id, indikator.id, 'satuan', e.target.value)}
                  placeholder="orang, tempat, kasus..."
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">Periodisitas</Label>
                <Select
                  value={(indikator as TargetAchievementIndikator).target_info.periodicity}
                  onValueChange={(value) => updateTargetInfo(klaster.id, indikator.id, 'periodicity', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>Tahunan (Akumulatif)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="monthly">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span>Bulanan (Per Bulan)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Periodicity Explanation */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                {(indikator as TargetAchievementIndikator).target_info.periodicity === 'annual' ? (
                  <Calendar className="w-4 h-4 text-blue-500 mt-0.5" />
                ) : (
                  <Clock className="w-4 h-4 text-green-500 mt-0.5" />
                )}
                <div className="text-xs text-blue-800">
                  <strong>
                    {(indikator as TargetAchievementIndikator).target_info.periodicity === 'annual' 
                      ? 'Target Tahunan (Akumulatif):' 
                      : 'Target Bulanan (Per Bulan):'
                    }
                  </strong>
                  <br />
                  {(indikator as TargetAchievementIndikator).target_info.periodicity === 'annual' 
                    ? 'Target ini akan dibagi menjadi 4 triwulan. Capaian bersifat akumulatif sepanjang tahun.'
                    : 'Target ini dihitung per bulan. Capaian triwulan adalah total dari 3 bulan dalam periode tersebut.'
                  }
                </div>
              </div>
            </div>
            
            {/* Preview Calculation */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-xs text-gray-700">
                <strong>Preview Perhitungan:</strong>
                <br />
                {(() => {
                  const { target_percentage, total_sasaran, satuan, periodicity } = (indikator as TargetAchievementIndikator).target_info;
                  const targetSasaran = Math.round((target_percentage / 100) * total_sasaran);
                  
                  if (periodicity === 'annual') {
                    const quarterlyTarget = Math.round(targetSasaran / 4);
                    return `Target per triwulan: ${quarterlyTarget} ${satuan} (${targetSasaran} ${satuan} ÷ 4 triwulan)`;
                  } else {
                    const quarterlyTarget = Math.round(targetSasaran * 3);
                    return `Target per triwulan: ${quarterlyTarget} ${satuan} (${targetSasaran} ${satuan}/bulan × 3 bulan)`;
                  }
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Memuat data...</span>
      </div>
    );
  }

  if (!selectedBundle) {
    return (
      <div className="space-y-6">
        {/* Bundle List Header */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                  <FolderPlus className="w-6 h-6 mr-2 text-blue-600" />
                  Management Bundle PKP
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Kelola bundle penilaian kinerja puskesmas
                </p>
              </div>
              <Button 
                onClick={createNewBundle}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Bundle Baru
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Bundle List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <Card key={bundle.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {bundle.judul}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Tahun {bundle.tahun}</p>
                    {bundle.deskripsi && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {bundle.deskripsi}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge 
                      variant={bundle.status === 'active' ? 'default' : bundle.status === 'draft' ? 'secondary' : 'outline'}
                      className={
                        bundle.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : bundle.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    >
                      {bundle.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {bundle.status === 'draft' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {bundle.status === 'active' ? 'Aktif' : bundle.status === 'draft' ? 'Draft' : 'Selesai'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Dibuat: {new Date(bundle.created_at).toLocaleDateString('id-ID')}</span>
                  <span>Diupdate: {new Date(bundle.updated_at).toLocaleDateString('id-ID')}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadBundleDetails(bundle.id)}
                    className="flex-1"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  {bundle.status !== 'active' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aktifkan
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Aktifkan Bundle</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin mengaktifkan bundle "{bundle.judul}"? 
                            Bundle yang sedang aktif akan dinonaktifkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => activateBundle(bundle.id)}>
                            Ya, Aktifkan
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {bundles.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="text-center py-12">
              <FolderPlus className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum Ada Bundle</h3>
              <p className="text-gray-500 mb-4">Mulai dengan membuat bundle PKP pertama Anda</p>
              <Button 
                onClick={createNewBundle}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Bundle Baru
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bundle Header */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
                <FolderPlus className="w-6 h-6 mr-2 text-blue-600" />
                {selectedBundle.isNew ? 'Buat Bundle Baru' : `Edit Bundle: ${selectedBundle.judul}`}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {selectedBundle.isNew ? 'Buat bundle PKP baru dengan klaster dan indikator' : 'Edit bundle PKP yang sudah ada'}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSelectedBundle(null)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Kembali
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tahun">Tahun</Label>
              <Input
                id="tahun"
                type="number"
                value={selectedBundle.tahun}
                onChange={(e) => setSelectedBundle(prev => ({ ...prev!, tahun: parseInt(e.target.value) }))}
                disabled={!selectedBundle.isNew}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="judul">Judul Bundle</Label>
              <Input
                id="judul"
                value={selectedBundle.judul}
                onChange={(e) => setSelectedBundle(prev => ({ ...prev!, judul: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={selectedBundle.status}
                onValueChange={(value: 'draft' | 'active' | 'completed') => 
                  setSelectedBundle(prev => ({ ...prev!, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label>
            <Textarea
              id="deskripsi"
              value={selectedBundle.deskripsi || ''}
              onChange={(e) => setSelectedBundle(prev => ({ ...prev!, deskripsi: e.target.value }))}
              placeholder="Deskripsi bundle..."
            />
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <div className="flex space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {selectedBundle.klaster.length} Klaster
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {selectedBundle.klaster.reduce((total, k) => total + k.indikator.length, 0)} Indikator
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={saveBundle} 
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Bundle
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Klaster Builder */}
      <div className="space-y-4">
        {selectedBundle.klaster.map((klaster) => (
          <Card key={klaster.id} className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {editingKlaster === klaster.id ? (
                    <Input
                      value={klaster.nama_klaster}
                      onChange={(e) => updateKlasterName(klaster.id, e.target.value)}
                      onBlur={() => setEditingKlaster(null)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingKlaster(null)}
                      className="text-lg font-semibold"
                    />
                  ) : (
                    <CardTitle 
                      className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                      onClick={() => setEditingKlaster(klaster.id)}
                    >
                      {klaster.nama_klaster}
                      <Edit3 className="w-4 h-4 ml-2 inline text-gray-400" />
                    </CardTitle>
                  )}
                  <p className="text-sm text-gray-600 mt-1">
                    {klaster.indikator.length} indikator
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addIndikator(klaster.id, 'scoring')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Skor
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addIndikator(klaster.id, 'target_achievement')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Target
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteKlaster(klaster.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {klaster.indikator.map((indikator) => renderIndikatorForm(klaster, indikator))}
              
              {klaster.indikator.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Belum ada indikator. Klik "Skor" atau "Target" untuk mulai.</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Klaster Button */}
      <Card className="shadow-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="p-8 text-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={addKlaster}
            className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Klaster Baru
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BundleBuilder;