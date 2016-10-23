from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from pymongo import MongoClient
import json
# Create your views here.

client = MongoClient()

def index(request):
	return render(request,"manager/index.html")

def openSheet(request):
	if request.GET['queryType']=='fetchNames':
		return HttpResponse(json.dumps(client.database_names()))

	sheetName = request.GET['sheetName']
	db = client[sheetName]	
	colIdx = db['colidx']
	data = db['data']
	
	context = {}

	for i in data.find():
		colId = i['colId']
		col = colIdx.find({'colId': colId})[0]['colIdx']
		context[col]=i['val']

	print context
	return JsonResponse(context)

def updateData(request):
	sheetName = request.GET['sheetName']
	db = client[sheetName]
	colIdx = db['colidx']
	data = db['data']

	#create new sheet
	if sheetName not in client.database_names():

		"""
			request.GET.item() gives the dictionary of items in the GET request
			request.GET.getlist(i) gives the list of rows data sent as array in js
			here i==sheet[colNum][] ==> i[6]=colNum
		"""
		for i,j in request.GET.items():
			if(i=='sheetName'):
				continue
			colIdx.insert_one({
					"colId": i[6],
					"colIdx": i[6]
				})
			data.insert_one({
					"colId": i[6],
					"val": request.GET.getlist(i)	
				})
			#print i, request.GET.getlist(i)

	return HttpResponse("success")