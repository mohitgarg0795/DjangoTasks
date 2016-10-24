from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from pymongo import MongoClient
import json


client = MongoClient()

def index(request):
	return render(request,"manager/index.html")

def openSheet(request):
	if request.GET['queryType']=='fetchNames':
		return HttpResponse(json.dumps(client.database_names()))

	if request.GET['queryType']=='openSheet':
		sheetName = request.GET['sheetName']
		db = client[sheetName]	
		colIdx = db['colidx']
		data = db['data']
		
		context = {}

		for i in data.find():
			colId = i['colId']
			col = colIdx.find({'colId': colId})[0]['colIdx']
			context[col]=i['val']

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
					"colId": int(i[6]),
					"colIdx": int(i[6])
				})
			data.insert_one({
					"colId": int(i[6]),
					"val": request.GET.getlist(i)	
				})
			#print i, request.GET.getlist(i)
	else:
		for i,j in request.GET.items():
			if(i=='sheetName'):
				continue
			idx = int(i[6])
			colId = colIdx.find({'colIdx': idx})[0]['colId']
			data.update(
					{'colId': colId},			# match condition to find the document to be updated
					{ '$set': {'val': request.GET.getlist(i)}}		#updation to be performed
				)

	return HttpResponse("success")

def addCol(request):
	sheetName = request.GET['sheetName']
	newCol  = request.GET['col']		# gives a unicode string
	newCol = int(newCol)		# index of new column added

	db = client[sheetName]
	colIdx = db['colidx']
	data = db['data']
	totalCol = colIdx.count()

	#print newCol, totalCol
	#updateMany function not working , although its correct acc to documentation - giving "no such method exists" error
	#colIdx.updateMany(
	#		{'colId': { '$gt': newCol}},
	#		{'$set': { 'colIdx': 1}}
	#	)

	#for i in colIdx.find():
	#	print i

	"""
		colIdx = colIdx + 1 where colIdx > newColIdx 
		reversed loop is used to avoid same colIdx being incremented again and again
	"""
	for i in reversed(range(newCol,totalCol)):
		colIdx.update(
				{'colIdx': i},
				{'$inc': {'colIdx': 1}}
			)

	colIdx.insert_one({
			"colId": totalCol,
			"colIdx": newCol
		})
	
	#print " "

	#for i in colIdx.find():
	#	print i

	numOfRows = len(data.find()[0]['val'])
	data.insert_one({
			"colId": totalCol,
			"val": ['' for i in range(0,numOfRows)]
		})
	
	#print colIdx.count(), data.count()

	#for i in data.find():
	#	print i

	return HttpResponse("success")