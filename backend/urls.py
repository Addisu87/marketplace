from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Import viewsets
from campaigns.views import CampaignViewSet
from messages.views import ConversationViewSet, MessageViewSet
from wallet.views import WalletViewSet, TransactionViewSet, PaymentMethodViewSet
from video_requests.views import VideoRequestViewSet
from notifications.views import NotificationViewSet

# Import API views
from .api_views import dashboard_stats, recent_activity, update_online_status, search_users

# Create router
router = DefaultRouter()
router.register(r'campaigns', CampaignViewSet, basename='campaign')
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'wallet', WalletViewSet, basename='wallet')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'payment-methods', PaymentMethodViewSet, basename='paymentmethod')
router.register(r'video-requests', VideoRequestViewSet, basename='videorequest')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Authentication
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('accounts.urls')),
    
    # API endpoints
    path('api/', include(router.urls)),
    
    # Custom API views
    path('api/dashboard/stats/', dashboard_stats, name='dashboard_stats'),
    path('api/dashboard/activity/', recent_activity, name='recent_activity'),
    path('api/users/online-status/', update_online_status, name='update_online_status'),
    path('api/users/search/', search_users, name='search_users'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
