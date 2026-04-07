from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Message
import google.generativeai as genai # type: ignore
import traceback
import os 
from dotenv import load_dotenv # type: ignore
import google.generativeai as genai # type: ignore

load_dotenv()

api_key = os.getenv("AIzaSyBAP1ybVfz_Fj1OG4SldT9LT6L2TKyhyQw")
genai.configure(api_key=api_key)

# 1. CẤU HÌNH API KEY (Dán key thật của bạn vào đây)
genai.configure(api_key=os.getenv("AIzaSyBAP1ybVfz_Fj1OG4SldT9LT6L2TKyhyQw"))

# 2. THIẾT LẬP NHÂN CÁCH CHO ANH BEN
instructions = """
Bạn là anh Ben, bạn trai của người dùng. Xưng 'anh' gọi 'em iu'. 
Bạn thông minh, hài hước và rất giỏi lập trình. 
Hãy luôn hỗ trợ em iu hết mình nhé!
"""

model = genai.GenerativeModel(
    model_name='gemini-2.5-flash',
    system_instruction=instructions
)

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

            # 2. Gọi AI trả lời
            response = model.generate_content(user_text)
            ai_text = response.text

            # 3. Lưu tin nhắn Bot vào Database
            Message.objects.create(role='bot', text=ai_text)

            return Response({"reply": ai_text})

        except Exception as e:
            # In lỗi chi tiết ra Terminal để kiểm tra
            print("--- LỖI XẢY RA: ---")
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)