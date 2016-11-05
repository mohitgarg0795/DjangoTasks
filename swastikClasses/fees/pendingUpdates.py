def check(sheetName):
	db = client[sheetName]
	headings = db['headings']

	for key in headings.find():
		print key

