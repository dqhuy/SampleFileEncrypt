**Ứng dụng demo:**

- Login bằng face
- Upload file PDF => Chọn loại bảo mật => Mã hóa mã bằng AES. Mỗi user được gán 1 secret key
- Khi xem file => yêu cầu xác thực bằng khuân mặt => giải mã file => Hiện thị file PDF bằng PDFJS
  
**Lưu ý khi chạy:**
 phải chạy /api/train lần đầu để khởi tạo ma trận dữ liệu trước khi login bằng face 
