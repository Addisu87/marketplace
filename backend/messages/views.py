from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Max
from .models import Conversation, Message, MessageRead
from .serializers import ConversationSerializer, MessageSerializer

class ConversationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer
    
    def get_queryset(self):
        return Conversation.objects.filter(
            participants=self.request.user
        ).annotate(
            last_message_time=Max('messages__created_at')
        ).order_by('-last_message_time')
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        messages = conversation.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        
        message_data = {
            'conversation': conversation.id,
            'sender': request.user.id,
            'content': request.data.get('content'),
            'message_type': request.data.get('message_type', 'text'),
        }
        
        serializer = MessageSerializer(data=message_data)
        if serializer.is_valid():
            message = serializer.save()
            
            # Mark conversation as updated
            conversation.save()
            
            # Send real-time notification here (WebSocket)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        conversation = self.get_object()
        messages = conversation.messages.exclude(sender=request.user)
        
        for message in messages:
            MessageRead.objects.get_or_create(
                message=message,
                user=request.user
            )
        
        return Response({'message': 'Messages marked as read'})

class MessageViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        return Message.objects.filter(
            conversation__participants=self.request.user
        )
