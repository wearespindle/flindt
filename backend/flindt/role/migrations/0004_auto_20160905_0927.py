# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-05 07:27
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('role', '0003_auto_20160903_1303'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='role',
            name='lead_link',
        ),
        migrations.RemoveField(
            model_name='role',
            name='rep_link',
        ),
    ]
