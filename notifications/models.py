class Notification(models.Model):
    TYPES = (
        ('generation_complete', 'Generation Complete'),
        ('achievement_earned', 'Achievement Earned'),
        ('image_shared', 'Image Shared'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=50, choices=TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at'] 