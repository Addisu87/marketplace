from rest_framework import serializers
from .models import VideoRequest, VideoSubmission, VideoReview

class VideoRequestSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    creator_name = serializers.CharField(source='creator.get_full_name', read_only=True)
    campaign_title = serializers.CharField(source='campaign.title', read_only=True)
    
    class Meta:
        model = VideoRequest
        fields = '__all__'
        read_only_fields = ('client', 'created_at', 'updated_at', 'revision_count')

class VideoSubmissionSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='creator.get_full_name', read_only=True)
    
    class Meta:
        model = VideoSubmission
        fields = '__all__'
        read_only_fields = ('submitted_at', 'version')

class VideoReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.get_full_name', read_only=True)
    
    class Meta:
        model = VideoReview
        fields = '__all__'
        read_only_fields = ('reviewed_at',)
