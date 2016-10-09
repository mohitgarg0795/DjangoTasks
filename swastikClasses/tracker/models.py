from __future__ import unicode_literals

from django.db import models

class Time(models.Model):
	date = models.DateField()
	time9 = models.BooleanField(default = False)
	time10 = models.BooleanField(default = False)
	time11 = models.BooleanField(default = False)
	time12 = models.BooleanField(default = False)
	time1 = models.BooleanField(default = False)
	time2 = models.BooleanField(default = False)
	time3 = models.BooleanField(default = False)
	time4 = models.BooleanField(default = False)
	time5 = models.BooleanField(default = False)
	time6 = models.BooleanField(default = False)
	time7 = models.BooleanField(default = False)
	time8 = models.BooleanField(default = False)

	def __unicode__(self):
		return self.date

class Rooms(models.Model):
	roomId = models.CharField(max_length = 10)
	time = models.ForeignKey(Time, null = True)

	def __unicode__(self):
		return self.roomId
	
	
