from django.contrib import admin
from .models import Campaign, CampaignMilestone

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'creator', 'status', 'budget', 'start_date', 'end_date')
    list_filter = ('status', 'campaign_type', 'created_at')
    search_fields = ('title', 'client__username', 'creator__username')
    date_hierarchy = 'created_at'

@admin.register(CampaignMilestone)
class CampaignMilestoneAdmin(admin.ModelAdmin):
    list_display = ('title', 'campaign', 'due_date', 'is_completed', 'amount')
    list_filter = ('is_completed', 'due_date')
    search_fields = ('title', 'campaign__title')
