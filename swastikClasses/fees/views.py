from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
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

@csrf_exempt
def importFile(request):
	content = json.loads(request.POST['content'])

	keys = content[0]
	numOfCol = len(content[0])
	numOfRow = len(content)
	
	sheetName = request.POST['fileName']
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
	context['headings'] = keys
	
	for i in data.find():
		id = str(i['_id'])
		context[id] = {}
		for key in keys:
			context[id][key] = {
				'val': i[key]['val'],
				'status': i[key]['Lstatus']
			}

	return JsonResponse(context)

def colSwap(request):
	h1 = request.GET['heading1']
	h2 = request.GET['heading2']
	sheetName = request.GET['fileName']

	db = client[sheetName]
	headings = db['headings']

	keys = headings.find()[0]['headings']
	id = headings.find()[0]['_id']
	count = 0
	
	for i in range(len(keys)):
		if keys[i] == h1:
			keys[i] = h2
			count = count+1
		else:
			if keys[i] == h2:
				keys[i] = h1
				count = count+1
		if count == 2:
			break

	headings.update(
			{'_id': id},
			{'$set': {'headings': keys}}
		)

	return HttpResponse("success")