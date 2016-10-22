
var matrix=undefined;
var active=undefined;

$(document).ready(function(){
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
	console.log(data);
}