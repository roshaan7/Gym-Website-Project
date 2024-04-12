from rest_framework import generics
from django.db.models import Q
from .models import User, userWeight, exerciseDetails, Workout, workoutDetails, UserGoal, FriendRequestSystem, MessageSystem, PostsFeed, PostComments, PostReactions
from rest_framework.response import Response
from rest_framework import permissions, status
from .serializers import ShowUsernameSerializer, RegisterSerializer, WeightSerializer, UpdateWeightSerializer, ShowUserWeightSerializer, ShowPastUserWeightSerializer, SetUserGoalSerializer, ShowGoalsSerializer , exercisesSerializer, workoutSerializer, WorkoutDetailsSerializer, AddWorkoutDetailsSerializer, WorkoutExerciseDetailsSerializer, UpdateSetDetailsSerializer, ViewSetDetailsSerializer, CompoundExerciseDetailsSerializer, SendRequestSerializer, ViewRequestsSerializer, ReplyRequestsSerializer, ViewFriendsSerializer, SendMessageSerializer, ViewMessageSerializer, CreatePostsSerializer, ViewPostsSerializer, ReplyCommentSerializer, ViewPostCommentsSerializer, ViewUserPostReactionsSerializer, UpdatePostReactionsSerializer, ViewUserReactionSerializer, postSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['user_id'] = user.id

        return token
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterUser(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,) # Allows any get, post
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class ShowUsernameView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = User.objects.all()
    lookup_field = 'id'
    serializer_class = ShowUsernameSerializer

class WeightListView(generics.CreateAPIView):
    permission_classes= (permissions.AllowAny,)
    queryset = userWeight.objects.all()
    serializer_class = WeightSerializer

class UpdateWeightListView(generics.UpdateAPIView):
    permission_classes= (permissions.AllowAny,)
    queryset = userWeight.objects.all()
    serializer_class = UpdateWeightSerializer
    lookup_field = 'user_id'

class ViewWeightList(generics.RetrieveAPIView):
    permission_classes= (permissions.AllowAny,)
    queryset = userWeight.objects.all()
    serializer_class = ShowUserWeightSerializer
    lookup_field = 'user_id'

class ViewPastWeightListView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = userWeight.objects.all()
    lookup_field='user_id'
    serializer_class = ShowPastUserWeightSerializer

class SetGoalsView(generics.CreateAPIView):
    permission_classes= (permissions.AllowAny,)
    queryset = UserGoal.objects.all()
    serializer_class = SetUserGoalSerializer

class ShowGoalsView(generics.ListAPIView):
    permission_classes= (permissions.AllowAny,)
    def get_queryset(self):
        user_id = self.kwargs.get('user_id') #kwargs = keyword arguments
        return UserGoal.objects.filter(user_id=user_id)
    serializer_class = ShowGoalsSerializer

