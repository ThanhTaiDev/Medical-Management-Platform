# Hướng Dẫn Cập Nhật Frontend (Thêm Nút Xuất Excel)

## ⚠️ Vấn Đề
Sau khi thêm code mới (nút Xuất Excel), cần rebuild frontend container để thấy thay đổi.

---

## ✅ Các Bước Thực Hiện

### Bước 1: Kiểm Tra Docker Desktop

1. Mở **Docker Desktop** trên Windows
2. Đảm bảo Docker đang chạy (icon Docker ở system tray phải xanh)
3. Nếu chưa chạy, click vào icon Docker Desktop để khởi động

### Bước 2: Mở Terminal/PowerShell

Mở PowerShell hoặc CMD tại thư mục project (`C:\Users\VHDN\medical`)

### Bước 3: Rebuild Frontend

Chạy lệnh sau:

```bash
docker-compose build frontend --no-cache
```

**Lưu ý**: Lệnh này có thể mất 3-5 phút để build xong.

### Bước 4: Restart Frontend Container

```bash
docker-compose up -d frontend
```

### Bước 5: Kiểm Tra Logs

```bash
docker-compose logs frontend --tail 50
```

Nếu thấy message "nginx started" hoặc không có lỗi là OK.

### Bước 6: Refresh Trình Duyệt

1. Mở trình duyệt: http://localhost:9901
2. Vào trang **Quản lý người dùng**
3. **Hard refresh**: 
   - Windows: `Ctrl + F5` hoặc `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

---

## 🔄 Cách Nhanh Nhất (Tất Cả Trong Một)

Chạy lệnh này để rebuild và restart:

```bash
docker-compose build frontend --no-cache && docker-compose up -d frontend
```

Hoặc rebuild toàn bộ project:

```bash
docker-compose down
docker-compose up -d --build
```

---

## 📍 Vị Trí Nút "Xuất Excel"

Sau khi rebuild xong, nút **"Xuất Excel"** sẽ xuất hiện ở:

- **Vị trí**: Góc phải của header, sau dropdown "Hiển thị 12/trang"
- **Giao diện**: Button màu xám (outline) với icon Download và text "Xuất Excel"
- **Chức năng**: Click vào sẽ mở dialog để chọn filters và xuất file Excel

---

## 🐛 Xử Lý Lỗi

### Lỗi: "docker: command not found"
→ Docker Desktop chưa được cài đặt hoặc chưa được thêm vào PATH

### Lỗi: "Cannot connect to the Docker daemon"
→ Docker Desktop chưa chạy. Mở Docker Desktop và đợi nó khởi động xong.

### Lỗi: "port is already allocated"
→ Port 9901 đang được sử dụng. Dừng service đang dùng port đó hoặc đổi port trong `docker-compose.yml`.

### Frontend vẫn không cập nhật
1. Xóa cache trình duyệt
2. Thử mở ở chế độ Incognito/Private
3. Kiểm tra logs: `docker-compose logs frontend`
4. Restart lại container: `docker-compose restart frontend`

---

## ✅ Kiểm Tra Thành Công

Sau khi rebuild, bạn sẽ thấy:

1. ✅ Button "Xuất Excel" ở header (góc phải)
2. ✅ Click vào button sẽ mở dialog
3. ✅ Dialog có các filter: Vai trò, Trạng thái, Từ ngày, Đến ngày
4. ✅ Click "Xuất Excel" sẽ download file `.xlsx`

---

## 📝 Lưu Ý

- **Lần đầu rebuild** có thể mất 5-10 phút
- **Các lần sau** sẽ nhanh hơn (Docker cache)
- **Nếu chỉ sửa code frontend**, chỉ cần rebuild frontend
- **Nếu sửa backend**, cần rebuild backend: `docker-compose build backend --no-cache`

---

*Cập nhật: [Date]*

