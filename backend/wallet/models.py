from django.db import models
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()

class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    pending_balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    total_earned = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    total_withdrawn = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    total_spent = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    is_frozen = models.BooleanField(default=False)
    freeze_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Wallet - ${self.balance}"
    
    @property
    def available_balance(self):
        return self.balance if not self.is_frozen else Decimal('0.00')

class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('credit', 'Credit'),
        ('debit', 'Debit'),
        ('transfer', 'Transfer'),
        ('refund', 'Refund'),
        ('fee', 'Fee'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('disputed', 'Disputed'),
    )
    
    CATEGORY_CHOICES = (
        ('payment', 'Payment'),
        ('withdrawal', 'Withdrawal'),
        ('deposit', 'Deposit'),
        ('campaign_payment', 'Campaign Payment'),
        ('platform_fee', 'Platform Fee'),
        ('refund', 'Refund'),
        ('bonus', 'Bonus'),
    )
    
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='payment')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    net_amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=200)
    reference = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # External payment processor fields
    stripe_payment_intent_id = models.CharField(max_length=200, blank=True)
    stripe_transfer_id = models.CharField(max_length=200, blank=True)
    
    # Related objects
    related_campaign = models.ForeignKey('campaigns.Campaign', on_delete=models.SET_NULL, null=True, blank=True)
    related_video_request = models.ForeignKey('video_requests.VideoRequest', on_delete=models.SET_NULL, null=True, blank=True)
    
    metadata = models.JSONField(default=dict, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['wallet', 'status']),
            models.Index(fields=['reference']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.transaction_type.title()} - ${self.amount} - {self.wallet.user.username}"
    
    def save(self, *args, **kwargs):
        # Calculate net amount (amount - fees)
        self.net_amount = self.amount - self.fee_amount
        super().save(*args, **kwargs)

class PaymentMethod(models.Model):
    METHOD_TYPES = (
        ('bank_account', 'Bank Account'),
        ('paypal', 'PayPal'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('crypto', 'Cryptocurrency'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_methods')
    method_type = models.CharField(max_length=20, choices=METHOD_TYPES)
    display_name = models.CharField(max_length=100)
    details = models.JSONField()  # Encrypted payment details
    is_primary = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # External payment processor fields
    stripe_payment_method_id = models.CharField(max_length=200, blank=True)
    stripe_customer_id = models.CharField(max_length=200, blank=True)
    
    verification_data = models.JSONField(default=dict, blank=True)
    last_used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_primary', '-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.display_name}"

class WalletLimit(models.Model):
    LIMIT_TYPES = (
        ('daily_withdrawal', 'Daily Withdrawal'),
        ('monthly_withdrawal', 'Monthly Withdrawal'),
        ('daily_deposit', 'Daily Deposit'),
        ('monthly_deposit', 'Monthly Deposit'),
        ('transaction_amount', 'Single Transaction'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wallet_limits')
    limit_type = models.CharField(max_length=20, choices=LIMIT_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'limit_type']
    
    def __str__(self):
        return f"{self.user.username} - {self.limit_type}: ${self.amount}"
