import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { patientApi } from '@/api/patient/patient.api'
import { Button } from '@/components/ui/button'
import { CreatePatientDialog } from '@/components/dialogs/patients/create-patient.dialog'
import { UpdatePatientDialog } from '@/components/dialogs/patients/update-patient.dialog'
import { ConfirmDeletePatientDialog } from '@/components/dialogs/patients/confirm-delete-patient.dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

export default function DoctorPatientsPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [search, setSearch] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editPatient, setEditPatient] = useState<any | null>(null)
  const [deletePatient, setDeletePatient] = useState<any | null>(null)

  const [historyPatient, setHistoryPatient] = useState<any | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [historyForm, setHistoryForm] = useState<{
    conditions: string[];
    allergies: string[];
    surgeries: string[];
    familyHistory?: string;
    lifestyle?: string;
    currentMedications: string[];
    notes?: string;
    conditionsOther?: string;
    allergiesOther?: string;
    surgeriesOther?: string;
  }>({ conditions: [], allergies: [], surgeries: [], currentMedications: [] })
  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['doctor-patients', page, limit, search],
    queryFn: () => patientApi.getPatientsForDoctor({ page, limit, search })
  })

  useEffect(() => {
    refetch()
  }, [page, limit, search, refetch])

  const patients = (data as any)?.data ?? []
  const pagination = (data as any)?.pagination

  const statusColor = (status?: string) =>
    status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : status === 'INACTIVE' ? 'bg-zinc-100 text-zinc-600' : 'bg-amber-100 text-amber-700'

  const openHistory = (p: any) => {
    setHistoryPatient(p)
    // Preload from patient.userInfo/medicalHistory if available
    const mh = p.medicalHistory || {}
    setHistoryForm({
      conditions: mh.conditions || [],
      allergies: mh.allergies || [],
      surgeries: mh.surgeries || [],
      familyHistory: mh.familyHistory || '',
      lifestyle: mh.lifestyle || '',
      currentMedications: mh.currentMedications || [],
      notes: mh.notes || '',
      conditionsOther: mh.conditionsOther || '',
      allergiesOther: mh.allergiesOther || '',
      surgeriesOther: mh.surgeriesOther || ''
    })
    const extras = mh.extras || {}
    const rows = Object.keys(extras).length > 0 ? Object.entries(extras).map(([k,v]: any) => ({ key: k, value: String(v) })) : [{ key: '', value: '' }]
    setCustomFields(rows)
    setIsHistoryOpen(true)
  }

  const saveHistory = async () => {
    if (!historyPatient?.id) return
    try {
      const extras = customFields.filter(f => f.key && f.value).reduce((acc, cur) => { acc[cur.key] = cur.value; return acc; }, {} as Record<string, string>)
      await patientApi.updatePatientHistory(historyPatient.id, { ...historyForm, extras })
      toast.success('Lưu tiền sử bệnh án thành công')
      setIsHistoryOpen(false)
      setHistoryPatient(null)
      refetch()
    } catch {
      toast.error('Không thể lưu tiền sử bệnh án')
    }
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý bệnh nhân</h1>
            <p className="text-muted-foreground">Thêm, sửa, xóa bệnh nhân (bác sĩ)</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="px-3 py-2 rounded-lg border border-border/30 bg-background text-sm"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value) }}
            />
            <select
              className="px-2 py-2 rounded-lg border border-border/30 bg-background text-sm"
              value={limit}
              onChange={(e) => { setPage(1); setLimit(parseInt(e.target.value)) }}
            >
              {[8, 12, 16, 24].map(n => <option key={n} value={n}>{n}/trang</option>)}
            </select>
            <Button onClick={() => setIsCreateOpen(true)}>Thêm bệnh nhân</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">Đang tải...</div>
        ) : isError ? (
          <div className="flex items-center justify-center h-40 text-red-500">Không thể tải danh sách bệnh nhân</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {patients.map((p: any) => (
                <div key={p.id} className="rounded-xl border border-border/20 bg-background shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center text-lg font-semibold">
                      {p.fullName?.charAt(0) || 'P'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-foreground truncate">{p.fullName}</h3>
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${statusColor(p.status)}`}>{p.status || 'UNKNOWN'}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground truncate">{p.phoneNumber}</div>
                      {p.userInfo && (
                        <div className="mt-2 text-xs text-muted-foreground truncate">{p.userInfo.gender} • {p.userInfo.birthYear}</div>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditPatient(p)}>Sửa</Button>
                        <Button variant="outline" size="sm" onClick={() => openHistory(p)}>Tiền sử</Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeletePatient(p)}>Xóa</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Trang {pagination?.currentPage} / {pagination?.totalPages} — Tổng {pagination?.total}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded border border-border/30 hover:bg-accent/30 disabled:opacity-50"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!pagination?.hasPrevPage}
                >
                  Trước
                </button>
                <button
                  className="px-3 py-1 rounded border border-border/30 hover:bg-accent/30 disabled:opacity-50"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!pagination?.hasNextPage}
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dialogs */}
      <CreatePatientDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateSuccess={() => refetch()}
        defaultRole="PATIENT"
        lockRole
      />

      {editPatient && (
        <UpdatePatientDialog
          isOpen={!!editPatient}
          onClose={() => setEditPatient(null)}
          onUpdateSuccess={() => refetch()}
          patient={{ id: editPatient.id, fullName: editPatient.fullName, phoneNumber: editPatient.phoneNumber, role: 'PATIENT' } as any}
        />
      )}

      {deletePatient && (
        <ConfirmDeletePatientDialog
          isOpen={!!deletePatient}
          onClose={() => setDeletePatient(null)}
          onDeleteSuccess={() => refetch()}
          action='delete'
          patient={{ id: deletePatient.id, fullName: deletePatient.fullName } as any}
        />
      )}

      {/* Medical History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Tiền sử bệnh án</DialogTitle>
            <DialogDescription>Nhập/điều chỉnh thông tin tiền sử cho bệnh nhân</DialogDescription>
          </DialogHeader>
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
                <div className='mt-2 grid grid-cols-5 gap-2 items-center'>
                  <span className='text-xs text-muted-foreground col-span-1'>Khác</span>
                  <Input className='col-span-4' placeholder='Nhập bệnh nền khác'
                    value={historyForm.conditionsOther || ''}
                    onChange={(e) => setHistoryForm((p) => ({ ...p, conditionsOther: e.target.value }))}
                  />
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
                <div className='mt-2 grid grid-cols-5 gap-2 items-center'>
                  <span className='text-xs text-muted-foreground col-span-1'>Khác</span>
                  <Input className='col-span-4' placeholder='Nhập dị ứng khác'
                    value={historyForm.allergiesOther || ''}
                    onChange={(e) => setHistoryForm((p) => ({ ...p, allergiesOther: e.target.value }))}
                  />
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
                <div className='mt-2 grid grid-cols-5 gap-2 items-center'>
                  <span className='text-xs text-muted-foreground col-span-1'>Khác</span>
                  <Input className='col-span-4' placeholder='Nhập phẫu thuật khác'
                    value={historyForm.surgeriesOther || ''}
                    onChange={(e) => setHistoryForm((p) => ({ ...p, surgeriesOther: e.target.value }))}
                  />
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
                <div>
                  <div className='text-sm font-medium text-foreground mb-2'>Ghi chú</div>
                  <Input placeholder='Ghi chú khác' value={historyForm.notes || ''} onChange={(e) => setHistoryForm((p) => ({ ...p, notes: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className='grid gap-3'>
              <div className='text-sm font-medium text-foreground'>Thông tin khác</div>
              <div className='space-y-2'>
                {customFields.map((row, idx) => (
                  <div key={idx} className='grid grid-cols-5 gap-2'>
                    <Input className='col-span-2' placeholder='Khóa (ví dụ: Nhóm máu)'
                      value={row.key}
                      onChange={(e) => setCustomFields((prev) => prev.map((r, i) => i === idx ? { ...r, key: e.target.value } : r))}
                    />
                    <Input className='col-span-3' placeholder='Giá trị (ví dụ: O+)'
                      value={row.value}
                      onChange={(e) => setCustomFields((prev) => prev.map((r, i) => i === idx ? { ...r, value: e.target.value } : r))}
                    />
                  </div>) )}
                <div className='flex items-center gap-2'>
                  <Button type='button' variant='outline' size='sm' onClick={() => setCustomFields((p) => [...p, { key: '', value: '' }])}>Thêm dòng</Button>
                  {customFields.length > 1 && (
                    <Button type='button' variant='outline' size='sm' onClick={() => setCustomFields((p) => p.slice(0, -1))}>Bớt dòng</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsHistoryOpen(false)}>Đóng</Button>
            <Button onClick={saveHistory} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
