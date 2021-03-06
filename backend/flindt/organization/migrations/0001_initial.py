# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-07 09:45
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('role', '0005_auto_20160906_1029'),
    ]

    operations = [
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('glassfrog_api_key', models.CharField(max_length=255)),
                ('slack_api_key', models.CharField(max_length=255)),
                ('roles', models.ManyToManyField(to='role.Role')),
                ('users', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
