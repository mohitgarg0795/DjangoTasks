
var dataMatrix={};
var currentActiveSheet=undefined;
var existingfiles=undefined;
var swapState=false;
var swapCol1=undefined,swapCol2=undefined;

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
	$('.swapColumns').on('click',function(){
		swapColumns();
	});
	$('.sheetRequired').on('click',function(){
		if(currentActiveSheet==undefined){
			alert('No sheet opened');
		}
	});
	$('.addEntry').on('click',function(){
		addEntry();
	});
});

function importFile(matrix,fileName){
	matrix=JSON.stringify(matrix);
	$.ajax({
		url:'fees/importFile',
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
		url:'fees/existingFileNames',
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
		url:'/fees/openFile',
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
	$(sheetTab).on('click',function(){
		currentActiveSheet=$($(this).children()[0]).text();
		$('.activeSheetTab').removeClass('activeSheetTab');
		$(this).addClass('activeSheetTab');
		dataMatrix[currentActiveSheet]=undefined;
		updateDataMatrix(currentActiveSheet);
		render(currentActiveSheet);
	});
	$(sheetTabClose).on('click',function(){
		if($(this.parentElement).hasClass('activeSheetTab')){
			var tabNum=$(this.parentElement).index();
			var totalTabs=$(this.parentElement.parentElement).children().length;
			var targetTab=tabNum-1;
			if(targetTab==-1){
				targetTab=tabNum+1;
			}
			if(targetTab==totalTabs){
				currentActiveSheet=undefined;
				$('.empty').show();
				$('.row').remove();
				$(this.parentElement).remove();
			}
			else
			{
				$($(this.parentElement.parentElement).children()[targetTab]).click();
				$(this.parentElement).remove();
			}
		}
		else
		{
			$(this.parentElement).remove();
		}
	});
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
		var headings=data['headings'];
		var k=0;
		$('.row').remove();
		for(var i=-1;i<numRows;i++)
		{
				var row=document.createElement('div');
				$(row).addClass('row');
				if(i==-1||rowKeys[i]!='headings'){
					for(var j=0;j<headings.length;j++)
					{
						var col=document.createElement('div');
						var val=headings[j];
						if(i!=-1){val=data[rowKeys[i]][headings[j]].val}
						$(col).text(val);
						$(col).addClass('col row'+k+' col'+j);
						col.id=k+'x'+j;
						$(row).append(col);
					}
					$('.mainContent').append(row);
					k++;
			}
		}
	}
	},100);
}

function swapColumns(){
	swapCol1=undefined;
	swapCol2=undefined;
	if(currentActiveSheet==undefined){return;}
	swapState=true;
	$('.swapColumns').css({'color':'#69EC97'});
}

$(document).on('mousedown',function(e){
		if(swapState){
			var clicked=e.target;
			if(!$(clicked).hasClass('col')||(swapCol1!=undefined&&$(e.target).hasClass('activeCol'))){
				swapCol1=undefined;
				$('.swapColumns').css({'color':'#FFFFFF'});
				$('.activeCol').removeClass('activeCol');
				swapState=false;
			}
			else
			if(swapCol1==undefined){
				swapCol1=$('#0x'+clicked.id.split('x')[1]).text();
				$('.col'+clicked.id.split('x')[1]).addClass('activeCol');
			}
			else
			{
				swapCol2=$('#0x'+clicked.id.split('x')[1]).text();
				$('.col'+clicked.id.split('x')[1]).addClass('activeCol');
				swap(swapCol1,swapCol2);
				swapState=false;
			}
		}
});

function swap(swapCol1,swapCol2){	
	$.ajax({
		url:'fees/colSwap',
		type:'GET',
		data:{'heading1':swapCol1,'heading2':swapCol2,'fileName':currentActiveSheet},
		success:function(data){
			console.log(data);
			$('.activeCol').removeClass('activeCol');
			$('.swapColumns').css({'color':'#FFFFFF'});
		}
	})
}

function addEntry(){
	$.ajax({
		url:'fees/addNewEntry',
		type:'GET',
		data:{'fileName':currentActiveSheet},
		success:function(data){console.log(data);}
	});
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

setInterval(function(){
	if(currentActiveSheet!=undefined){
		console.log('rendering');
		updateDataMatrix(currentActiveSheet);
		render(currentActiveSheet);
	}else{
		console.log('not rendering');
	}
},1000);