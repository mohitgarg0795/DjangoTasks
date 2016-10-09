
var timeArray=["9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm"];

var roomArray=["Room1","Room2","Room3","Room4","Room5","Room6","Room7"];

var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

var months=["January","February","March","April","May","June","July","August","September","October","November","December"];

$(document).ready(function(){

	checkChanges(); // modify matrix to show current day

	function checkChanges(){
		
		$('.crow').remove(); // remove current matrix
		createMatrix(); // create matrix
		var currentDate=new Date();
		var timeInterval=(((60-currentDate.getSeconds())*1000)+((59-currentDate.getMinutes())*60000));
		console.log('Next Update in '+timeInterval/1000+' seconds');
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
		console.log(timeArray);
		for(var i=0;i<timeArray.length;i++)
		{
			if($('.'+timeArray[i]).hasClass(time))
			{
				$('.'+timeArray[i]).addClass('currentTime');
				$('.timeLabel').removeClass('currentTime');
				$('.currentTime').css({'background':'#ecf0f1'});
			}
			else
			{
				$('.'+timeArray[i]).addClass('locked');
				for(var j=0;j<$('.'+timeArray[i]).children().length;j++)
				{
					$($($('.'+timeArray[i])[j]).children()[0]).remove();
				}
			}
		}
		$('.timeLabel').removeClass('locked');
		setTimeout(function(){checkChanges()},timeInterval); // check for changes every 20s
	}

	function createMatrix(){

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
					$(col).attr('time',timeArray[i-1]);
					$(col).attr('room',roomArray[j-1]);
					var optionsContainer=document.createElement('div');
					$(optionsContainer).addClass('optionsContainer');
					var classTaken=document.createElement('div');
					var classMissed=document.createElement('div');
					var classStat=document.createElement('div');
					$(classStat).addClass('classStat');
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

		$.ajax({
			url:'fetch',
			method:'GET',
			success:function(data){
				console.log(data);
				var time=Object.keys(data);
				 myMap={};
				for(var i=0;i<time.length;i++)
				{
					var ctime=time[i];
					var rooms=data[ctime];
					myMap[ctime]={};
					for(var j=0;j<rooms.length;j++)
					{
						myMap[ctime][rooms[j]]='true';
					}
				}
				for(var i=0;i<$('.classStat').length;i++)
				{
					var targetElement=$($('.classStat')[i]).parent();
					var time=targetElement.attr('time').substr(0,targetElement.attr('time').length-2);
					var room=targetElement.attr('room');
					if(myMap[time][room]!=undefined){
						$($('.classStat')[i]).text('Class Taken');
					}
				}
			}
		});
	}

	$('.classTaken').on('click',function(){
		$(this).parent().parent().attr('classTaken','true');
		$(this).parent().parent().addClass('update');
		$($(this).parent().parent().children()[1]).text('Class Taken');
	});

	$('.classMissed').on('click',function(){
		$(this).parent().parent().attr('classTaken','false');
		$(this).parent().parent().removeClass('update');
		$($(this).parent().parent().children()[1]).text('');
	});

	$('.updateButton').on('click',function(){
		// TODO store any changes in database (send ajax request to a route handelled at server to store data)
		// elements to be updated have the class update
		// for any hour classes attended = all elements with class = update

		//var classTaken = document.getElementsByClassName('update');
		var classTaken = $('.update');
		var classes = [], time;
		
		var i = 0;
		while(i<classTaken.length)
			{
				//console.log($(classTaken[i]).attr('time'));
				classes.push($(classTaken[i]).attr('room'));
				time = $(classTaken[i]).attr('time');
				i+=1;
			}
		//console.log(classes);
		console.log(time);
		$.ajax({url: "update", type: 'GET', data: {'classes': classes, 'time': time}});
		//send_text();

	})
/*
	var send_text=function(){
			var text="mohit";
			$.get('update', {text: text}, function(data){
               console.log("mohit");
    });
}
*/

});