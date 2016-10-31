
var dataMatrix={temp:[{'First Name':'Jasmeet'},{'Middle Name':'Singh'},{'Last Name':'Saini'}]};
var currentActiveSheet=undefined;
var existingfiles=undefined;

$(document).ready(function(){
	$('.importFile').on('click',function(){
		$('.hiddenInput').click();
	})
});

function importFile(matrix,fileName){
	matrix=JSON.stringify(matrix);
	$.ajax({
		url:'file/importFile',
		type:'GET',
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
	//$.ajax()
}

function updateDataMatrix(fileName){
	//$.ajax({}); update the dataMatrix to store the file data
}

function addSheetTab(fileName){
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

