from __future__ import unicode_literals

from django.db import models


class Rooms(models.Model):
	roomId = models.CharField(max_length = 10)

	def __unicode__(self):
		return self.roomId

class Time(models.Model):
	Rooms = models.ManyToManyField(Rooms)
	date = models.DateField()
	time = models.CharField(max_length=2)

	def __unicode__(self):
		return "date : " + str(self.date) + " time : " + self.time
	