class RemoveGoalsView(generics.DestroyAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = UserGoal.objects.all()
    lookup_field='id'
    serializer_class = ShowGoalsSerializer

class ViewExerciseListView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = exerciseDetails.objects.all()
    serializer_class = exercisesSerializer

class WorkoutListView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Workout.objects.all()
    serializer_class = workoutSerializer

class ViewWorkoutListView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        user_id = self.kwargs.get('user_id') #kwargs = keyword arguments
        return Workout.objects.filter(user_id=user_id)
    serializer_class = workoutSerializer

class ViewWorkoutDetailsView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        workout_id = self.kwargs.get('workout_id') #kwargs = keyword arguments
        return workoutDetails.objects.filter(workout_id=workout_id)
    serializer_class = WorkoutDetailsSerializer

#This gives for a certain user it gives all the exercises they have inputted into the database
class ViewAllWorkoutsDetailsView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        user_id = self.kwargs.get('user_id') #kwargs = keyword arguments
        workoutID = Workout.objects.filter(user_id=user_id)
        return workoutDetails.objects.filter(workout_id__in=workoutID)
    serializer_class = WorkoutExerciseDetailsSerializer

    
#This gives for a certain exercise it shows all the users input so we can check their progress
class ViewExerciseDetailsView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        user_id = self.kwargs.get('user_id') #kwargs = keyword arguments
        exercise_id = self.kwargs.get('exercise_id') 
        workoutID = Workout.objects.filter(user_id=user_id)
        return workoutDetails.objects.filter(workout_id__in=workoutID, exercise_id=exercise_id)
    serializer_class = WorkoutExerciseDetailsSerializer

class AddWorkoutDetailsView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = workoutDetails.objects.all()
    serializer_class = AddWorkoutDetailsSerializer

#Removes a workout based from the workoutID
class RemoveWorkoutView(generics.DestroyAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Workout.objects.all()
    lookup_field='workout_ID'
    serializer_class = workoutSerializer

class RemoveSetView(generics.DestroyAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = workoutDetails.objects.all()
    lookup_field='set_id'
    serializer_class = workoutSerializer

class UpdateSetView(generics.UpdateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = workoutDetails.objects.all()
    lookup_field='set_id'
    serializer_class = UpdateSetDetailsSerializer

class ViewSetDetailsView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = workoutDetails.objects.all()
    lookup_field='set_id'
    serializer_class = ViewSetDetailsSerializer

class ViewCompoundDetailsView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        user_id = self.kwargs.get('user_id') #kwargs = keyword arguments
        exercise_id = self.kwargs.get('exercise_id') 
        workoutID = Workout.objects.filter(user_id=user_id)
        return workoutDetails.objects.filter(workout_id__in=workoutID, exercise_id=exercise_id)
    serializer_class = CompoundExerciseDetailsSerializer

class SendRequestView(generics.CreateAPIView):
    serializer_class = SendRequestSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            friendship_sender = serializer.validated_data.get('friendship_sender')
            friendship_receiver = serializer.validated_data.get('friendship_receiver')
            
            existing_friendship = FriendRequestSystem.objects.filter(
                Q(friendship_sender=friendship_sender,friendship_receiver=friendship_receiver) | Q(friendship_sender=friendship_receiver,friendship_receiver=friendship_sender)
            ).first()

            if existing_friendship:
                return Response('Friendship exists', status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SeeFriendRequestView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        friendship_receiver_id = self.kwargs.get('friendship_receiver_id') 
        return FriendRequestSystem.objects.filter(friendship_receiver_id=friendship_receiver_id, status="pending")
    serializer_class = ViewRequestsSerializer

class ReplyRequestView(generics.UpdateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = FriendRequestSystem.objects.all()
    lookup_field = 'id'
    serializer_class = ReplyRequestsSerializer

class RejectFriendView(generics.DestroyAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = FriendRequestSystem.objects.all()
    lookup_field='id'
    serializer_class = ReplyRequestsSerializer

class ViewFriends(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        id = self.kwargs.get('id')
        return FriendRequestSystem.objects.filter(Q(friendship_receiver_id=id) | Q(friendship_sender_id=id), status="accept")
    serializer_class = ViewFriendsSerializer

class SendMessageView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = MessageSystem.objects.all()
    serializer_class = SendMessageSerializer

class ViewMessageView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        sender_id = self.kwargs.get('sender_id')
        receiver_id = self.kwargs.get('receiver_id')
        return MessageSystem.objects.filter(Q(message_sender=sender_id, message_receiver=receiver_id) | Q(message_sender=receiver_id, message_receiver=sender_id)).order_by('date', 'time')
    serializer_class = ViewMessageSerializer

class SendPostsView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = PostsFeed.objects.all()
    serializer_class = CreatePostsSerializer

class ShowAllPostsView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = PostsFeed.objects.filter(is_Public=True)
    serializer_class = ViewPostsSerializer

class ShowFriendsPostsView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        id = self.kwargs.get('id')
        if_user_sender = FriendRequestSystem.objects.filter(friendship_sender_id=id, status="accept").values_list('friendship_receiver_id', flat=True)
        if_user_receiver = FriendRequestSystem.objects.filter(friendship_receiver_id=id, status="accept").values_list('friendship_sender_id', flat=True)

        user_friends = set(if_user_sender) | set(if_user_receiver)

        return PostsFeed.objects.filter(user_id__in=user_friends)
    serializer_class = ViewPostsSerializer

class ShowUserPostView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        user_id = self.kwargs.get('user_id') #kwargs = keyword arguments
        return PostsFeed.objects.filter(user_id=user_id)
    serializer_class = ViewPostsSerializer

class ReplyCommentView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = PostComments.objects.all()
    serializer_class = ReplyCommentSerializer

class ViewPostCommentsView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        post_id = self.kwargs.get('post_id') #kwargs = keyword arguments
        return PostComments.objects.filter(post_id=post_id)
    serializer_class = ViewPostCommentsSerializer

class ViewUserPostLikeReactions(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return PostReactions.objects.filter(post_id=post_id, reactions="like")
    serializer_class = ViewUserPostReactionsSerializer

class ViewUserPostGoodfReactions(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return PostReactions.objects.filter(post_id=post_id, reactions="good form")
    serializer_class = ViewUserPostReactionsSerializer

class ViewUserPostBadfReactions(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return PostReactions.objects.filter(post_id=post_id, reactions="bad form")
    serializer_class = ViewUserPostReactionsSerializer   

class ViewUserPostStrongReactions(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return PostReactions.objects.filter(post_id=post_id, reactions="strong")
    serializer_class = ViewUserPostReactionsSerializer  

class ViewUserPostGoodWeightReactions(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return PostReactions.objects.filter(post_id=post_id, reactions="good weight")
    serializer_class = ViewUserPostReactionsSerializer    

class UpdatePostReactionsView(generics.UpdateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = PostReactions.objects.all()
    lookup_field='id'
    serializer_class = UpdatePostReactionsSerializer

class ViewUserReactionView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        post_id = self.kwargs.get('post_id')
        return PostReactions.objects.filter(post_id=post_id, user_id=user_id)
    serializer_class = ViewUserReactionSerializer

class RemovePostView(generics.DestroyAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = PostsFeed.objects.all()
    lookup_field='id'
    serializer_class = postSerializer


            

        
