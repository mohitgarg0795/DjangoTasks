
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
		success:function(data){console.log(data);}
	})
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

