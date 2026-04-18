from django.db import models

# Create your models here.

class Protinidi(models.Model):
    name = models.CharField()
    mobile = models.CharField()
    exam_id = models.CharField()
    user_id = models.CharField()
    email = models.EmailField()
    address = models.CharField(null=True,blank=True)
    education = models.CharField(null=True,blank=True)
    date_of_birth = models.CharField(null=True,blank=True)
    
    def __str__(self):
        return self.name


class ExamRecord(models.Model):
    student = models.ForeignKey(Protinidi, on_delete=models.CASCADE, related_name='student')
    total_marks = models.CharField()
    test_mark = models.CharField(null=True,blank=True)
    viva_mark = models.CharField(null=True,blank=True)
    behaviour_mark = models.CharField(null=True,blank=True)
    
    def __str__(self):
        return self.student.name


class FileField(models.Model):
    title = models.CharField()
    file = models.FileField(upload_to='ChatroKontho/')