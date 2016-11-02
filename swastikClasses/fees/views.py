from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from pymongo import MongoClient
import json
from bson import ObjectId

client = MongoClient()

def checkEmpty(x):
	if x == '':
		return False
	return True

def getCurrTime():
	try:
	    import ntplib
	    c = ntplib.NTPClient()
	    #response = client.request('europe.pool.ntp.org', version=3)
	    response = c.request('pool.ntp.org')
	    #os.system('date ' + time.strftime('%m%d%H%M%Y.%S',time.localtime(response.tx_time)))
	    #currTime = ctime(response.tx_time)
	    return int(response.tx_time)
	    #currTime = currTime.split(' ')
	    #return currTime[1] + ':' + currTime[2] + ':' + currTime[3]		# month:date:hr:min:sec
	except:
	    return getCurrTime()

def canEditCell(t):					# return true if time difference < 60 min, the user can edit the cell
	currTime = getCurrTime()
	diff = currTime-int(t)
	if diff <= 180:
		return True
	return False


def index(request):
	return render(request,"fees/index.html")

def importFile(request):
	content = json.loads(request.POST['content'])

	print content

	keys = content[0]
	numOfCol = len(content[0])
	numOfRow = len(content)
	if numOfRow>1 and len(content[numOfRow-1]) != numOfCol:		# check if last row is empty or not, last row may come due to endline char at end of penultimate entry 
		numOfRow = numOfRow-1

	print numOfCol, numOfRow

	sheetName = request.POST['fileName']
	db = client[sheetName]
	headings = db['headings']
	data = db['data']

	headings.insert_one({'headings': content[0]})
	
	for row in range(1,numOfRow):
		print content[row]
		context = {}
		for col in range(numOfCol):
			key = keys[col]
			context[key] = {
						'time': '',
						'oldVal': [],
						'val': content[row][col],
						'Lstatus': checkEmpty(content[row][col]) 
					}
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

def addNewEntry(request):
	sheetName = request.GET['fileName']
	db = client[sheetName]
	headings = db['headings']
	data = db['data']

	keys = headings.find()[0]['headings']

	context = {}
	for key in keys:
		context[key] = {
						'time': '',
						'oldVal': [],
						'val': '',
						'Lstatus': False
					}

	id = data.insert_one(context).inserted_id

	return HttpResponse(str(id))

def save(request):
	print getCurrTime()
	content = json.loads(request.POST['data'])
	sheetName = request.POST['fileName']
	print content
	db = client[sheetName]
	headings = db['headings']
	data = db['data']
	
	context = {}
	for id in content.keys():
		id = ObjectId(id)			# convert string id to bson object ID
		storedEntry = data.find_one({'_id': id})
		print storedEntry
		for key in content[str(id)]:

			if content[str(id)][key]['time'] == '':			# ignore the cells whose time is not set
				continue
			
			#if storedEntry[key]['Lstatus'] == True : 
			#	continue

			if storedEntry[key]['time'] == '' :
				storedEntry[key]['time'] = content[str(id)][key]['time']
				
			if canEditCell(storedEntry[key]['time']):
				storedEntry[key]['val'] = content[str(id)][key]['val']
	
			else:
				storedEntry[key]['Lstatus'] = True
				
		data.replace_one({'_id': id},
						 storedEntry
					)
		#context[str(id)] = storedEntry
	#print context
	return HttpResponse("success")
	#return JsonResponse(context)

def fetchLiveTime(request):
	time = getCurrTime()
	return HttpResponse(time)
