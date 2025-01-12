from .models import UserAchievement, Achievement

class AchievementService:
    def check_achievements(self, user):
        # Проверяем все возможные достижения
        all_achievements = Achievement.objects.all()
        
        for achievement in all_achievements:
            if not UserAchievement.objects.filter(
                user=user, 
                achievement=achievement
            ).exists():
                self._check_single_achievement(user, achievement)
    
    def _check_single_achievement(self, user, achievement):
        # Проверяем конкретное достижение
        if achievement.name == 'First Generation':
            if user.imagegenerationrequest_set.count() >= 1:
                self._grant_achievement(user, achievement)
                
        elif achievement.name == 'Power User':
            if user.imagegenerationrequest_set.count() >= 100:
                self._grant_achievement(user, achievement)
    
    def _grant_achievement(self, user, achievement):
        UserAchievement.objects.create(
            user=user,
            achievement=achievement
        )
        # Отправляем уведомление
        NotificationService().notify_achievement_earned(user, achievement) 