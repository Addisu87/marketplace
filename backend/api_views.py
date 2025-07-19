from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count, Sum
from django.contrib.auth import get_user_model
from django.utils import timezone

from campaigns.models import Campaign
from messages.models import Conversation, OnlineStatus
from wallet.models import Wallet, Transaction
from video_requests.models import VideoRequest
from notifications.models import Notification

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get comprehensive dashboard statistics"""
    user = request.user
    
    # Base stats for all users
    stats = {
        'user_type': user.user_type,
        'verification_status': user.verification_status,
        'member_since': user.created_at,
    }
    
    # Wallet stats
    try:
        wallet = user.wallet
        stats['wallet'] = {
            'balance': wallet.balance,
            'pending_balance': wallet.pending_balance,
            'total_earned': wallet.total_earned,
            'total_withdrawn': wallet.total_withdrawn,
        }
    except:
        stats['wallet'] = {
            'balance': 0,
            'pending_balance': 0,
            'total_earned': 0,
            'total_withdrawn': 0,
        }
    
    # Messages stats
    conversations = Conversation.objects.filter(participants=user)
    unread_messages = 0
    for conv in conversations:
        unread_messages += conv.messages.exclude(sender=user).exclude(read_by__user=user).count()
    
    stats['messages'] = {
        'total_conversations': conversations.count(),
        'unread_messages': unread_messages,
    }
    
    # Notifications
    notifications = user.notifications.filter(is_read=False)
    stats['notifications'] = {
        'unread_count': notifications.count(),
        'urgent_count': notifications.filter(priority='urgent').count(),
    }
    
    # Role-specific stats
    if user.user_type == 'client':
        campaigns = Campaign.objects.filter(client=user)
        video_requests = VideoRequest.objects.filter(client=user)
        
        stats['campaigns'] = {
            'total': campaigns.count(),
            'active': campaigns.filter(status='active').count(),
            'completed': campaigns.filter(status='completed').count(),
            'total_budget': campaigns.aggregate(Sum('budget'))['budget__sum'] or 0,
            'total_spent': campaigns.aggregate(Sum('spent_amount'))['spent_amount__sum'] or 0,
        }
        
        stats['video_requests'] = {
            'total': video_requests.count(),
            'pending': video_requests.filter(status='pending').count(),
            'in_progress': video_requests.filter(status='in_progress').count(),
            'completed': video_requests.filter(status='completed').count(),
        }
        
    elif user.user_type == 'creator':
        assigned_campaigns = Campaign.objects.filter(creator=user)
        assigned_videos = VideoRequest.objects.filter(creator=user)
        
        stats['assigned_work'] = {
            'campaigns': assigned_campaigns.count(),
            'video_requests': assigned_videos.count(),
            'active_campaigns': assigned_campaigns.filter(status='active').count(),
            'pending_videos': assigned_videos.filter(status='pending').count(),
        }
        
        # Earnings this month
        current_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_earnings = Transaction.objects.filter(
            wallet__user=user,
            transaction_type='credit',
            status='completed',
            created_at__gte=current_month
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        stats['earnings'] = {
            'this_month': monthly_earnings,
            'average_rating': user.profile.average_rating if hasattr(user, 'profile') else 0,
            'total_projects': user.profile.total_projects if hasattr(user, 'profile') else 0,
        }
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_activity(request):
    """Get recent user activity"""
    user = request.user
    limit = int(request.GET.get('limit', 10))
    
    activities = []
    
    # Recent transactions
    recent_transactions = Transaction.objects.filter(
        wallet__user=user
    ).order_by('-created_at')[:limit]
    
    for transaction in recent_transactions:
        activities.append({
            'type': 'transaction',
            'title': f"{transaction.transaction_type.title()} - ${transaction.amount}",
            'description': transaction.description,
            'timestamp': transaction.created_at,
            'metadata': {
                'status': transaction.status,
                'reference': transaction.reference,
            }
        })
    
    # Recent messages
    recent_messages = user.sent_messages.order_by('-created_at')[:limit]
    for message in recent_messages:
        activities.append({
            'type': 'message',
            'title': 'Message sent',
            'description': f"To conversation: {message.conversation}",
            'timestamp': message.created_at,
            'metadata': {
                'conversation_id': message.conversation.id,
            }
        })
    
    # Sort by timestamp and limit
    activities.sort(key=lambda x: x['timestamp'], reverse=True)
    activities = activities[:limit]
    
    return Response(activities)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_online_status(request):
    """Update user's online status"""
    is_online = request.data.get('is_online', True)
    
    online_status, created = OnlineStatus.objects.get_or_create(
        user=request.user,
        defaults={'is_online': is_online}
    )
    
    if not created:
        online_status.is_online = is_online
        online_status.save()
    
    return Response({'status': 'updated'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request):
    """Search for users (for adding to conversations, etc.)"""
    query = request.GET.get('q', '')
    user_type = request.GET.get('type', '')
    limit = int(request.GET.get('limit', 10))
    
    if not query:
        return Response([])
    
    users = User.objects.filter(
        Q(username__icontains=query) |
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(email__icontains=query)
    ).exclude(id=request.user.id)
    
    if user_type:
        users = users.filter(user_type=user_type)
    
    users = users[:limit]
    
    results = []
    for user in users:
        results.append({
            'id': user.id,
            'username': user.username,
            'full_name': user.full_name,
            'user_type': user.user_type,
            'avatar': user.avatar.url if user.avatar else None,
            'is_verified': user.is_verified,
            'is_online': hasattr(user, 'online_status') and user.online_status.is_online,
        })
    
    return Response(results)
