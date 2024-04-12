from django.db import models
from django.contrib.auth.models import AbstractUser
from simple_history.models import HistoricalRecords
from django.db.models.signals import post_save
from django.dispatch import receiver

class User(AbstractUser):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    USERNAME_FIELD='email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

#one-to-many relationship - one user can have multiple weight entries - for weight tracking feature
class userWeight(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    date = models.DateField(auto_now=True)
    history = HistoricalRecords()

    
#For storing exercise details - each exercise would have its own ID
class exerciseDetails(models.Model):
    exercise_ID = models.AutoField(primary_key=True)
    exercise_name = models.CharField(max_length=150)
    target_muscle = models.CharField(max_length=150)

    def __str__(self):
       return self.exercise_name

#For keeping track of user's workouts
class Workout(models.Model):
    workout_ID = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    details = models.ManyToManyField(exerciseDetails, through="workoutDetails", through_fields=("workout_id", "exercise_id"))
    date = models.DateField()

#Table that combines contains details about the workout and the set details - intermediary between exercise and workout tables 
class workoutDetails(models.Model):
    set_id = models.AutoField(primary_key=True)
    workout_id = models.ForeignKey(Workout, on_delete=models.CASCADE)
    exercise_id = models.ForeignKey(exerciseDetails, on_delete=models.CASCADE)
    set_number = models.IntegerField()
    number_of_reps = models.IntegerField()
    weight = models.DecimalField(max_digits=5, decimal_places=2)

#Keeping track of users goals
class UserGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    goals = models.CharField(max_length=400)

#Friend request system
class FriendRequestSystem(models.Model):
    friendship_sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='send_request')
    friendship_receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receive_request')
    status = models.CharField(max_length=50, default='pending')

class MessageSystem(models.Model):
    message_sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='message_sent')
    message_receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='message_received')
    messages = models.TextField()
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    
class PostsFeed(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post_content = models.TextField()
    uploaded_content = models.FileField(upload_to='content/', blank=True, null=True)
    is_Public = models.BooleanField(default=True)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)

class PostComments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(PostsFeed, on_delete=models.CASCADE)
    comment = models.TextField()
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)

class PostReactions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(PostsFeed, on_delete=models.CASCADE)
    reactions = models.CharField(max_length=25, null=True, blank=True)

    class Meta:
        unique_together = ('user', 'post')

@receiver(post_save, sender=PostsFeed)
def create_reaction_object(sender, instance, created, **kwargs):
    if created:
        all_users = User.objects.all()
        for user in all_users:
            PostReactions.objects.create(user=user, post=instance)

@receiver(post_save, sender=User)
def create_reaction_object(sender, instance, created, **kwargs):
    if created:
        all_posts = PostsFeed.objects.all()
        for post in all_posts:
            PostReactions.objects.create(post=post, user=instance)
    

    


