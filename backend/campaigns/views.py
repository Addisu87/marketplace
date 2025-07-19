from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Campaign, CampaignMilestone
from .serializers import CampaignSerializer, CampaignListSerializer, CampaignMilestoneSerializer

class CampaignViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'campaign_type', 'client']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'start_date', 'budget']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'client':
            return Campaign.objects.filter(client=user)
        elif user.user_type == 'creator':
            return Campaign.objects.filter(creator=user)
        return Campaign.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CampaignListSerializer
        return CampaignSerializer
    
    @action(detail=True, methods=['post'])
    def assign_creator(self, request, pk=None):
        campaign = self.get_object()
        creator_id = request.data.get('creator_id')
        
        if campaign.client != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            creator = User.objects.get(id=creator_id, user_type='creator')
            campaign.creator = creator
            campaign.save()
            
            return Response({'message': 'Creator assigned successfully'})
        except User.DoesNotExist:
            return Response({'error': 'Creator not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        campaign = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Campaign.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        campaign.status = new_status
        campaign.save()
        
        return Response({'message': 'Status updated successfully'})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        user = request.user
        queryset = self.get_queryset()
        
        stats = {
            'total_campaigns': queryset.count(),
            'active_campaigns': queryset.filter(status='active').count(),
            'completed_campaigns': queryset.filter(status='completed').count(),
            'total_budget': sum(c.budget for c in queryset),
            'total_spent': sum(c.spent_amount for c in queryset),
        }
        
        return Response(stats)
