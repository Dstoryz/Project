from celery import shared_task
from .services import TaskQueueService
from notifications.services import NotificationService

@shared_task
def process_generation_queue():
    service = TaskQueueService()
    notification_service = NotificationService()
    
    try:
        result = service.process_next_task()
        if result:
            notification_service.notify_generation_complete(
                user=result.user,
                image=result.generated_image
            )
    except Exception as e:
        print(f"Error processing task: {e}")

@shared_task
def cleanup_old_tasks():
    # Удаление старых завершенных задач
    GenerationTask.objects.filter(
        status__in=['completed', 'failed'],
        created_at__lt=datetime.now() - timedelta(days=7)
    ).delete() 