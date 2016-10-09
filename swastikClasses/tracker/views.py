from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from models import Rooms, Time
from datetime import date,datetime

def index(request):
	print "index"
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
	