

class ExportJob(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    format = models.CharField(max_length=20)  # zip, pdf, etc
    date_range = models.JSONField()  # start_date, end_date
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    file = models.FileField(upload_to='exports/', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True) 