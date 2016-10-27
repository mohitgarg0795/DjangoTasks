var dataMatrix={};
var active=undefined;
var activeSheetName=undefined;
var existingSheets="";

$(document).ready(function(){
	updateExistingSheetList();
	$('.createNewSheet').on('click',function(){
		var name=prompt('Enter sheet name');
		if(name.length<=0){
			alert('Not a valid sheet name');
		}
		else
		if(existingSheets.indexOf(name)>=0){
			alert('Sheet with name '+name+' already exists');
		}
		else{
			sheetName=name;
			matrix=undefined;
			document.title=sheetName;
			addOpenedSheet(sheetName);
		}
	});
	$('.openExistingSheet').on('click',function(){
		$('.existingSheetListName').remove();
		for(var i=0;i<existingSheets.length;i++)
		{
			var d=document.createElement('option');
			$(d).text(existingSheets[i]);
			$(d).attr('value',existingSheets[i]);
			$(d).addClass('existingSheetListName');
			$('.existingSheetList').append(d);
		}
		$('.existingSheetContainer').show();
	});
	$('.closeExistingSheetContainer').on('click',function(){$('.existingSheetContainer').hide();});
	$('.openSheet').on('click',function(){openSheet($('.existingSheetList')[0].value);$('.existingSheetContainer').hide();});
	$('.insertRowBefore').on('click',function(){
			if(activeSheetName==undefined){
				alert('Either start by creating a new sheet or open an existing sheet');
				return;
			}
			if(dataMatrix[activeSheetName]==undefined){
				$('.lockScreen').show();
				dataMatrix[activeSheetName]=[[{'data':undefined,'heading':undefined}]];
				renderMatrix();
				saveInstantState(0);
				return;
			}
			var rowNumber=parseInt($('.active')[0].id.split('x')[0]);
			var cols=dataMatrix[activeSheetName][0].length;
			var tempArray=[[]];
			for(var i=0;i<cols;i++)
			{
				tempArray[0].push({'data':undefined,'heading':undefined});
			}
			dataMatrix[activeSheetName]=dataMatrix[activeSheetName].slice(0,rowNumber).concat(tempArray,dataMatrix[activeSheetName].slice(rowNumber,dataMatrix[activeSheetName].length));
			renderMatrix();
	});
	$('.insertRowAfter').on('click',function(){
			if(activeSheetName==undefined){
				alert('Either start by creating a new sheet or open an existing sheet');
				return;
			}
			if(dataMatrix[activeSheetName]==undefined){
				$('.lockScreen').show();
				dataMatrix[activeSheetName]=[[{'data':'','heading':''}]];
				renderMatrix();
				saveInstantState(0);
				return;
			}
			var rowNumber=parseInt($('.active')[0].id.split('x')[0]);
			var cols=dataMatrix[activeSheetName][0].length;
			var tempArray=[[]];
			for(var i=0;i<cols;i++)
			{
				tempArray[0].push({'data':'','heading':''});
			}
			dataMatrix[activeSheetName]=dataMatrix[activeSheetName].slice(0,rowNumber+1).concat(tempArray,dataMatrix[activeSheetName].slice(rowNumber+1,dataMatrix[activeSheetName].length));
			renderMatrix();
	});
	$('.insertColBefore').on('click',function(){
			if(activeSheetName==undefined){
				alert('Either start by creating a new sheet or open an existing sheet');
				return;
			}
			if(dataMatrix[activeSheetName]==undefined){
				$('.lockScreen').show();
				dataMatrix[activeSheetName]=[[{'data':'','heading':''}]];
				renderMatrix();
				saveInstantState(0);
				return;
			}
			$('.lockScreen').show();
			var colNumber=parseInt($('.active')[0].id.split('x')[1]);
			var rows=dataMatrix[activeSheetName].length;
			for(var i=0;i<rows;i++)
			{
				dataMatrix[activeSheetName][i]=dataMatrix[activeSheetName][i].slice(0,colNumber).concat([{'data':undefined,'heading':undefined}],dataMatrix[activeSheetName][i].slice(colNumber,dataMatrix[activeSheetName][i].length));
			}
			renderMatrix();
			saveInstantState(colNumber);
	});
	$('.insertColAfter').on('click',function(){
			if(activeSheetName==undefined){
				alert('Either start by creating a new sheet or open an existing sheet');
				return;
			}
			if(dataMatrix[activeSheetName]==undefined){
				$('.lockScreen').show();
				dataMatrix[activeSheetName]=[[{'data':'','heading':''}]];
				renderMatrix();
				saveInstantState(0);
				return;
			}
			$('.lockScreen').show();
			var colNumber=parseInt($('.active')[0].id.split('x')[1]);
			var rows=dataMatrix[activeSheetName].length;
			for(var i=0;i<rows;i++)
			{
				dataMatrix[activeSheetName][i]=dataMatrix[activeSheetName][i].slice(0,colNumber+1).concat([{'data':undefined,'heading':undefined}],dataMatrix[activeSheetName][i].slice(colNumber+1,dataMatrix[activeSheetName][i].length));
			}
			renderMatrix();
			saveInstantState(colNumber+1);
	});
	$('.save').on('click',function(){saveSheet();});
});

