import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  Clock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

type Indikator = ScoringIndikator | TargetAchievementIndikator;

interface Klaster {
  id: number;
  nama_klaster: string;
  indikator: Indikator[];
}

interface BundlePKP {
  tahun: number;
  judul: string;
  klaster: Klaster[];
}

const BundleBuilder = () => {
  const [bundle, setBundle] = useState<BundlePKP>({
    tahun: 2025,
    judul: 'Bundle PKP 2025',
    klaster: [
      {
        id: 1,
        nama_klaster: 'Klaster 1: Promosi Kesehatan',
        indikator: [
          {
            id: 1,
            nama_indikator: 'Cakupan Penyuluhan Kesehatan',
            definisi_operasional: 'Persentase kegiatan penyuluhan kesehatan yang dilaksanakan',
            type: 'scoring',
            skor: {
              0: 'Tidak ada kegiatan penyuluhan (0%)',
              4: 'Kegiatan penyuluhan 1-40% dari target',
              7: 'Kegiatan penyuluhan 41-80% dari target',
              10: 'Kegiatan penyuluhan >80% dari target'
            }
          }
        ]
      }
    ]
  });

  const [editingKlaster, setEditingKlaster] = useState<number | null>(null);
  const [editingIndikator, setEditingIndikator] = useState<number | null>(null);

  const addKlaster = () => {
    const newKlaster: Klaster = {
      id: Date.now(),
      nama_klaster: 'Klaster Baru',
      indikator: []
    };
    setBundle(prev => ({
      ...prev,
      klaster: [...prev.klaster, newKlaster]
    }));
  };

  const addIndikator = (klasterId: number, type: 'scoring' | 'target_achievement') => {
    let newIndikator: Indikator;
    
    if (type === 'scoring') {
      newIndikator = {
        id: Date.now(),
        nama_indikator: 'Indikator Baru',
        definisi_operasional: 'Definisi operasional indikator',
        type: 'scoring',
        skor: {
          0: 'Tidak memenuhi kriteria',
          4: 'Memenuhi sebagian kecil kriteria',
          7: 'Memenuhi sebagian besar kriteria',  
          10: 'Memenuhi seluruh kriteria'
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

    setBundle(prev => ({
      ...prev,
      klaster: prev.klaster.map(k => 
        k.id === klasterId 
          ? { ...k, indikator: [...k.indikator, newIndikator] }
          : k
      )
    }));
  };

  const deleteKlaster = (klasterId: number) => {
    setBundle(prev => ({
      ...prev,
      klaster: prev.klaster.filter(k => k.id !== klasterId)
    }));
  };

  const deleteIndikator = (klasterId: number, indikatorId: number) => {
    setBundle(prev => ({
      ...prev,
      klaster: prev.klaster.map(k => 
        k.id === klasterId 
          ? { ...k, indikator: k.indikator.filter(i => i.id !== indikatorId) }
          : k
      )
    }));
  };

  const updateKlasterName = (klasterId: number, nama: string) => {
    setBundle(prev => ({
      ...prev,
      klaster: prev.klaster.map(k => 
        k.id === klasterId ? { ...k, nama_klaster: nama } : k
      )
    }));
  };

  const updateIndikator = (klasterId: number, indikatorId: number, field: string, value: any) => {
    setBundle(prev => ({
      ...prev,
      klaster: prev.klaster.map(k => 
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
    setBundle(prev => ({
      ...prev,
      klaster: prev.klaster.map(k => 
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

  const updateSkor = (klasterId: number, indikatorId: number, skorKey: string, value: string) => {
    setBundle(prev => ({
      ...prev,
      klaster: prev.klaster.map(k => 
        k.id === klasterId 
          ? {
              ...k, 
              indikator: k.indikator.map(i => 
                i.id === indikatorId && i.type === 'scoring'
                  ? { ...i, skor: { ...i.skor, [skorKey]: value } }
                  : i
              )
            }
          : k
      )
    }));
  };

  const saveBundle = () => {
    toast({
      title: "Bundle berhasil disimpan",
      description: `Bundle PKP ${bundle.tahun} telah disimpan`
    });
  };

  const previewBundle = () => {
    toast({
      title: "Preview Bundle",
      description: "Menampilkan preview bundle..."
    });
  };

  const renderIndikatorForm = (klaster: Klaster, indikator: Indikator) => {
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
                        0: 'Tidak memenuhi kriteria',
                        4: 'Memenuhi sebagian kecil kriteria',
                        7: 'Memenuhi sebagian besar kriteria',
                        10: 'Memenuhi seluruh kriteria'
                      }
                    };
                    setBundle(prev => ({
                      ...prev,
                      klaster: prev.klaster.map(k => 
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
                    setBundle(prev => ({
                      ...prev,
                      klaster: prev.klaster.map(k => 
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
                  value={(indikator as ScoringIndikator).skor[key]}
                  onChange={(e) => updateSkor(klaster.id, indikator.id, key, e.target.value)}
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

  return (
    <div className="space-y-6">
      {/* Bundle Header */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
            <FolderPlus className="w-6 h-6 mr-2 text-blue-600" />
            Bundle Builder PKP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tahun">Tahun</Label>
              <Input
                id="tahun"
                type="number"
                value={bundle.tahun}
                onChange={(e) => setBundle(prev => ({ ...prev, tahun: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="judul">Judul Bundle</Label>
              <Input
                id="judul"
                value={bundle.judul}
                onChange={(e) => setBundle(prev => ({ ...prev, judul: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <div className="flex space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {bundle.klaster.length} Klaster
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {bundle.klaster.reduce((total, k) => total + k.indikator.length, 0)} Indikator
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={previewBundle}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={saveBundle} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Save className="w-4 h-4 mr-2" />
                Simpan Bundle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Klaster Builder */}
      <div className="space-y-4">
        {bundle.klaster.map((klaster) => (
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