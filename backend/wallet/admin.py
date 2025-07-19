from django.contrib import admin
from .models import Wallet, Transaction, PaymentMethod

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'pending_balance', 'total_earned', 'total_withdrawn')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('wallet', 'transaction_type', 'amount', 'status', 'reference', 'created_at')
    list_filter = ('transaction_type', 'status', 'created_at')
    search_fields = ('reference', 'description', 'wallet__user__username')
    readonly_fields = ('created_at',)

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('user', 'method_type', 'is_primary', 'is_verified', 'created_at')
    list_filter = ('method_type', 'is_primary', 'is_verified')
    search_fields = ('user__username',)
