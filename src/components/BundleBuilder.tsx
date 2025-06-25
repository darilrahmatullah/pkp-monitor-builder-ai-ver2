
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Eye, 
  Copy,
  FolderPlus,
  Target
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Indikator {
  id: number;
  nama_indikator: string;
  definisi_operasional: string;
  skor: {
    0: string;
    4: string;
    7: string;
    10: string;
  };
}

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

  const addIndikator = (klasterId: number) => {
    const newIndikator: Indikator = {
      id: Date.now(),
      nama_indikator: 'Indikator Baru',
      definisi_operasional: 'Definisi operasional indikator',
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

  const updateIndikator = (klasterId: number, indikatorId: number, field: keyof Indikator, value: any) => {
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
                    onClick={() => addIndikator(klaster.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah Indikator
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
              {klaster.indikator.map((indikator, idx) => (
                <div key={indikator.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-500" />
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
                          value={indikator.skor[key]}
                          onChange={(e) => {
                            const newSkor = { ...indikator.skor, [key]: e.target.value };
                            updateIndikator(klaster.id, indikator.id, 'skor', newSkor);
                          }}
                          placeholder={`Deskripsi untuk ${label.toLowerCase()}...`}
                          className="mt-1 text-xs bg-white"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {klaster.indikator.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Belum ada indikator. Klik "Tambah Indikator" untuk mulai.</p>
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
