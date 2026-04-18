from django.contrib import admin
from .models import Protinidi, ExamRecord, FileField

@admin.register(Protinidi)
class ProtinidiAdmin(admin.ModelAdmin):
    # Display these columns in the list view
    list_display = ('name', 'mobile', 'exam_id', 'user_id', 'email')
    
    # Enable searching for all fields in Protinidi
    search_fields = (
        'name', 'mobile', 'exam_id', 'user_id', 'email', 
        'address', 'education', 'date_of_birth'
    )

@admin.register(ExamRecord)
class ExamRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'total_marks', 'test_mark', 'viva_mark', 'behaviour_mark')
    
    # To search by the student's name or other Protinidi fields, 
    # use student__[field_name]
    search_fields = (
        'student__name', 
        'student__mobile', 
        'student__exam_id',
        'total_marks', 
        'test_mark', 
        'viva_mark', 
        'behaviour_mark'
    )


@admin.register(FileField)
class ProtinidiAdmin(admin.ModelAdmin):
    # Display these columns in the list view
    list_display = ('title',)
    
    # Enable searching for all fields in Protinidi
    search_fields = (
        'title',
    )