function renderMatrix(){
	var matrix=dataMatrix[activeSheetName];
	if(matrix==undefined){
		$('.row').remove();
		return;
	}
	var rows=matrix.length;
	var cols=matrix[0].length;
	var activeId=undefined;
	try{
		activeId=$('.active')[0].id;
	}catch(e){activeId='0x0';}
	$('.row').remove();
	for(var i=0;i<rows;i++)
	{
		var r=document.createElement('div');
		$(r).addClass('row');
		for(var j=0;j<cols;j++)
		{
			var c=document.createElement('div');
			var data=document.createElement('div');
			var heading=document.createElement('div');
			$(c).addClass('col');
			$(c).append(heading);
			$(c).append(data);
			$(data)[0].id='data'+i+'x'+j;
			$(heading)[0].id='heading'+i+'x'+j;
			$(data).addClass('data');
			$(heading).addClass('heading');
			try{$(data).text(matrix[i][j].data);}catch(e){$(data).text(undefined);}
			try{$(heading).text(matrix[i][j].heading);}catch(e){$(heading).text(undefined);}
			if(matrix[i][j]['heading']!=undefined&&matrix[i][j]['heading'].length>0){
				$(heading).css({'display':'inline-block'});
			}
			$(c)[0].id=i+'x'+j;
			$(c).append(data);
			$(c).append(heading);
			$(data).attr('contenteditable','true');
			$(c).on('click',function(){$('.active').removeClass('active');$(this).addClass('active');});
			$(c).on('contextmenu',function(e){e.preventDefault();showToolBox(e);});
			$(data).on('keydown',function(){var r=this.parentElement.id.split('x')[0];var c=this.parentElement.id.split('x')[1];matrix[r][c].data=$(this).text();})
			$(data).on('keyup',function(){var r=this.parentElement.id.split('x')[0];var c=this.parentElement.id.split('x')[1];matrix[r][c].data=$(this).text();})
			$(r).append(c);
		}
		$('.sheetContainer').append(r);
	}
	$('#'+activeId).addClass('active');
}

function saveSheet(){
	var data=[];
	var heading=[]
	for(var i=0;i<dataMatrix[activeSheetName][0].length;i++)
	{
		data.push([]);
		heading.push([])
	}
	for(var i=0;i<dataMatrix[activeSheetName].length;i++)
	{
		for(var j=0;j<dataMatrix[activeSheetName][i].length;j++)
		{
			var x = dataMatrix[activeSheetName][i][j]["data"]==undefined?"":dataMatrix[activeSheetName][i][j]["data"]
			var y = dataMatrix[activeSheetName][i][j]["heading"]==undefined?"":dataMatrix[activeSheetName][i][j]["heading"]
			data[j].push(x);
			heading[j].push(y);
		}
	}
	data=JSON.stringify(data);
	heading=JSON.stringify(heading);
	$.ajax({url: "updateData", type: 'GET', data: {'data': data, 'sheetName': activeSheetName, 'heading': heading}});
}

function openSheet(sheetName){
	$.ajax({
		url:'openSheet',
		type:'GET',
		data:{'queryType':"openSheet",'sheetName':sheetName},
		success:function(data){
			activeSheetName=sheetName;
			var keys=Object.keys(data);
			var nrows=data[keys[0]].data.length;
			var ncols=keys.length;
			dataMatrix[activeSheetName]=[];
			for(var i=0;i<nrows;i++)
			{
				dataMatrix[activeSheetName].push([]);
				for(var j=0;j<ncols;j++)
				{
					dataMatrix[activeSheetName][i].push({'data':undefined,'heading':undefined});
				}
			}
			for(var i=0;i<keys.length;i++)
			{
				for(var j=0;j<data[keys[i]].data.length;j++)
				{
					dataMatrix[activeSheetName][j][keys[i]].data=data[keys[i]]['data'][j];
					dataMatrix[activeSheetName][j][keys[i]].heading=data[keys[i]]['heading'][j];
				}
			}
			addOpenedSheet(sheetName);
		}
	});
}

