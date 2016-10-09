# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Rooms',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('roomId', models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Time',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('time9', models.BooleanField(default=False)),
                ('time10', models.BooleanField(default=False)),
                ('time11', models.BooleanField(default=False)),
                ('time12', models.BooleanField(default=False)),
                ('time1', models.BooleanField(default=False)),
                ('time2', models.BooleanField(default=False)),
                ('time3', models.BooleanField(default=False)),
                ('time4', models.BooleanField(default=False)),
                ('time5', models.BooleanField(default=False)),
                ('time6', models.BooleanField(default=False)),
                ('time7', models.BooleanField(default=False)),
                ('time8', models.BooleanField(default=False)),
            ],
        ),
        migrations.AddField(
            model_name='rooms',
            name='time',
            field=models.ForeignKey(to='tracker.Time'),
        ),
    ]
