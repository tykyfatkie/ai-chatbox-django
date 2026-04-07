from django.db import models

class Message(models.Model):
    USER_TYPES = (
        ('user', 'User'),
        ('bot', 'Bot'),
    )
    role = models.CharField(max_length=10, choices=USER_TYPES)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True) # Tự động lưu thời gian

    def __str__(self):
        return f"{self.role}: {self.text[:20]}"