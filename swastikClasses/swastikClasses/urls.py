"""swastikClasses URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin

import tracker.views as tviews
import fees.views as fviews
import manager.views as mviews

urlpatterns = [
	url(r'^admin/', admin.site.urls),
	url(r'^update$', tviews.update),
    url(r'^fetch$', tviews.fetch),
	url(r'^$', tviews.index),
    url(r'^fees$',fviews.index),
    url(r'^manager$', mviews.index),
    url(r'^updateData$', mviews.updateData),
    url(r'^openSheet$', mviews.openSheet),
    url(r'^addCol$', mviews.addCol),
    url(r'^delCol$', mviews.deleteCol),
    url(r'^file/importFile$', fviews.importFile),
    url(r'^file/existingFileNames$', fviews.existingFileNames),
    url(r'^file/openFile$', fviews.openFile),
]
