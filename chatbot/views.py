from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import google.generativeai as genai

# 1. CẤU HÌNH API KEY
genai.configure(api_key="AIzaSyDOTIJNHkflxHYVA6LdVjcnu-AC-aLyGvo")

# 2. ĐỊNH NGHĨA MODEL (Đây là dòng bạn đang thiếu)
# Sau khi chạy đoạn loop bên dưới, bạn hãy chọn 1 cái tên xuất hiện trong Terminal.
# Thường là 'gemini-1.5-flash' hoặc 'gemini-1.5-flash-latest'
model = genai.GenerativeModel('gemini-2.5-flash') 

# Đoạn này dùng để kiểm tra danh sách model trong Terminal khi server khởi động
print("--- Danh sách các model khả dụng ---")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"Có thể dùng: {m.name}")
print("------------------------------------")

@api_view(['POST'])
def chat_with_ai(request):
    try:
        # 3. Lấy tin nhắn từ React gửi lên
        user_message = request.data.get('message')
        
        if not user_message:
            return Response({"error": "Vui lòng nhập tin nhắn."}, status=400)

        # 4. Gửi tin nhắn cho Gemini xử lý (Lúc này 'model' đã được định nghĩa ở trên)
        response = model.generate_content(user_message)
        
        # 5. Trả kết quả về cho React
        return Response({"reply": response.text})

    except Exception as e:
        return Response({"error": str(e)}, status=500)