from django.contrib import admin
from .models import Conversation, Message, MessageRead

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'conversation_type', 'created_at')
    list_filter = ('conversation_type', 'created_at')
    filter_horizontal = ('participants',)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'conversation', 'message_type', 'status', 'created_at')
    list_filter = ('message_type', 'status', 'created_at')
    search_fields = ('content', 'sender__username')

@admin.register(MessageRead)
class MessageReadAdmin(admin.ModelAdmin):
    list_display = ('message', 'user', 'read_at')
    list_filter = ('read_at',)
