from django.shortcuts import render
from .models import ExamRecord, Protinidi

def is_passed(total_marks_str):
    return int(total_marks_str or 0) >= 80 


def home(request):
    context = {}

    if request.method == 'POST':
        exam_id = request.POST.get('exam_id', '').strip().upper()
        context['submitted_id'] = exam_id

        try:
            student  = Protinidi.objects.get(exam_id__iexact=exam_id)
            record   = ExamRecord.objects.get(student=student)
            context['record']    = record
            context['is_passed'] = is_passed(record.total_marks)
        except Protinidi.DoesNotExist:
            context['error'] = 'সঠিক এক্সাম আইডি লিখুন।'
        except ExamRecord.DoesNotExist:
            context['error'] = 'এই প্রার্থীর পরীক্ষার ফলাফল এখনো প্রকাশিত হয়নি।'

    return render(request, 'index.html', context)
