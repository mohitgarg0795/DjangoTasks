
var timeArray=["9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm"];

var roomArray=["Room1","Room2","Room3","Room4","Room5","Room6","Room7"];

var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

var months=["January","February","March","April","May","June","July","August","September","October","November","December"];

$(document).ready(function(){

	checkChanges(); // modify matrix to show current day

	function checkChanges(){
		
		// TODO before removing the matrix store any changes in database (send ajax request to a route handelled at server to store data)

		$('.crow').remove(); // remove current matrix
		createMatrix(); // create matrix
		var currentDate=new Date();
		var showDate=days[currentDate.getDay()]+', '+currentDate.getDate()+' '+months[currentDate.getMonth()]+' '+currentDate.getFullYear();
		$('.headerDate').attr('date',currentDate.getDay());
		$('.headerDate').attr('month',currentDate.getMonth());
		$('.headerDate').attr('year',currentDate.getFullYear());
		$('.headerDate').text(showDate);
		var time=currentDate.getHours();
		var stat='am';
		if(time>=12)
		{
			time-=12;
			stat='pm';
		}
		time=time+stat;
		for(var i=0;i<timeArray.length;i++)
		{
			if($('.'+timeArray[i]).hasClass(time))
			{
				$('.'+timeArray[i]).addClass('currentTime');
				$('.timeLabel').removeClass('currentTime');
				$('.currentTime').css({'background':'#ecf0f1'});
				break;
			}
			else
			{
				$('.'+timeArray[i]).addClass('locked');
				$('.'+timeArray[i]).children().remove();
			}
		}
		$('.timeLabel').removeClass('locked');
		setTimeout(function(){checkChanges()},20000); // check for changes every 20s
	}

	function createMatrix(){

		// TODO before creating the matrix fetch data from the server 

		for(var i=0;i<13;i++)
		{
			var row=document.createElement('div');
			row.className='crow';
			for(var j=0;j<8;j++)
			{
				var col=document.createElement('div');
				col.className='ccol';
				if(i==0&&j>0) // if roomLabel
				{
					$(col).addClass('roomLabel');
					$(col).addClass(roomArray[j-1]);
					col.innerHTML=roomArray[j-1];
				}
				if(j%8==0) // if timeLabel
				{
					$(col).addClass('timeLabel');
					$(col).addClass(timeArray[i-1]);
					col.innerHTML=timeArray[i-1];
				}
				if(!(i==0&&j>0)&&!(j%8==0)) // any other cell than a dayLabel and timeLabel
				{
					$(col).addClass(timeArray[i-1]);
					$(col).addClass(roomArray[j-1]);
					var optionsContainer=document.createElement('div');
					$(optionsContainer).addClass('optionsContainer');
					var classTaken=document.createElement('div');
					var classMissed=document.createElement('div');
					var classStat=document.createElement('div');
					$(classTaken).addClass('classTaken fa fa-check');
					$(classMissed).addClass('classMissed fa fa-times');
					$(optionsContainer).append(classTaken);
					$(optionsContainer).append(classMissed);
					$(col).append(optionsContainer);
					$(col).append(classStat);
				}
				$(col).attr('classTaken','unset');
				$(row).append(col);
			}
			$('.content').append(row);
		}
		var firstCell=$('.ccol')[0]; // hide first column
		firstCell.className+=' hiddenCell';
	}

	$('.classTaken').on('click',function(){
		$(this).parent().parent().attr('classTaken','true');
		$(this).parent().parent().addClass('update');
		$($(this).parent().parent().children()[1]).text('Class Taken');
	});

	$('.classMissed').on('click',function(){
		$(this).parent().parent().attr('classTaken','false');
		$(this).parent().parent().addClass('update');
		$($(this).parent().parent().children()[1]).text('Class Missed');
	});

});