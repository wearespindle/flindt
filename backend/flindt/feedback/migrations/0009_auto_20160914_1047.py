# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-14 08:47
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0008_auto_20160907_1428'),
    ]

    operations = [
        migrations.RenameField(
            model_name='feedbackonrole',
            old_name='remark',
            new_name='remarks',
        ),
    ]