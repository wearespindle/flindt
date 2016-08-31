from django.contrib import admin

from .models import Rating, Remark, Question


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('name',)


admin.site.register(Rating)
admin.site.register(Remark)
admin.site.register(Question, QuestionAdmin)
