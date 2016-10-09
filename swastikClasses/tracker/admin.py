from django.contrib import admin

# Register your models here.

from .models import Rooms, Time

admin.site.register(Rooms)
admin.site.register(Time)
