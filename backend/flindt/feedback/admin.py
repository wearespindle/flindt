from django.contrib import admin

from .models import (Feedback, FeedbackOnIndividual, FeedbackOnRole, Question, Rating, Remark)


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('name',)


admin.site.register(Rating)
admin.site.register(Remark)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Feedback)
admin.site.register(FeedbackOnRole)
admin.site.register(FeedbackOnIndividual)
