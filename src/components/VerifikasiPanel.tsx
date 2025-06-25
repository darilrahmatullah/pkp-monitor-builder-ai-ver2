
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Eye, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const VerifikasiPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [verifikasiComment, setVerifikasiComment] = useState('');
  const [verifikasiStatus, setVerifikasiStatus] = useState('');

  const mockData = [
    {
      id: 1,
      puskesmas: 'Puskesmas Cibadak',
      periode: 'Juni 2024',
      totalSkor: 842,
      progress: 78,
      status: 'pending',
      tanggalSubmit: '2024-06-15',
      evaluasiSubmit: true
    },
    {
      id: 2,
      puskesmas: 'Puskesmas Sukabumi Utara',
      periode: 'Juni 2024',
      totalSkor: 756,
      progress: 90,
      status: 'approved',
      tanggalSubmit: '2024-06-12',
      evaluasiSubmit: true,
      komentar: 'Data lengkap dan sesuai standar'
    },
    {
      id: 3,
      puskesmas: 'Puskesmas Pelabuhan Ratu',
      periode: 'Juni 2024',
      totalSkor: 680,
      progress: 65,
      status: 'revision',
      tanggalSubmit: '2024-06-18',
      evaluasiSubmit: false,
      komentar: 'Mohon lengkapi data evaluasi tribulan Q2'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'revision':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { variant: 'secondary', label: 'Belum Dicek', className: 'bg-yellow-100 text-yellow-700' },
      approved: { variant: 'default', label: 'Terverifikasi', className: 'bg-green-100 text-green-700' },
      revision: { variant: 'destructive', label: 'Butuh Revisi', className: 'bg-red-100 text-red-700' }
    };
    
    const config = variants[status] || variants.pending;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleVerifikasi = (itemId, newStatus) => {
    if (!verifikasiComment.trim()) {
      toast({
        title: "Komentar diperlukan",
        description: "Mohon berikan komentar verifikasi",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Verifikasi berhasil",
      description: `Status berhasil diubah menjadi ${newStatus}`,
    });

    setSelectedItem(null);
    setVerifikasiComment('');
    setVerifikasiStatus('');
  };

  const filteredData = mockData.filter(item => {
    const matchesSearch = item.puskesmas.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
            Panel Verifikasi - Dinas Kesehatan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari nama puskesmas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Belum Dicek</SelectItem>
                <SelectItem value="approved">Terverifikasi</SelectItem>
                <SelectItem value="revision">Butuh Revisi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Belum Dicek</p>
                <p className="text-2xl font-bold">
                  {mockData.filter(item => item.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Terverifikasi</p>
                <p className="text-2xl font-bold">
                  {mockData.filter(item => item.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Butuh Revisi</p>
                <p className="text-2xl font-bold">
                  {mockData.filter(item => item.status === 'revision').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Daftar Penilaian Masuk ({filteredData.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredData.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.puskesmas}</h3>
                    <p className="text-sm text-gray-600">Periode: {item.periode}</p>
                    <p className="text-xs text-gray-500">Dikirim: {item.tanggalSubmit}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">{item.totalSkor}</div>
                    <div className="text-xs text-gray-600">Total Skor</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">{item.progress}%</div>
                    <div className="text-xs text-gray-600">Progress</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="text-lg font-bold text-purple-600">
                      {item.evaluasiSubmit ? '✓' : '✗'}
                    </div>
                    <div className="text-xs text-gray-600">Evaluasi</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItem(item)}
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>

                {item.komentar && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Komentar:</strong> {item.komentar}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verifikasi Modal/Panel */}
      {selectedItem && (
        <Card className="shadow-xl border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Verifikasi Data - {selectedItem.puskesmas}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Status Verifikasi</label>
                <Select value={verifikasiStatus} onValueChange={setVerifikasiStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Terverifikasi</SelectItem>
                    <SelectItem value="revision">Butuh Revisi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Komentar Verifikasi</label>
              <Textarea
                placeholder="Berikan komentar atau saran untuk puskesmas..."
                value={verifikasiComment}
                onChange={(e) => setVerifikasiComment(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedItem(null);
                  setVerifikasiComment('');
                  setVerifikasiStatus('');
                }}
              >
                Batal
              </Button>
              <Button
                onClick={() => handleVerifikasi(selectedItem.id, verifikasiStatus)}
                disabled={!verifikasiStatus || !verifikasiComment.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Simpan Verifikasi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VerifikasiPanel;
