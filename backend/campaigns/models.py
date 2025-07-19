from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Campaign(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    CAMPAIGN_TYPES = (
        ('video_marketing', 'Video Marketing'),
        ('social_media', 'Social Media'),
        ('influencer', 'Influencer'),
        ('educational', 'Educational'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='campaigns')
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_campaigns')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    campaign_type = models.CharField(max_length=20, choices=CAMPAIGN_TYPES)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    spent_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    start_date = models.DateField()
    end_date = models.DateField()
    requirements = models.JSONField(default=dict)
    deliverables = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def progress_percentage(self):
        if self.budget == 0:
            return 0
        return min(100, (self.spent_amount / self.budget) * 100)

class CampaignMilestone(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.campaign.title} - {self.title}"
