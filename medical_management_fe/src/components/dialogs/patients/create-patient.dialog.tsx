"use client"

import { patientApi } from "@/api/patient/patient.api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Zod schema for create patient form
export const createPatientSchema = z.object({
  fullName: z
    .string()
    .min(1, "Họ và tên là bắt buộc")
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được quá 100 ký tự")
    .trim(),
  phoneNumber: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số")
    .trim(),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được quá 50 ký tự"),
  role: z
    .string()
    .min(1, "Vui lòng chọn loại tài khoản")
    .refine((val) => ["ADMIN", "DOCTOR", "PATIENT"].includes(val), {
      message: "Loại tài khoản không hợp lệ"
    })
});

type CreatePatientFormData = z.infer<typeof createPatientSchema>;

export function CreatePatientDialog({ isOpen, onClose, onCreateSuccess, defaultRole = '', lockRole = false }: { isOpen: boolean, onClose: () => void, onCreateSuccess: () => void, defaultRole?: 'ADMIN' | 'DOCTOR' | 'PATIENT' | '', lockRole?: boolean }) {
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false)
  const [createdPatientId, setCreatedPatientId] = useState<string | null>(null)
  const [isHistoryStep, setIsHistoryStep] = useState(false)
  const [historyForm, setHistoryForm] = useState<{
    conditions: string[];
    allergies: string[];
    surgeries: string[];
    familyHistory?: string;
    lifestyle?: string;
    currentMedications: string[];
    notes?: string;
  }>({ conditions: [], allergies: [], surgeries: [], currentMedications: [] })
  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }])

  const defaultValues: CreatePatientFormData = {
    fullName: '',
    phoneNumber: '',
    password: '',
    role: defaultRole || ''
  };

  const form = useForm<CreatePatientFormData>({
    resolver: zodResolver(createPatientSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  });


  const createPatientMutation = useMutation({
    mutationFn: patientApi.createPatientService,
    onSuccess: (res: any) => {
      const newId = res?.data?.id || res?.id;
      setCreatedPatientId(newId || null);
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Tạo bệnh nhân thành công");
      // Move to history step
      setIsHistoryStep(true)
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi tạo bệnh nhân");
    },
  });

  const onSubmit = (data: CreatePatientFormData) => {
    const payload = { ...data, role: lockRole ? (defaultRole || 'PATIENT') : data.role } as CreatePatientFormData;
    createPatientMutation.mutate(payload);
  };

  const submitHistory = async () => {
    if (!createdPatientId) {
      onCreateSuccess();
      onClose();
      return;
    }
    try {
      const extras = customFields.filter(f => f.key && f.value).reduce((acc, cur) => { acc[cur.key] = cur.value; return acc; }, {} as Record<string, string>)
      await patientApi.updatePatientHistory(createdPatientId, { ...historyForm, extras })
      toast.success('Lưu tiền sử bệnh án thành công')
    } catch {
      toast.error('Không thể lưu tiền sử bệnh án')
    } finally {
      form.reset()
      setIsHistoryStep(false)
      setCreatedPatientId(null)
      onCreateSuccess()
      onClose()
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{isHistoryStep ? 'Tiền sử bệnh án' : 'Thêm bệnh nhân'}</DialogTitle>
          <DialogDescription>
            {isHistoryStep ? 'Nhập nhanh các thông tin tiền sử, có thể cập nhật sau' : 'Thêm bệnh nhân mới'}
          </DialogDescription>
        </DialogHeader>
        {!isHistoryStep ? (
          <Form {...form}>
            <form 
              id='create-patient-form' 
              onSubmit={form.handleSubmit(onSubmit)} 
              className='space-y-6'
            >
              <div className="grid gap-4">
               
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Họ và tên</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input placeholder="Nhập họ và tên" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Input type="tel" placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Nhập mật khẩu"
                          className="pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={togglePasswordVisibility}
                          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {!lockRole && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Loại tài khoản</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                            <SelectItem value="DOCTOR">Bác sĩ</SelectItem>
                            <SelectItem value="PATIENT">Bệnh nhân</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Hủy</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={createPatientMutation.isPending}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                >
                  {createPatientMutation.isPending ? "Đang tạo..." : "Thêm mới"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <div className='text-sm font-medium text-foreground mb-2'>Bệnh nền</div>
                <div className='flex flex-wrap gap-2'>
                  {['Đái tháo đường', 'Tăng huyết áp', 'Hen phế quản', 'Tim mạch'].map((c) => (
                    <label key={c} className='inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border/30 text-sm cursor-pointer'>
                      <Checkbox checked={historyForm.conditions.includes(c)} onCheckedChange={(v) => {
                        const checked = !!v;
                        setHistoryForm((prev) => ({
                          ...prev,
                          conditions: checked ? Array.from(new Set([...prev.conditions, c])) : prev.conditions.filter(x => x !== c)
                        }));
                      }} />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <Input placeholder='Khác...' className='w-56' onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        setHistoryForm((p) => ({ ...p, conditions: Array.from(new Set([...(p.conditions || []), val])) }));
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }} />
                  <Button type='button' variant='outline' size='sm' onClick={(e) => {
                    const input = (e.currentTarget.previousSibling as HTMLInputElement);
                    const val = input?.value?.trim();
                    if (val) {
                      setHistoryForm((p) => ({ ...p, conditions: Array.from(new Set([...(p.conditions || []), val])) }));
                      input.value = '';
                    }
                  }}>Thêm</Button>
                </div>
              </div>
              <div>
                <div className='text-sm font-medium text-foreground mb-2'>Dị ứng</div>
                <div className='flex flex-wrap gap-2'>
                  {['Penicillin', 'Hải sản', 'Phấn hoa'].map((c) => (
                    <label key={c} className='inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border/30 text-sm cursor-pointer'>
                      <Checkbox checked={historyForm.allergies.includes(c)} onCheckedChange={(v) => {
                        const checked = !!v;
                        setHistoryForm((prev) => ({
                          ...prev,
                          allergies: checked ? Array.from(new Set([...prev.allergies, c])) : prev.allergies.filter(x => x !== c)
                        }));
                      }} />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <Input placeholder='Khác...' className='w-56' onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        setHistoryForm((p) => ({ ...p, allergies: Array.from(new Set([...(p.allergies || []), val])) }));
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }} />
                  <Button type='button' variant='outline' size='sm' onClick={(e) => {
                    const input = (e.currentTarget.previousSibling as HTMLInputElement);
                    const val = input?.value?.trim();
                    if (val) {
                      setHistoryForm((p) => ({ ...p, allergies: Array.from(new Set([...(p.allergies || []), val])) }));
                      input.value = '';
                    }
                  }}>Thêm</Button>
                </div>
              </div>
              <div>
                <div className='text-sm font-medium text-foreground mb-2'>Phẫu thuật</div>
                <div className='flex flex-wrap gap-2'>
                  {['Cắt ruột thừa', 'Mổ tim', 'Mổ đẻ'].map((c) => (
                    <label key={c} className='inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border/30 text-sm cursor-pointer'>
                      <Checkbox checked={historyForm.surgeries.includes(c)} onCheckedChange={(v) => {
                        const checked = !!v;
                        setHistoryForm((prev) => ({
                          ...prev,
                          surgeries: checked ? Array.from(new Set([...prev.surgeries, c])) : prev.surgeries.filter(x => x !== c)
                        }));
                      }} />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <Input placeholder='Khác...' className='w-56' onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        setHistoryForm((p) => ({ ...p, surgeries: Array.from(new Set([...(p.surgeries || []), val])) }));
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }} />
                  <Button type='button' variant='outline' size='sm' onClick={(e) => {
                    const input = (e.currentTarget.previousSibling as HTMLInputElement);
                    const val = input?.value?.trim();
                    if (val) {
                      setHistoryForm((p) => ({ ...p, surgeries: Array.from(new Set([...(p.surgeries || []), val])) }));
                      input.value = '';
                    }
                  }}>Thêm</Button>
                </div>
              </div>
              <div className='grid gap-3'>
                <div>
                  <div className='text-sm font-medium text-foreground mb-2'>Tiền sử gia đình</div>
                  <Input placeholder='Ví dụ: Tiểu đường, tim mạch...' value={historyForm.familyHistory || ''} onChange={(e) => setHistoryForm((p) => ({ ...p, familyHistory: e.target.value }))} />
                </div>
                <div>
                  <div className='text-sm font-medium text-foreground mb-2'>Lối sống</div>
                  <Input placeholder='Ví dụ: Hút thuốc, rượu bia, ít vận động...' value={historyForm.lifestyle || ''} onChange={(e) => setHistoryForm((p) => ({ ...p, lifestyle: e.target.value }))} />
                </div>
                <div>
                  <div className='text-sm font-medium text-foreground mb-2'>Thuốc đang dùng</div>
                  <Input placeholder='Nhập tên thuốc, ngăn cách bởi dấu phẩy' value={historyForm.currentMedications.join(', ')} onChange={(e) => setHistoryForm((p) => ({ ...p, currentMedications: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} />
                </div>
              </div>
            </div>
            <div className='grid gap-3'>
              <div className='text-sm font-medium text-foreground'>Thông tin khác</div>
              <div className='space-y-2'>
                {customFields.map((row, idx) => (
                  <div key={idx} className='grid grid-cols-5 gap-2'>
                    <Input className='col-span-2' placeholder='Khóa (ví dụ: Nhóm máu)' value={row.key} onChange={(e) => {
                      setCustomFields((prev) => prev.map((r, i) => i === idx ? { ...r, key: e.target.value } : r))
                    }} />
                    <Input className='col-span-3' placeholder='Giá trị (ví dụ: O+)'
                      value={row.value}
                      onChange={(e) => setCustomFields((prev) => prev.map((r, i) => i === idx ? { ...r, value: e.target.value } : r))}
                    />
                  </div>
                ))}
                <div className='flex items-center gap-2'>
                  <Button type='button' variant='outline' size='sm' onClick={() => setCustomFields((p) => [...p, { key: '', value: '' }])}>Thêm dòng</Button>
                  {customFields.length > 1 && (
                    <Button type='button' variant='outline' size='sm' onClick={() => setCustomFields((p) => p.slice(0, -1))}>Bớt dòng</Button>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => { setIsHistoryStep(false); setCreatedPatientId(null); onCreateSuccess(); onClose(); }}>Bỏ qua</Button>
              <Button onClick={submitHistory} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">Lưu</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
