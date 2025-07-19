#!/bin/bash

# Django Backend Setup Script

echo "Setting up Django Backend..."

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Navigate to backend directory
cd backend

# Create database migrations
python manage.py makemigrations accounts
python manage.py makemigrations campaigns
python manage.py makemigrations messages
python manage.py makemigrations wallet
python manage.py makemigrations notifications
python manage.py makemigrations video_requests

# Apply migrations
python manage.py migrate

# Create superuser (optional)
echo "Creating superuser..."
python manage.py createsuperuser --noinput --username admin --email admin@example.com || true

# Create sample data
python manage.py create_sample_data

echo "Setup complete! Run 'python manage.py runserver' to start the server."