function saveInstantState(colNo){
	$.ajax({url: "addCol", type: 'GET', data: {'sheetName': activeSheetName, 'col': colNo}, success: function(data){$('.lockScreen').hide();}});
}

var toolboxRow="";
var toolboxColumn="";

function showToolBox(e){
	var x=e.clientX;
	var y=e.clientY;
	var currentTarget=e.target;
	if(currentTarget.id.indexOf('data')>=0||currentTarget.id.indexOf('heading')>=0){
		currentTarget=currentTarget.parentElement;
	}
	toolboxRow=parseInt(currentTarget.id.split('x')[0]);
	toolboxColumn=parseInt(currentTarget.id.split('x')[1]);
	$('.toolbox').css({'display':'inline-block','left':x+'px','top':y+'px'});
	$(document).on('click',function(){	$('.toolbox').css({'display':'none'});})
}

$('.deleteRow').on('mouseenter',function(){
	$('.highlight').removeClass('highlight');
	var numCols=dataMatrix[activeSheetName][0].length;
	for(var i=0;i<numCols;i++)
	{
		$('#'+toolboxRow+'x'+i).addClass('highlight');
	}
});

$('.deleteRow').on('mouseout',function(){
	$('.highlight').removeClass('highlight');
});

$('.deleteCol').on('mouseenter',function(){
	$('.highlight').removeClass('highlight');
	var numRows=dataMatrix[activeSheetName].length;
	for(var i=0;i<numRows;i++)
	{
		$('#'+i+'x'+toolboxColumn).addClass('highlight');
	}
});

$('.deleteCol').on('mouseout',function(){
	$('.highlight').removeClass('highlight');
});

$('.deleteRow').on('click',function(){
		dataMatrix[activeSheetName]=dataMatrix[activeSheetName].slice(0,toolboxRow).concat(dataMatrix[activeSheetName].slice(toolboxRow+1,dataMatrix[activeSheetName].length));
		renderMatrix();
});

$('.deleteCol').on('click',function(){
		for(var i=0;i<dataMatrix[activeSheetName].length;i++)
		{
			dataMatrix[activeSheetName][i]=dataMatrix[activeSheetName][i].slice(0,toolboxColumn).concat(dataMatrix[activeSheetName][i].slice(toolboxColumn+1,dataMatrix[activeSheetName][i].length));
		}
		renderMatrix();
		saveDeleteState(toolboxColumn);
});

$('.addHeading').on('click',function(){
	var h=prompt('Enter heading');
	dataMatrix[activeSheetName][toolboxRow][toolboxColumn]['heading']=h;
	showHeadingBox(toolboxRow,toolboxColumn,h);
});

function saveDeleteState(colNo){
	$.ajax({url: "delCol", type: 'GET', data: {'sheetName': sheetName, 'col': colNo}, success: function(data){console.log(data)}});
}

function showHeadingBox(r,c,heading){
	$('#heading'+r+'x'+c).text(heading);
	$('#heading'+r+'x'+c).css({'display':'inline-block'});
	if(heading.length==0){
		$('#heading'+r+'x'+c).css({'display':'none'});
	}
}

function addOpenedSheet(sheetName){
	var openedSheetTab=document.createElement('div');
	var openedSheetName=document.createElement('span');
	var sheetClose=document.createElement('span');
	$(openedSheetTab).addClass('openedSheetTab');
	$('.activeSheetTab').removeClass('activeSheetTab');
	$(openedSheetTab).addClass('activeSheetTab');
	$(openedSheetName).addClass('openedSheetName');
	$(openedSheetName).text(sheetName);
	$(sheetClose).addClass('sheetClose');
	$(sheetClose).addClass('fa fa-times');
	$(sheetClose).on('click',function(){var nextActive=$(this).parent().index()-1;if(nextActive<0){activeSheetName=undefined;;$(this).parent().remove();$('.row').remove();return;}$($(this).parent().parent().children()[nextActive]).click();$(this).parent().remove();})
	$(openedSheetTab).append(openedSheetName);
	$(openedSheetTab).append(sheetClose);
	$('.openedSheetContainer').append(openedSheetTab);
	activeSheetName=sheetName;
	$(openedSheetTab).on('click',function(){
		$('.activeSheetTab').removeClass('activeSheetTab');
		$(this).addClass('activeSheetTab');
		activeSheetName=$($(this).children()[0]).text();
		renderMatrix();
	});
	renderMatrix();
}

function updateExistingSheetList(){
	$.ajax({
		url:'/openSheet',
		data:{"queryType":"fetchNames"},
		success:function(data){existingSheets=data.split('[').join('').split(']').join('').split('"').join('').split(' ').join('').split(',');existingSheets.sort();}
	});
}

