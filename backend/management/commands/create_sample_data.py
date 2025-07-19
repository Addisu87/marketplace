from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from campaigns.models import Campaign
from wallet.models import Wallet, Transaction
from decimal import Decimal
import random
from datetime import date, timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Create sample data for development'

    def handle(self, *args, **options):
        # Create users
        client_user, created = User.objects.get_or_create(
            username='client1',
            defaults={
                'email': 'client@example.com',
                'user_type': 'client',
                'first_name': 'John',
                'last_name': 'Doe'
            }
        )
        if created:
            client_user.set_password('password123')
            client_user.save()

        creator_user, created = User.objects.get_or_create(
            username='creator1',
            defaults={
                'email': 'creator@example.com',
                'user_type': 'creator',
                'first_name': 'Jane',
                'last_name': 'Smith'
            }
        )
        if created:
            creator_user.set_password('password123')
            creator_user.save()

        # Create wallets
        client_wallet, _ = Wallet.objects.get_or_create(
            user=client_user,
            defaults={
                'balance': Decimal('5000.00'),
                'total_earned': Decimal('10000.00'),
                'total_withdrawn': Decimal('5000.00')
            }
        )

        creator_wallet, _ = Wallet.objects.get_or_create(
            user=creator_user,
            defaults={
                'balance': Decimal('8945.67'),
                'total_earned': Decimal('24624.57'),
                'total_withdrawn': Decimal('15678.90')
            }
        )

        # Create sample campaigns
        campaigns_data = [
            {
                'title': 'Summer Product Launch',
                'description': 'Create engaging video content for our new product launch',
                'campaign_type': 'video_marketing',
                'budget': Decimal('5000.00'),
                'spent_amount': Decimal('3750.00'),
                'status': 'active',
            },
            {
                'title': 'Brand Awareness Campaign',
                'description': 'Social media campaign to increase brand visibility',
                'campaign_type': 'social_media',
                'budget': Decimal('3200.00'),
                'spent_amount': Decimal('1440.00'),
                'status': 'active',
            },
            {
                'title': 'Holiday Promotion',
                'description': 'Seasonal promotional content for holiday sales',
                'campaign_type': 'influencer',
                'budget': Decimal('2800.00'),
                'spent_amount': Decimal('2800.00'),
                'status': 'completed',
            }
        ]

        for campaign_data in campaigns_data:
            Campaign.objects.get_or_create(
                title=campaign_data['title'],
                defaults={
                    **campaign_data,
                    'client': client_user,
                    'creator': creator_user,
                    'start_date': date.today() - timedelta(days=30),
                    'end_date': date.today() + timedelta(days=30),
                }
            )

        # Create sample transactions
        transactions_data = [
            {
                'transaction_type': 'credit',
                'amount': Decimal('2500.00'),
                'description': 'Payment from TechCorp Inc.',
                'status': 'completed',
            },
            {
                'transaction_type': 'debit',
                'amount': Decimal('1000.00'),
                'description': 'Withdrawal to Bank Account',
                'status': 'completed',
            },
            {
                'transaction_type': 'credit',
                'amount': Decimal('1800.00'),
                'description': 'Payment from Fashion Brand',
                'status': 'completed',
            }
        ]

        for i, transaction_data in enumerate(transactions_data):
            Transaction.objects.get_or_create(
                reference=f'TXN-00123{i}',
                defaults={
                    **transaction_data,
                    'wallet': creator_wallet,
                }
            )

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data')
        )
