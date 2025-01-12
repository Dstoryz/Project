class UserAnalytics(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_generations = models.IntegerField(default=0)
    favorite_models = models.JSONField(default=dict)
    usage_patterns = models.JSONField(default=dict)
    last_active = models.DateTimeField(auto_now=True) 

class GenerationStats(models.Model):
    date = models.DateField(unique=True)
    total_generations = models.IntegerField(default=0)
    successful_generations = models.IntegerField(default=0)
    failed_generations = models.IntegerField(default=0)
    average_generation_time = models.FloatField(default=0)
    unique_users = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-date']

class ModelUsageStats(models.Model):
    model = models.CharField(max_length=100)
    date = models.DateField()
    usage_count = models.IntegerField(default=0)
    average_time = models.FloatField(default=0)
    success_rate = models.FloatField(default=0)
    
    class Meta:
        unique_together = ['model', 'date']
        ordering = ['-date', '-usage_count'] 