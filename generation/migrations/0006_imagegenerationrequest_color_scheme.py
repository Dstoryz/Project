# Generated by Django 5.1.4 on 2025-01-10 18:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('generation', '0005_imagegenerationrequest_clip_skip_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='imagegenerationrequest',
            name='color_scheme',
            field=models.CharField(default='none', max_length=100),
        ),
    ]