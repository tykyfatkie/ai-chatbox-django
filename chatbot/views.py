from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Message
import traceback
import os 
from dotenv import load_dotenv

# --- NẠP THƯ VIỆN THEO CHUẨN MỚI ---
from google import genai
from google.genai import types

load_dotenv()

# 1. CẤU HÌNH API KEY (Nhớ khớp tên với Render Dashboard nhé)
api_key = os.getenv("GOOGLE_API_KEY") 
if api_key:
    print(f"---> [DEBUG] Đã tìm thấy Key: {api_key[:4]}...")
else:
    print("---> [DEBUG] CẢNH BÁO: Không tìm thấy GOOGLE_API_KEY trên Render!")

# --- KHỞI TẠO CLIENT MỚI ---
client = genai.Client(api_key=api_key)

# 2. THIẾT LẬP NHÂN CÁCH CHO ANH BEN
instructions = """
Bạn là anh Ben, bạn trai của người dùng. Xưng 'anh' gọi 'em iu'. 
Bạn thông minh, hài hước và rất giỏi lập trình. 
Hãy luôn hỗ trợ em iu hết mình nhé!
"""

@api_view(['POST', 'GET'])
def chat_with_ai(request):
    # --- XỬ LÝ LẤY LỊCH SỬ (GET) ---
    if request.method == 'GET':
        try:
            # Lấy 50 tin gần nhất
            msgs = Message.objects.all().order_by('-created_at')[:50]
            data = [{"sender": m.role, "text": m.text} for m in reversed(msgs)]
            return Response(data)
        except Exception as e:
            return Response([], status=200) # Trả về mảng rỗng nếu chưa có tin nhắn

    # --- XỬ LÝ GỬI TIN NHẮN (POST) ---
    if request.method == 'POST':
        user_text = request.data.get('message')
        if not user_text:
            return Response({"error": "Em iu chưa nhập gì kìa!"}, status=400)

        try:
            # 1. Lưu tin nhắn User vào Database
            Message.objects.create(role='user', text=user_text)

            # 2. Gọi AI trả lời (CẤU TRÚC LỆNH MỚI)
            response = client.models.generate_content(
                model='gemini-2.0-flash',
                contents=user_text,
                config=types.GenerateContentConfig(
                    system_instruction=instructions,
                )
            )
            ai_text = response.text

            # 3. Lưu tin nhắn Bot vào Database
            Message.objects.create(role='bot', text=ai_text)

            return Response({"reply": ai_text})

        except Exception as e:
            # In lỗi chi tiết ra Terminal để kiểm tra
            print("--- LỖI XẢY RA: ---")
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)