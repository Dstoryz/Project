class Subscription(models.Model):
    PLANS = (
        ('free', 'Free'),
        ('pro', 'Professional'),
        ('enterprise', 'Enterprise'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    plan = models.CharField(max_length=20, choices=PLANS)
    active = models.BooleanField(default=True)
    expires_at = models.DateTimeField()
    monthly_generations = models.IntegerField(default=50)
    features = models.JSONField(default=dict) 