
var dataMatrix={};
var currentActiveSheet=undefined;
var existingfiles=undefined;

$(document).ready(function(){
	$('.importFile').on('click',function(){
		$('.hiddenInput').click();
	});
	$('.openFile').on('click',function(){
		fetchExistingFileNames();
	});
	$('.confirmOpenSheet').on('click',function(){
		var file=$('.openSheet').val();
		updateDataMatrix(file);
		addSheetTab(file);
		render(file);
		$('.existingFileContainer').hide();
	});
	$('.cancelOpenSheet').on('click',function(){
		$('.existingFileContainer').hide();
	});
});

function importFile(matrix,fileName){
	matrix=JSON.stringify(matrix);
	$.ajax({
		url:'file/importFile',
		type:'POST',
		data:{'fileName':fileName,'content':matrix},
		success:function(data){
			console.log(data);
			updateDataMatrix(fileName); // to reflect changes in database into the dataMatrix
			addSheetTab(fileName); // to add a sheet Tab in the sheetTabWindow
			render(fileName); // to render dataMatrix to screen
		}
	})
}

function fetchExistingFileNames(){
	$.ajax({
		url:'file/existingFileNames',
		type:'GET',
		success:function(data){
			data=JSON.parse(data);
			$('.openSheet').children().remove();
			for(var i=0;i<data.length;i++)
			{
				var option=document.createElement('option');
				$(option).attr('val',data[i]);
				$(option).text(data[i]);
				$('.openSheet').append(option);
			}
			$('.existingFileContainer').show();
		}
	});	
}

function updateDataMatrix(fileName){
	$.ajax({
		url:'/file/openFile',
		type:'GET',
		data:{'fileName':fileName},
		success:function(data){
			dataMatrix[fileName]=data;
		}
	});
}

function addSheetTab(fileName){
	$('.empty').hide();
	var sheetTab=document.createElement('div');
	var sheetTabName=document.createElement('span');
	var sheetTabClose=document.createElement('span');
	$(sheetTab).addClass('sheetTab');
	$(sheetTabName).addClass('sheetTabName');
	$(sheetTabClose).addClass('sheetTabClose fa fa-times');
	$(sheetTab).append(sheetTabName);
	$(sheetTab).append(sheetTabClose);
	$(sheetTabName).text(fileName);
	$('.activeSheetTab').removeClass('activeSheetTab');
	$(sheetTab).addClass('activeSheetTab');
	currentActiveSheet=fileName;
	$('.sheetSwitchWindow').append(sheetTab);
}

function render(fileName){
	var renderReady=false;
	setTimeout(function(){
	if(dataMatrix[fileName]!=undefined){renderReady=true;}
	if(renderReady){
		var data=dataMatrix[fileName];
		var rowKeys=Object.keys(data);
		var numRows=rowKeys.length;
		var headings=Object.keys(data[rowKeys[0]]);
		for(var i=0;i<numRows;i++)
		{
			console.log(data[rowKeys[i]]);
			for(var j=0;j<headings.length;j++)
			{
				//console.log(data[rowKeys[i]][headings[j]]);
			}
		}
	}
	},100);
}

$('.hiddenInput').on('change',function(e) {
	   var file = e.target.files[0]; 
	   var reader = new FileReader();
	   reader.onload = function() {
	   		var fileName=prompt('Enter file name');
	   	 	var result,matrix=[];
	   	 	result=this.result;
	   	 	result=result.split(decodeURI('%0A'));
	   	 	for(var i=0;i<result.length;i++)
	   	 	{
	   	 		matrix.push([]);
	   	 		var content='';
	   	 		var open=false;
	   	 		for(var j=0;j<result[i].length;j++)
	   	 		{
	   	 			if(result[i][j]=='"')
	   	 			{
	   	 				open=!open;
	   	 			}
	   	 			else
	   	 			if(result[i][j]==','&&!open&&content.length>0)
	   	 			{
	   	 		
	   	 				matrix[i].push(content);
	   	 				content='';
	   	 			}
	   	 			else
	   	 			{
	   	 				content+=result[i][j];
	   	 			}

	   	 		}
	   	 		if(content.length>0)
	   	 		{
	   	 			matrix[i].push(content);
	   	 			content='';
	   	 		}
	   	 	}
	   	 	importFile(matrix,fileName);        
	   	}
	   reader.readAsText(file)
});