from django.db import models
from django.contrib.auth import get_user_model
from campaigns.models import Campaign

User = get_user_model()

class VideoRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('review', 'Under Review'),
        ('revision_requested', 'Revision Requested'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='video_requests')
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_video_requests')
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='video_requests', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    deadline = models.DateTimeField()
    requirements = models.JSONField(default=dict)
    deliverables = models.JSONField(default=list)
    revision_count = models.PositiveIntegerField(default=0)
    max_revisions = models.PositiveIntegerField(default=3)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class VideoSubmission(models.Model):
    video_request = models.ForeignKey(VideoRequest, on_delete=models.CASCADE, related_name='submissions')
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    video_file = models.FileField(upload_to='video_submissions/')
    thumbnail = models.ImageField(upload_to='video_thumbnails/', null=True, blank=True)
    description = models.TextField(blank=True)
    version = models.PositiveIntegerField(default=1)
    is_final = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"Submission for {self.video_request.title} - v{self.version}"

class VideoReview(models.Model):
    REVIEW_STATUS_CHOICES = (
        ('approved', 'Approved'),
        ('revision_requested', 'Revision Requested'),
        ('rejected', 'Rejected'),
    )
    
    submission = models.OneToOneField(VideoSubmission, on_delete=models.CASCADE, related_name='review')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=REVIEW_STATUS_CHOICES)
    feedback = models.TextField()
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    reviewed_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Review for {self.submission.video_request.title} - {self.status}"
