from django.contrib import admin
from .models import User, userWeight, exerciseDetails, Workout, workoutDetails, UserGoal, FriendRequestSystem, MessageSystem, PostsFeed, PostComments, PostReactions

admin.site.register(User)
admin.site.register(userWeight)
admin.site.register(exerciseDetails)
admin.site.register(Workout)
admin.site.register(workoutDetails)
admin.site.register(UserGoal)
admin.site.register(FriendRequestSystem)
admin.site.register(MessageSystem)
admin.site.register(PostsFeed)
admin.site.register(PostComments)
admin.site.register(PostReactions)