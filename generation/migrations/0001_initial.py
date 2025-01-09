# Generated by Django 5.1.4 on 2025-01-06 08:30

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageGenerationRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prompt', models.CharField(max_length=1500)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('generated_image', models.ImageField(blank=True, null=True, upload_to='generated_images/')),
                ('thumbnail', models.ImageField(blank=True, null=True, upload_to='thumbnails/')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='image_requests', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
