from django.shortcuts import render
from .models import ExamRecord, Protinidi

def is_passed(record):
    try:
        test = int(record.test_mark or 0)
        viva = int(record.viva_mark or 0)
        behaviour = int(record.behaviour_mark or 0)
        total = test + viva + behaviour
        return total >= 80
    except (ValueError, TypeError):
        return False  # "NOT EXAM" or "-" will safely return False
def home(request):
    context = {}

    if request.method == 'POST':
        exam_id = request.POST.get('exam_id', '').strip().upper()
        context['submitted_id'] = exam_id

        try:
            student  = Protinidi.objects.get(exam_id__iexact=exam_id)
            record   = ExamRecord.objects.get(student=student)
            context['record']    = record
            context['is_passed'] = is_passed(record)
        except Protinidi.DoesNotExist:
            context['error'] = 'সঠিক এক্সাম আইডি লিখুন।'
        except ExamRecord.DoesNotExist:
            context['error'] = 'এই প্রার্থীর পরীক্ষার ফলাফল এখনো প্রকাশিত হয়নি।'

    return render(request, 'index.html', context)
