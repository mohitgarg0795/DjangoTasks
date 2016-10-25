from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from pymongo import MongoClient
import json

"""
	DATABASE:

	colidx 	- gives relation between colID and colINDEX
		   	- fields -> colIdx - integer, colId - integer

	data   	- stores data corresponding to a particular column 
		   	- fields -> colId - integer, val - array, heading - array 

	columns	- stores the highest colID number in the sheet
		   	- fields -> highColId - integer
"""


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

		for i in colIdx.find():
			print i
		for i in data.find():
			print i
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
		print request.META['QUERY_STRING']
		for i in request.GET.iterlists():
			print i
		for i in request.GET.iterkeys():
			print i, request.GET.getlist(i)
		for i,j in request.GET.items():
			if(i=='sheetName'):
				continue
			"""idx = int(i[6])
			colId = colIdx.find({'colIdx': idx})[0]['colId']
			data.update(
					{'colId': colId},								# match condition to find the document to be updated
					{ '$set': 
						{'val': request.GET.getlist(i)},
						{'heading': request.GET.getlist(i)}
					}		#updation to be performed
				)"""
			print i, request.GET.getlist(i), j

	return HttpResponse("success")

def addCol(request):
	sheetName = request.GET['sheetName']
	newCol  = request.GET['col']		# gives a unicode string
	newCol = int(newCol)		# index of new column added

	db = client[sheetName]
	colIdx = db['colidx']
	data = db['data']
	columns = db['columns']
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
	
	#for i in colIdx.find():
	#	print i
	try:
		numOfRows = len(data.find()[0]['val'])
		columns.update({}, {'$inc': {'highColId': 1}})		# increase the colID for every column insertion
	except: 
		numOfRows = 1
		columns.insert_one({'highColId': 0})		# if its a new sheet

	print "MOHIT", columns.find()[0]['highColId'] 

	for i in colIdx.find():
		print i

	highColId = columns.find()[0]['highColId']
	colIdx.insert_one({
			"colId": highColId,
			"colIdx": newCol
		})
	data.insert_one({
			"colId": highColId,
			"val": ['' for i in range(0,numOfRows)],
			"heading": ['' for i in range(0,numOfRows)]
		})

	return HttpResponse("success")

def deleteCol(request):
	sheetName = request.GET['sheetName']
	delCol  = request.GET['col']		# gives a unicode string
	delCol = int(delCol)		# index of column to be deleted

	db = client[sheetName]
	colIdx = db['colidx']
	data = db['data']
	totalCol = colIdx.count()

	delId = colIdx.find({'colIdx': delCol})[0]['colId']		# column id of the column to be deleted
	colIdx.remove({'colIdx': delCol})		# removes all documents with coldIdx=delCol , although here it is always one document
	data.remove({'colId': delId})			# removes the data document of the deleted column
	for i in range(delCol+1,totalCol):		# update colIdx of all colIds with index = {col deleted	+ 1 , totalCol -1 i.e. highest index of col}
		colIdx.update(
				{'colIdx': i},
				{'$inc': {'colIdx': -1}}
			)

	return HttpResponse("success")