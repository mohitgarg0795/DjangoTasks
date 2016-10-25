var matrix=undefined;
var active=undefined;
var sheetName=undefined;

$(document).ready(function(){
	var existingSheets="";
	$.ajax({
		url:'/openSheet',
		data:{"queryType":"fetchNames"},
		success:function(data){existingSheets=data.split('[').join('').split(']').join('').split('"').join('').split(' ').join('').split(',');existingSheets.sort();}
	});
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
			$('.beginOptions').hide();
			$('.sheetContent').show();
			document.title=sheetName;
		}
	});
	$('.openExistingSheet').on('click',function(){
		$('.beginOptions').hide();
		$('.sheet').remove();
		for(var i=0;i<existingSheets.length;i++)
		{
			var d=document.createElement('div');
			$(d).text(existingSheets[i]);
			$(d).addClass('sheet');
			d.id=existingSheets[i];
			$(d).on('click',function(){openSheet(this);$('.existingSheetContainer').hide();$('.sheetContent').show();});
			$('.sheetPanel').append(d);
		}
		$('.existingSheetContainer').show();
	});
	$('.insertRowBefore').on('click',function(){
		if(matrix==undefined){
			$('.lockScreen').show();
			matrix=[[{'data':undefined,'heading':undefined}]];
			renderMatrix();
			saveInstantState(0);
		}
		else{
			var rowNumber=parseInt($('.active')[0].id.split('x')[0]);
			var cols=matrix[0].length;
			var tempArray=[[]];
			for(var i=0;i<cols;i++)
			{
				tempArray[0].push({'data':undefined,'heading':undefined});
			}
			matrix=matrix.slice(0,rowNumber).concat(tempArray,matrix.slice(rowNumber,matrix.length));
			renderMatrix();
		}
	});
	$('.insertRowAfter').on('click',function(){
		if(matrix==undefined){
			$('.lockScreen').show();
			matrix=[[{'data':undefined,'heading':undefined}]];
			renderMatrix();
			saveInstantState(0);
		}
		else{
			var rowNumber=parseInt($('.active')[0].id.split('x')[0]);
			var cols=matrix[0].length;
			var tempArray=[[]];
			for(var i=0;i<cols;i++)
			{
				tempArray[0].push({'data':undefined,'heading':undefined});
			}
			matrix=matrix.slice(0,rowNumber+1).concat(tempArray,matrix.slice(rowNumber+1,matrix.length));
			renderMatrix();
		}
	});
	$('.insertColBefore').on('click',function(){
		if(matrix==undefined){
			$('.lockScreen').show();
			matrix=[[{'data':undefined,'heading':undefined}]];
			renderMatrix();
			saveInstantState(0);
		}
		else{
			$('.lockScreen').show();
			var colNumber=parseInt($('.active')[0].id.split('x')[1]);
			var rows=matrix.length;
			for(var i=0;i<rows;i++)
			{
				matrix[i]=matrix[i].slice(0,colNumber).concat([{'data':undefined,'heading':undefined}],matrix[i].slice(colNumber,matrix[i].length));
			}
			renderMatrix();
			saveInstantState(colNumber);
		}
	});
	$('.insertColAfter').on('click',function(){
		if(matrix==undefined){
			$('.lockScreen').show();
			matrix=[[{'data':undefined,'heading':undefined}]];
			renderMatrix();
			saveInstantState(0);
		}
		else{
			$('.lockScreen').show();
			var colNumber=parseInt($('.active')[0].id.split('x')[1]);
			var rows=matrix.length;
			for(var i=0;i<rows;i++)
			{
				matrix[i]=matrix[i].slice(0,colNumber+1).concat([{'data':undefined,'heading':undefined}],matrix[i].slice(colNumber+1,matrix[i].length));
			}
			renderMatrix();
			saveInstantState(colNumber+1);
		}
	});
	$('.save').on('click',function(){saveSheet();});
});

function renderMatrix(){
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
	var heading=[];
	for(var i=0;i<matrix[0].length;i++)
	{
		data.push([]);
		heading.push([]);
	}
	for(var i=0;i<matrix.length;i++)
	{
		for(var j=0;j<matrix[i].length;j++)
		{
			data[j].push(matrix[i][j].data);
			heading[j].push(matrix[i][j].heading);
		}
	}
	$.ajax({url: "updateData", type: 'GET', data: {'sheet': data, 'heading':heading 'sheetName': sheetName}});
}

function openSheet(d){
	$.ajax({
		url:'openSheet',
		type:'GET',
		data:{'queryType':"openSheet",'sheetName':d.id},
		success:function(data){
			sheetName=d.id;
			var keys=Object.keys(data);
			var nrows=data[keys[0]].length;
			var ncols=keys.length;
			matrix=[];
			for(var i=0;i<nrows;i++)
			{
				matrix.push([]);
				for(var j=0;j<ncols;j++)
				{
					matrix[i].push({'data':undefined,'heading':undefined});
				}
			}
			for(var i=0;i<keys.length;i++)
			{
				for(var j=0;j<data[keys[i]].length;j++)
				{
					matrix[j][keys[i]].data=data[keys[i]][j];
					// wont work until backend modified matrix[j][keys[i]].heading=heading[keys[i]][j];
				}
			}
			renderMatrix();
		}
	});
}

function saveInstantState(colNo){
	$.ajax({url: "addCol", type: 'GET', data: {'sheetName': sheetName, 'col': colNo}, success: function(data){$('.lockScreen').hide();}});
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
	console.log(currentTarget);
	toolboxRow=parseInt(currentTarget.id.split('x')[0]);
	toolboxColumn=parseInt(currentTarget.id.split('x')[1]);
	$('.toolbox').css({'display':'inline-block','left':x+'px','top':y+'px'});
	$(document).on('click',function(){	$('.toolbox').css({'display':'none'});})
}

$('.deleteRow').on('mouseenter',function(){
	$('.highlight').removeClass('highlight');
	var numCols=matrix[0].length;
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
	var numRows=matrix.length;
	for(var i=0;i<numRows;i++)
	{
		$('#'+i+'x'+toolboxColumn).addClass('highlight');
	}
});

$('.deleteCol').on('mouseout',function(){
	$('.highlight').removeClass('highlight');
});

$('.deleteRow').on('click',function(){
		matrix=matrix.slice(0,toolboxRow).concat(matrix.slice(toolboxRow+1,matrix.length));
		renderMatrix();
});

$('.deleteCol').on('click',function(){
		for(var i=0;i<matrix.length;i++)
		{
			matrix[i]=matrix[i].slice(0,toolboxColumn).concat(matrix[i].slice(toolboxColumn+1,matrix[i].length));
		}
		renderMatrix();
		saveDeleteState(toolboxColumn);
});

$('.addHeading').on('click',function(){
	var h=prompt('Enter heading');
	matrix[toolboxRow][toolboxColumn]['heading']=h;
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