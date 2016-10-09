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

	for roomId in rooms:
		try:
			inst = Rooms.objects.get(roomId = roomId)
		except:
			inst = Rooms.objects.create(roomId = roomId)
		inst.time = timeObj
		inst.save();
		
	return HttpResponse("garg")
	

def fetch(request):
	Date = datetime.now()

	context = {}

	inst = Rooms.objects.filter(time__date = Date)

	rooms = inst.filter(time__time1 = True)
	rooms = rooms.values()
	context['1'] = []
	for i in rooms:
		context['1'].append(i['roomId'])

	rooms = inst.filter(time__time2 = True)
	rooms = rooms.values()
	context['2'] = []
	for i in rooms:
		context['2'].append(i['roomId'])

	rooms = inst.filter(time__time3 = True)
	rooms = rooms.values()
	context['3'] = []
	for i in rooms:
		context['3'].append(i['roomId'])

	rooms = inst.filter(time__time4 = True)
	rooms = rooms.values()
	context['4'] = []
	for i in rooms:
		context['4'].append(i['roomId'])

	rooms = inst.filter(time__time5 = True)
	rooms = rooms.values()
	context['5'] = []
	for i in rooms:
		context['5'].append(i['roomId'])

	rooms = inst.filter(time__time6 = True)
	rooms = rooms.values()
	context['6'] = []
	for i in rooms:
		context['6'].append(i['roomId'])

	rooms = inst.filter(time__time7 = True)
	rooms = rooms.values()
	context['7'] = []
	for i in rooms:
		context['7'].append(i['roomId'])

	rooms = inst.filter(time__time8 = True)
	rooms = rooms.values()
	context['8'] = []
	for i in rooms:
		context['8'].append(i['roomId'])

	rooms = inst.filter(time__time9 = True)
	rooms = rooms.values()
	context['9'] = []
	for i in rooms:
		context['9'].append(i['roomId'])

	rooms = inst.filter(time__time10 = True)
	rooms = rooms.values()
	context['10'] = []
	for i in rooms:
		context['10'].append(i['roomId'])

	rooms = inst.filter(time__time11 = True)
	rooms = rooms.values()
	context['11'] = []
	for i in rooms:
		context['11'].append(i['roomId'])

	rooms = inst.filter(time__time12 = True)
	rooms = rooms.values()
	context['12'] = []
	for i in rooms:
		context['12'].append(i['roomId'])

	print context

	return JsonResponse(context)