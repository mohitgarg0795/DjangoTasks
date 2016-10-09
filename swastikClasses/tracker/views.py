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
	
	key = 'time' + time[:-2]
	if key=='time1':
		try:
			timeObj = Time.objects.get(date = date, time1 = True)	#returns existing record else prduces error
		except:
			timeObj = Time.objects.create(date = Date, time1 = True)	 
	if key=='time2':
		try:
			timeObj = Time.objects.get(date = Date, time2 = True)
		except:
			timeObj = Time.objects.create(date = Date, time2 = True)
	if key=='time3':
		try:
			timeObj = Time.objects.get(date = Date, time3 = True)
		except:
			timeObj = Time.objects.create(date = Date, time3 = True)
	if key=='time4':
		try:
			timeObj = Time.objects.get(date = Date, time4 = True)
		except:
			timeObj = Time.objects.create(date = Date, time4 = True)
	if key=='time5':
		try:
			timeObj = Time.objects.get(date = Date, time5 = True)
		except:
			timeObj = Time.objects.create(date = Date, time5 = True)
	if key=='time6':
		try:
			timeObj = Time.objects.get(date = Date, time6 = True)
		except:
			timeObj = Time.objects.create(date = Date, time6 = True)
	if key=='time7':
		try:
			timeObj = Time.objects.get(date = Date, time7 = True)
		except:
			timeObj = Time.objects.create(date = Date, time7 = True)
	if key=='time8':
		try:
			timeObj = Time.objects.get(date = Date, time8 = True)
		except:
			timeObj = Time.objects.create(date = Date, time8 = True)
	if key=='time9':
		try:
			timeObj = Time.objects.get(date = Date, time9 = True)
		except:
			timeObj = Time.objects.create(date = Date, time9 = True)
	if key=='time10':
		try:
			timeObj = Time.objects.get(date = Date, time10 = True)
		except:
			timeObj = Time.objects.create(date = Date, time10 = True)
	if key=='time11':
		try:
			timeObj = Time.objects.get(date = Date, time11 = True)
		except:
			timeObj = Time.objects.create(date = Date, time11 = True)
	if key=='time12':
		try:
			timeObj = Time.objects.get(date = Date, time12 = True)
		except:
			timeObj = Time.objects.create(date = Date, time12 = True)

	timeObj.Rooms.clear()

	for roomId in rooms:
		print roomId
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
	
	rooms = inst.filter(time1 = True)			#return queryset list which is not json serializeable
	if rooms:									#only if there exists a entry 
		rooms = rooms[0].Rooms.all().values()		#turns queryset into python dictionary type
		context['1'] = []
		for i in rooms:
			context['1'].append(i['roomId'])
	
	rooms = inst.filter(time2 = True)			
	if rooms:	
		rooms = rooms[0].Rooms.all().values()
		context['2'] = []
		for i in rooms:
			context['2'].append(i['roomId'])

	rooms = inst.filter(time3 = True)			
	if rooms:
		rooms = rooms[0].Rooms.all().values()
		context['3'] = []
		for i in rooms:
			context['3'].append(i['roomId'])

	rooms = inst.filter(time4 = True)			
	if rooms:	
		rooms = rooms[0].Rooms.all().values()
		context['4'] = []
		for i in rooms:
			context['4'].append(i['roomId'])

	rooms = inst.filter(time5 = True)			
	if rooms:	
		rooms = rooms[0].Rooms.all().values()
		context['5'] = []
		for i in rooms:
			context['5'].append(i['roomId'])

	rooms = inst.filter(time6 = True)			
	if rooms:	
		rooms = rooms[0].Rooms.all().values()
		context['6'] = []
		for i in rooms:
			context['6'].append(i['roomId'])

	rooms = inst.filter(time7 = True)			
	if rooms:	
		rooms = rooms[0].Rooms.all().values()
		context['7'] = []
		for i in rooms:
			context['7'].append(i['roomId'])

	rooms = inst.filter(time8 = True)			
	if rooms:	
		rooms = rooms[0].Rooms.all().values()
		context['8'] = []
		for i in rooms:
			context['8'].append(i['roomId'])

	rooms = inst.filter(time9 = True)			
	if rooms:	
		rooms = rooms[0].Rooms.all().values()
		context['9'] = []
		for i in rooms:
			context['9'].append(i['roomId'])

	rooms = inst.filter(time10 = True)			
	if rooms:	
		rooms = rooms[0].Rooms.all().values()
		context['10'] = []
		for i in rooms:
			context['10'].append(i['roomId'])

	rooms = inst.filter(time11 = True)			
	if rooms:	
		rooms = rooms[0].Rooms.all().values()
		context['11'] = []
		for i in rooms:
			context['11'].append(i['roomId'])

	rooms = inst.filter(time12 = True)			
	if rooms:	
		rooms = rooms[0].Rooms.all().values()
		context['12'] = []
		for i in rooms:
			context['12'].append(i['roomId'])

	print context
	return JsonResponse(context)
