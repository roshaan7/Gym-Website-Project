from rest_framework import serializers
from .models import User, userWeight, exerciseDetails, Workout, workoutDetails, UserGoal, FriendRequestSystem, MessageSystem, PostsFeed, PostComments, PostReactions
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework import status


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class ShowUsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ('email', 'password', 'username')

    def create(self, data):
        user_email = data['email']
        created_user = User.objects.create(username=data['username'], email=data['email'])
        created_user.set_password(data['password'])
        created_user.save()
        return created_user

class WeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = userWeight
        fields = ('user', 'weight', 'date')
       
    def create(self, data):
        weight = userWeight.objects.create(user=data['user'], weight=data['weight'])
        weight.save()
        return weight

class UpdateWeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = userWeight
        fields = ('weight', 'date')

    def update2(self,data):
        user = data['user']
        if (userWeight.objects.filter(user=user).exists()):
            updated_user = userWeight.objects.update2(weight=data['weight'])
            updated_user.save()
            return updated_user
        
class ShowUserWeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = userWeight
        fields = ('user', 'weight', 'date')

class HistoricalWeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = userWeight.history.model
        fields = ('user', 'weight', 'date', 'history_id')

class ShowPastUserWeightSerializer(serializers.ModelSerializer):
    history = HistoricalWeightSerializer(many=True)
    class Meta:
        model = userWeight
        fields = ['history']

class SetUserGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGoal
        fields = ['user', 'goals']

    def create(self, data):
        set = UserGoal.objects.create(user=data['user'], goals=data['goals'])
        set.save()
        return set

class ShowGoalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGoal
        fields = ['id', 'user','goals']

class exercisesSerializer(serializers.ModelSerializer):
    class Meta:
        model = exerciseDetails
        fields = ['exercise_ID', 'exercise_name', 'target_muscle']

class workoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['user', 'workout_ID', 'date']

class WorkoutDetailsSerializer(serializers.ModelSerializer):
    exercise_name = serializers.SerializerMethodField()

    class Meta:
        model = workoutDetails
        fields = ['set_id', 'exercise_id', 'exercise_name', 'set_number', 'weight', 'number_of_reps'] 

    def get_exercise_name(self, obj):
        return obj.exercise_id.exercise_name
    
class WorkoutExerciseDetailsSerializer(serializers.ModelSerializer):
    exercise_name = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    class Meta:
        model = workoutDetails
        fields = ['exercise_id', 'exercise_name','weight', 'number_of_reps', 'workout_id', 'date'] 

    def get_exercise_name(self, obj):
        return obj.exercise_id.exercise_name
    
    def get_date(self, obj):
        return obj.workout_id.date
    

class AddWorkoutDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = workoutDetails
        fields = ['workout_id', 'exercise_id', 'set_number', 'weight', 'number_of_reps'] 

class UpdateSetDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = workoutDetails
        fields = ['weight', 'number_of_reps']

    def updateSet(self,data):
        set_id = data['set_id']
        if (workoutDetails.objects.filter(set_id=set_id).exists()):
            update_set = workoutDetails.objects.updateSet(weight=data['weight'], number_of_reps=data['number_of_reps'])
            update_set.save()
            return update_set    
        
class ViewSetDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = workoutDetails
        fields = ['set_number', 'weight', 'number_of_reps']

class CompoundExerciseDetailsSerializer(serializers.ModelSerializer):
    exercise_name = serializers.SerializerMethodField()

    class Meta:
        model = workoutDetails
        fields = ['exercise_id', 'exercise_name','weight', 'number_of_reps', 'workout_id'] 

    def get_exercise_name(self, obj):
        return obj.exercise_id.exercise_name
    
class SendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequestSystem
        fields = ['id','friendship_sender', 'friendship_receiver']
    
class ViewRequestsSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = FriendRequestSystem
        fields = ['id', 'username', 'status']

    def get_username(self, obj):
        return obj.friendship_sender.username
    
class ReplyRequestsSerializer(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()
    receiver_username = serializers.SerializerMethodField()

    class Meta:
        model = FriendRequestSystem
        fields = ['sender_username', 'receiver_username', 'status']

    def get_sender_username(self, obj):
        return obj.friendship_sender.username
    
    def get_receiver_username(self, obj):
        return obj.friendship_receiver.username
    
    def update_status(self, data):
        updating_status = FriendRequestSystem.objects.update_status(status=data['status'])
        updating_status.save()
        return updating_status

class ViewFriendsSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()
    class Meta:
        model = FriendRequestSystem
        fields = ['friendship_sender', 'friendship_receiver', 'status', 'sender_name', 'receiver_name']

    def get_sender_name(self, obj):
        return obj.friendship_sender.username
    
    def get_receiver_name(self, obj):
        return obj.friendship_receiver.username

class SendMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageSystem
        fields = ['message_sender', 'message_receiver', 'messages', 'date', 'time']

    def send_message(self,data):
        sent_message = MessageSystem.objects.create(message_sender=data['message_sender'], message_receiver=data['message_receiver'], messages=data['messages'])
        sent_message.save()
        return sent_message

class ViewMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageSystem
        fields = ['message_sender', 'message_receiver', 'messages', 'date', 'time']

class CreatePostsSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    class Meta:
        model = PostsFeed
        fields = ['id', 'user', 'username', 'post_content', 'is_Public', 'date', 'time', 'uploaded_content']

    def get_username(self, obj):
        return obj.user.username

    def create_post(self,data):
        new_post = PostsFeed.objects.create(user=data['user'], post_content=data['post_content'], is_public=data['is_public'])
        new_post.save()
        return new_post

class ViewPostsSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    class Meta:
        model = PostsFeed
        fields = ['id','user', 'username', 'post_content', 'is_Public', 'date', 'time', 'uploaded_content']

    def get_username(self, obj):
        return obj.user.username
    
class ReplyCommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    class Meta:
        model = PostComments
        fields = ['user', 'post', 'username', 'comment' , 'date', 'time']

    def get_username(self, obj):
        return obj.user.username
    
    def comment(self, data):
        new_comment = PostComments.objects.create(user=data['user'], post=data['post'], comment = data['comment'])
        new_comment.save()
        return new_comment
    
class ViewPostCommentsSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    class Meta:
        model = PostComments
        fields = ['user', 'username', 'post', 'comment', 'date', 'time']

    def get_username(self, obj):
        return obj.user.username
    
class ViewUserPostReactionsSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    class Meta:
        model = PostReactions
        fields = ['user', 'username', 'post', 'reactions']
        
    def get_username(self, obj):
        return obj.user.username
    
class UpdatePostReactionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostReactions
        fields = ['id', 'reactions']

    def updateReactions(self, data):
        update = PostReactions.objects.updateReactions(reactions=data['reactions'])
        update.save()
        return update

class ViewUserReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostReactions
        fields = ['id', 'user', 'reactions']

class postSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostsFeed
        fields = ['user', 'id', 'date']

