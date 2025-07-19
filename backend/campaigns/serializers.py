from rest_framework import serializers
from .models import Campaign, CampaignMilestone

class CampaignMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignMilestone
        fields = '__all__'

class CampaignSerializer(serializers.ModelSerializer):
    milestones = CampaignMilestoneSerializer(many=True, read_only=True)
    progress_percentage = serializers.ReadOnlyField()
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    creator_name = serializers.CharField(source='creator.get_full_name', read_only=True)
    
    class Meta:
        model = Campaign
        fields = '__all__'
        read_only_fields = ('client', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)

class CampaignListSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.ReadOnlyField()
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    
    class Meta:
        model = Campaign
        fields = ['id', 'title', 'status', 'campaign_type', 'budget', 
                 'spent_amount', 'progress_percentage', 'client_name', 
                 'start_date', 'end_date', 'created_at']
