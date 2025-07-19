from rest_framework import serializers
from .models import Wallet, Transaction, PaymentMethod

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

class TransactionSerializer(serializers.ModelSerializer):
    wallet_user = serializers.CharField(source='wallet.user.username', read_only=True)
    
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('created_at',)

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
        extra_kwargs = {
            'details': {'write_only': True}  # Don't expose sensitive payment details
        }
