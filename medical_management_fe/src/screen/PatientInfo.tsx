import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi, PatientFields, UpdatePatientFieldsData, MedicalHistory } from '@/api/profile/profile.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import {
  User,
  Phone,
  Lock,
  MapPin,
  Calendar,
  ArrowLeft,
  Edit,
  Save,
  X,
  Loader2,
  Stethoscope,
  Mail,
  Ruler,
  Weight,
  Plus,
  Trash2,
  Heart,
  AlertTriangle,
  Activity,
  Coffee,
} from 'lucide-react';
import { getGenderLabel } from '@/utils/gender';

export default function PatientInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [patientData, setPatientData] = useState<PatientFields | null>(null);
  const [formData, setFormData] = useState<UpdatePatientFieldsData>({});
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  
  // Medical history form states
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newSurgery, setNewSurgery] = useState('');
  const [lifestyleText, setLifestyleText] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [response, history] = await Promise.all([
        profileApi.getPatientFields(),
        profileApi.getMedicalHistory().catch(() => null)
      ]);
      setPatientData(response);
      setFormData({
        fullName: response.fullName,
        phoneNumber: response.phoneNumber,
        gender: response.profile?.gender,
        birthDate: response.profile?.birthDate || '',
        address: response.profile?.address,
        email: response.profile?.email || '',
        height: response.profile?.height || undefined,
        weight: response.profile?.weight || undefined,
      });
      setMedicalHistory(history);
      if (history) {
        setLifestyleText(history.lifestyle || '');
      }
    } catch (error: any) {
      console.error('Error loading patient data:', error);
      toast.error('Không thể tải thông tin bệnh nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedData = await profileApi.updatePatientFields(formData);
      setPatientData(updatedData);
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error: any) {
      console.error('Error updating patient data:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (patientData) {
      setFormData({
        fullName: patientData.fullName,
        phoneNumber: patientData.phoneNumber,
        gender: patientData.profile?.gender,
        birthDate: patientData.profile?.birthDate || '',
        address: patientData.profile?.address,
        email: patientData.profile?.email || '',
        height: patientData.profile?.height || undefined,
        weight: patientData.profile?.weight || undefined,
      });
    }
  };

  // Medical History Handlers
  const handleAddCondition = async () => {
    if (!newCondition.trim()) return;
    try {
      const updated = await profileApi.addCondition(newCondition.trim());
      setMedicalHistory(updated);
      setNewCondition('');
      toast.success('Thêm tiền sử bệnh thành công');
    } catch (error: any) {
      toast.error('Không thể thêm tiền sử bệnh');
    }
  };

  const handleDeleteCondition = async (index: number) => {
    try {
      const updated = await profileApi.deleteCondition(index);
      setMedicalHistory(updated);
      toast.success('Xóa tiền sử bệnh thành công');
    } catch (error: any) {
      toast.error('Không thể xóa tiền sử bệnh');
    }
  };

  const handleAddAllergy = async () => {
    if (!newAllergy.trim()) return;
    try {
      const updated = await profileApi.addAllergy(newAllergy.trim());
      setMedicalHistory(updated);
      setNewAllergy('');
      toast.success('Thêm dị ứng thành công');
    } catch (error: any) {
      toast.error('Không thể thêm dị ứng');
    }
  };

  const handleDeleteAllergy = async (index: number) => {
    try {
      const updated = await profileApi.deleteAllergy(index);
      setMedicalHistory(updated);
      toast.success('Xóa dị ứng thành công');
    } catch (error: any) {
      toast.error('Không thể xóa dị ứng');
    }
  };

  const handleAddSurgery = async () => {
    if (!newSurgery.trim()) return;
    try {
      const updated = await profileApi.addSurgery(newSurgery.trim());
      setMedicalHistory(updated);
      setNewSurgery('');
      toast.success('Thêm phẫu thuật thành công');
    } catch (error: any) {
      toast.error('Không thể thêm phẫu thuật');
    }
  };

  const handleDeleteSurgery = async (index: number) => {
    try {
      const updated = await profileApi.deleteSurgery(index);
      setMedicalHistory(updated);
      toast.success('Xóa phẫu thuật thành công');
    } catch (error: any) {
      toast.error('Không thể xóa phẫu thuật');
    }
  };

  const handleUpdateLifestyle = async () => {
    try {
      const updated = await profileApi.updateLifestyle(lifestyleText);
      setMedicalHistory(updated);
      toast.success('Cập nhật lối sống thành công');
    } catch (error: any) {
      toast.error('Không thể cập nhật lối sống');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-muted-foreground">Không thể tải thông tin bệnh nhân</p>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Thông tin bệnh nhân</h1>
            <p className="text-muted-foreground">Quản lý hồ sơ sức khỏe và thông tin cá nhân</p>
          </div>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Lưu
            </Button>
          </div>
        )}
      </div>

      {/* Thông tin cơ bản */}
      <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Thông tin cơ bản của bệnh nhân</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    <User className="h-4 w-4 inline mr-2" />
                    Họ và tên
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Số điện thoại
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                {isEditing && (
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      <Lock className="h-4 w-4 inline mr-2" />
                      Mật khẩu mới (tùy chọn)
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Nhập mật khẩu mới nếu muốn thay đổi"
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Thông tin hồ sơ</h3>
                
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="gender">
                        <User className="h-4 w-4 inline mr-2" />
                        Giới tính
                      </Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Nam</SelectItem>
                          <SelectItem value="FEMALE">Nữ</SelectItem>
                          <SelectItem value="OTHER">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthDate">
                        <Calendar className="h-4 w-4 inline mr-2" />
                        Ngày sinh
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate || ''}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        placeholder="Chọn ngày sinh"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">
                        <MapPin className="h-4 w-4 inline mr-2" />
                        Địa chỉ
                      </Label>
                      <Input
                        id="address"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Nhập địa chỉ"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Nhập email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height">
                        <Ruler className="h-4 w-4 inline mr-2" />
                        Chiều cao (cm)
                      </Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height || ''}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder="Nhập chiều cao"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">
                        <Weight className="h-4 w-4 inline mr-2" />
                        Cân nặng (kg)
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight || ''}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder="Nhập cân nặng"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Giới tính</p>
                        <p className="font-semibold">
                          {getGenderLabel(patientData.profile?.gender)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày sinh</p>
                        <p className="font-semibold">
                          {patientData.profile?.birthDate 
                            ? new Date(patientData.profile.birthDate).toLocaleDateString('vi-VN')
                            : 'Chưa cập nhật'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">Địa chỉ</p>
                        <p className="font-semibold truncate">{patientData.profile?.address || 'Chưa cập nhật'}</p>
                      </div>
                    </div>

                    {patientData.profile?.email && (
                      <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-semibold truncate">{patientData.profile.email}</p>
                        </div>
                      </div>
                    )}

                    {(patientData.profile?.height || patientData.profile?.weight) && (
                      <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Chiều cao / Cân nặng</p>
                          <p className="font-semibold">
                            {patientData.profile.height ? `${patientData.profile.height} cm` : '-'} / {patientData.profile.weight ? `${patientData.profile.weight} kg` : '-'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {patientData.createdByUser && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium mb-3">Bác sĩ phụ trách</h3>
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Stethoscope className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{patientData.createdByUser.fullName}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {patientData.createdByUser.phoneNumber}
                        </p>
                        {patientData.createdByUser.majorDoctor && (
                          <Badge variant="secondary" className="mt-2">
                            {patientData.createdByUser.majorDoctor.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Medical History Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Hồ sơ bệnh án</CardTitle>
              <CardDescription>Quản lý tiền sử bệnh, dị ứng, phẫu thuật và lối sống</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="conditions">
                    <Heart className="h-4 w-4 mr-2" />
                    Tiền sử bệnh
                  </TabsTrigger>
                  <TabsTrigger value="allergies">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Dị ứng
                  </TabsTrigger>
                  <TabsTrigger value="surgeries">
                    <Activity className="h-4 w-4 mr-2" />
                    Phẫu thuật
                  </TabsTrigger>
                  <TabsTrigger value="lifestyle">
                    <Coffee className="h-4 w-4 mr-2" />
                    Lối sống
                  </TabsTrigger>
                </TabsList>

                {/* Conditions Tab */}
                <TabsContent value="conditions" className="space-y-4 mt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nhập tiền sử bệnh..."
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCondition()}
                    />
                    <Button onClick={handleAddCondition}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {medicalHistory?.conditions && medicalHistory.conditions.length > 0 ? (
                      medicalHistory.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span>{condition}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCondition(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">Chưa có tiền sử bệnh nào</p>
                    )}
                  </div>
                </TabsContent>

                {/* Allergies Tab */}
                <TabsContent value="allergies" className="space-y-4 mt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nhập dị ứng..."
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                    />
                    <Button onClick={handleAddAllergy}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {medicalHistory?.allergies && medicalHistory.allergies.length > 0 ? (
                      medicalHistory.allergies.map((allergy, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span>{allergy}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAllergy(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">Chưa có dị ứng nào</p>
                    )}
                  </div>
                </TabsContent>

                {/* Surgeries Tab */}
                <TabsContent value="surgeries" className="space-y-4 mt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nhập phẫu thuật..."
                      value={newSurgery}
                      onChange={(e) => setNewSurgery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSurgery()}
                    />
                    <Button onClick={handleAddSurgery}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {medicalHistory?.surgeries && medicalHistory.surgeries.length > 0 ? (
                      medicalHistory.surgeries.map((surgery, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span>{surgery}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSurgery(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">Chưa có phẫu thuật nào</p>
                    )}
                  </div>
                </TabsContent>

                {/* Lifestyle Tab */}
                <TabsContent value="lifestyle" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Thông tin lối sống</Label>
                    <Textarea
                      placeholder="Nhập thông tin về lối sống, thói quen ăn uống, tập thể dục, giấc ngủ, hút thuốc, rượu bia, căng thẳng..."
                      value={lifestyleText}
                      onChange={(e) => setLifestyleText(e.target.value)}
                      rows={6}
                    />
                    <Button onClick={handleUpdateLifestyle}>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu lối sống
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}

