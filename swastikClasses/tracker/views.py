from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from models import Rooms, Time

def index(request):
	return render(request,"tracker/index.html")

#def update(request):
#	try:
#		inst = Rooms.objects.get()