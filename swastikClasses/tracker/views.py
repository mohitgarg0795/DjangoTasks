from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from models import Rooms, Time
from datetime import date,datetime

def index(request):
	return render(request,"tracker/index.html")

def update(request):
	time = request.GET['time']
	rooms = request.GET.getlist('classes[]')		#retrieve js array object as list from get request

	Date = datetime.now()
	#print date.today
	#print datetime.now()
	
	timeObj = Time.objects.get_or_create(date = Date, time = time[:-2])[0]
	timeObj.Rooms.clear()
	print timeObj.Rooms.all()

	for roomId in rooms:
		#print roomId
		try:
			inst = Rooms.objects.get(roomId = roomId)
		except:
			inst = Rooms.objects.create(roomId = roomId)
		timeObj.Rooms.add(inst)
	timeObj.save()

	print timeObj.Rooms.all()
	return HttpResponse("1")
	

def fetch(request):
	Date = datetime.now()

	context = {}

	inst = Time.objects.filter(date = Date)

	for i in inst:
		context[i.time] = [room['roomId'] for room in i.Rooms.all().values()]
	
	print context
	return JsonResponse(context)
