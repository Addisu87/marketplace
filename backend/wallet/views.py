from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
import stripe
from django.conf import settings
from .models import Wallet, Transaction, PaymentMethod
from .serializers import WalletSerializer, TransactionSerializer, PaymentMethodSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY

class WalletViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = WalletSerializer
    
    def get_queryset(self):
        return Wallet.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def balance(self, request):
        wallet, created = Wallet.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(wallet)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_funds(self, request):
        amount = Decimal(str(request.data.get('amount', 0)))
        
        if amount <= 0:
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create Stripe payment intent
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Convert to cents
                currency='usd',
                metadata={'user_id': request.user.id}
            )
            
            # Create pending transaction
            wallet, created = Wallet.objects.get_or_create(user=request.user)
            transaction = Transaction.objects.create(
                wallet=wallet,
                transaction_type='credit',
                amount=amount,
                description=f'Add funds via Stripe',
                reference=f'stripe_{intent.id}',
                stripe_payment_intent_id=intent.id,
                status='pending'
            )
            
            return Response({
                'client_secret': intent.client_secret,
                'transaction_id': transaction.id
            })
            
        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def withdraw_funds(self, request):
        amount = Decimal(str(request.data.get('amount', 0)))
        payment_method_id = request.data.get('payment_method_id')
        
        wallet, created = Wallet.objects.get_or_create(user=request.user)
        
        if amount > wallet.balance:
            return Response({'error': 'Insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            payment_method = PaymentMethod.objects.get(
                id=payment_method_id, 
                user=request.user
            )
            
            # Create withdrawal transaction
            transaction = Transaction.objects.create(
                wallet=wallet,
                transaction_type='debit',
                amount=amount,
                description=f'Withdrawal to {payment_method.method_type}',
                reference=f'withdrawal_{transaction.id}',
                status='pending'
            )
            
            # Process withdrawal (implement actual payment processing)
            # For now, we'll mark as completed
            transaction.status = 'completed'
            transaction.save()
            
            # Update wallet balance
            wallet.balance -= amount
            wallet.total_withdrawn += amount
            wallet.save()
            
            return Response({'message': 'Withdrawal processed successfully'})
            
        except PaymentMethod.DoesNotExist:
            return Response({'error': 'Payment method not found'}, status=status.HTTP_404_NOT_FOUND)

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    
    def get_queryset(self):
        return Transaction.objects.filter(wallet__user=self.request.user)

class PaymentMethodViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentMethodSerializer
    
    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
