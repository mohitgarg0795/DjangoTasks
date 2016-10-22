var matrix=undefined;
var active=undefined;
var sheetName=undefined;

$(document).ready(function(){
	var existingSheets="";
	$.ajax({
		url:'/openSheet',
		data:{"queryType":"fetchNames"},
		success:function(data){existingSheets=data.split('[').join('').split(']').join('').split('"').join('').split(' ').join('').split(',')}
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
			matrix=[[undefined]];
			renderMatrix();
		}
		else{
			var rowNumber=$('.active')[0].id.split('x')[0];
			var cols=matrix[0].length;
			var tempArray=[[]];
			for(var i=0;i<cols;i++)
			{
				tempArray[0].push(undefined);
			}
			matrix=matrix.slice(0,rowNumber).concat(tempArray,matrix.slice(rowNumber,matrix.length));
			renderMatrix();
		}
	});
	$('.insertRowAfter').on('click',function(){
		if(matrix==undefined){
			matrix=[[undefined]];
			renderMatrix();
		}
		else{
			var rowNumber=$('.active')[0].id.split('x')[0];
			var cols=matrix[0].length;
			var tempArray=[[]];
			for(var i=0;i<cols;i++)
			{
				tempArray[0].push(undefined);
			}
			matrix=matrix.slice(0,rowNumber+1).concat(tempArray,matrix.slice(rowNumber+1,matrix.length));
			renderMatrix();
		}
	});
	$('.insertColBefore').on('click',function(){
		if(matrix==undefined){
			matrix=[[undefined]];
			renderMatrix();
		}
		else{
			var colNumber=$('.active')[0].id.split('x')[1];
			var rows=matrix.length;
			for(var i=0;i<rows;i++)
			{
				matrix[i]=matrix[i].slice(0,colNumber).concat([undefined],matrix[i].slice(colNumber,matrix[i].length));
			}
			renderMatrix();
		}
	});
	$('.insertColAfter').on('click',function(){
		if(matrix==undefined){
			matrix=[[undefined]];
			renderMatrix();
		}
		else{
			var colNumber=$('.active')[0].id.split('x')[1];
			var rows=matrix.length;
			for(var i=0;i<rows;i++)
			{
				matrix[i]=matrix[i].slice(0,colNumber+1).concat([undefined],matrix[i].slice(colNumber+1,matrix[i].length));
			}
			renderMatrix();
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
			$(c).addClass('col');
			$(c).text(matrix[i][j]);
			$(c)[0].id=i+'x'+j;
			$(c).attr('contenteditable','true');
			$(c).on('click',function(){$('.active').removeClass('active');$(this).addClass('active');});
			$(c).on('keydown',function(){var r=this.id.split('x')[0];var c=this.id.split('x')[1];matrix[r][c]=$(this).text();})
			$(c).on('keyup',function(){var r=this.id.split('x')[0];var c=this.id.split('x')[1];matrix[r][c]=$(this).text();})
			$(r).append(c);
		}
		$('.sheetContainer').append(r);
	}
	$('#'+activeId).addClass('active');
}

function saveSheet(){
	var data=[];
	for(var i=0;i<matrix[0].length;i++)
	{
		data.push([]);
	}
	for(var i=0;i<matrix.length;i++)
	{
		for(var j=0;j<matrix[i].length;j++)
		{
			data[j].push(matrix[i][j]);
		}
	}
	console.log(sheetName);
	$.ajax({url: "updateData", type: 'GET', data: {'sheet': data, 'sheetName': sheetName}});
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
					matrix[i].push(undefined);
				}
			}
			for(var i=0;i<keys.length;i++)
			{
				for(var j=0;j<data[keys[i]].length;j++)
				{
					matrix[j][keys[i]]=data[keys[i]][j];
				}
			}
			renderMatrix();
		}
	});
}

//$.ajax({url: "openSheet", type: 'GET', data: {'id': " **** "}});
