from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
import google.generativeai as genai

# CẤU HÌNH API KEY CỦA BẠN VÀO ĐÂY
genai.configure(api_key="AIzaSyCAmo15BgeFL1uJT-JC6GhP3saY-589AW0")
model = genai.GenerativeModel('gemini-pro')

@api_view(['POST'])
def chat_with_ai(request):
    try:
        # 1. Lấy tin nhắn từ React gửi lên
        user_message = request.data.get('message')
        
        if not user_message:
            return Response({"error": "Vui lòng nhập tin nhắn."}, status=400)

        # 2. Gửi tin nhắn cho Gemini xử lý
        response = model.generate_content(user_message)
        
        # 3. Trả kết quả về cho React
        return Response({"reply": response.text})

    except Exception as e:
        return Response({"error": str(e)}, status=500)