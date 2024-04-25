from django import forms
from match_core.models import Reports

class ReportsForm(forms.ModelForm):
    class Meta:
        model = Reports
        fields = ["player_reported", "report"]

  