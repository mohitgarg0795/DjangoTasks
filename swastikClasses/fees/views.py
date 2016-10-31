from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from pymongo import MongoClient
import json

client = MongoClient()

def index(request):
	return render(request,"fees/index.html")

def checkEmpty(x):
	if x == '':
		return False
	return True

def importFile(request):
	content = json.loads(request.GET['content'])
	
	keys = content[0]
	numOfCol = len(content[0])
	numOfRow = len(content)
	
	sheetName = request.GET['fileName']
	db = client[sheetName]
	headings = db['headings']
	data = db['data']

	headings.insert_one({'headings': content[0]})
	
	for row in range(1,numOfRow):
		context = {}
		for col in range(numOfCol):
			key = keys[col]
			context[key] = {
						'time': '',
						'oldVal': [],
						'val': content[row][col],
						'Lstatus': checkEmpty(content[row][col]) 
					}
		print context
		data.insert_one(context)

	return HttpResponse("success")

def existingFileNames(request):
	return HttpResponse(json.dumps(client.database_names()))

def openFile(request):
	sheetName = request.GET['fileName']
	db = client[sheetName] 
	headings = db['headings']
	data = db['data']

	keys = headings.find()[0]['headings']
	context = {}

	for i in data.find():
		id = str(i['_id'])
		context[id] = {}
		for key in keys:
			context[id][key] = {
				'val': i[key]['val'],
				'status': i[key]['Lstatus']
			}

	return JsonResponse(context)