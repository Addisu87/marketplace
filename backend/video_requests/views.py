from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import VideoRequest, VideoSubmission, VideoReview
from .serializers import VideoRequestSerializer, VideoSubmissionSerializer, VideoReviewSerializer

class VideoRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = VideoRequestSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'client', 'creator']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'deadline', 'budget']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'client':
            return VideoRequest.objects.filter(client=user)
        elif user.user_type == 'creator':
            return VideoRequest.objects.filter(creator=user)
        return VideoRequest.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(client=self.request.user)
    
    @action(detail=True, methods=['post'])
    def assign_creator(self, request, pk=None):
        video_request = self.get_object()
        creator_id = request.data.get('creator_id')
        
        if video_request.client != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            creator = User.objects.get(id=creator_id, user_type='creator')
            video_request.creator = creator
            video_request.status = 'in_progress'
            video_request.save()
            
            return Response({'message': 'Creator assigned successfully'})
        except User.DoesNotExist:
            return Response({'error': 'Creator not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def submit_video(self, request, pk=None):
        video_request = self.get_object()
        
        if video_request.creator != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Create video submission
        submission_data = {
            'video_request': video_request.id,
            'creator': request.user.id,
            'video_file': request.FILES.get('video_file'),
            'thumbnail': request.FILES.get('thumbnail'),
            'description': request.data.get('description', ''),
        }
        
        serializer = VideoSubmissionSerializer(data=submission_data)
        if serializer.is_valid():
            submission = serializer.save()
            video_request.status = 'review'
            video_request.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        user = request.user
        queryset = self.get_queryset()
        
        stats = {
            'total_requests': queryset.count(),
            'pending_requests': queryset.filter(status='pending').count(),
            'in_progress_requests': queryset.filter(status='in_progress').count(),
            'completed_requests': queryset.filter(status='completed').count(),
            'total_budget': sum(vr.budget for vr in queryset),
        }
        
        return Response(stats)
