import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { doctors, type Patient, WORKFLOW_STAGES } from '@/lib/mockData';

interface AddPatientDialogProps {
  onAdd: (patient: Patient) => void;
}

export function AddPatientDialog({ onAdd }: AddPatientDialogProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [doctor, setDoctor] = useState(doctors[0]?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age) return;

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const id = `PT-${1000 + Math.floor(Math.random() * 9000)}`;

    const newPatient: Patient = {
      id,
      name,
      age: parseInt(age),
      gender,
      assignedDoctor: doctor,
      currentStage: 'OPD Visit',
      status: 'in-progress',
      lastUpdated: timestamp,
      timeline: WORKFLOW_STAGES.map((stage, i) => ({
        stage,
        timestamp: i === 0 ? timestamp : '',
        status: i === 0 ? 'in-progress' : 'pending',
        department: i === 0 ? 'OPD' : '',
      })),
      tests: [],
    };

    onAdd(newPatient);
    setName('');
    setAge('');
    setGender('Male');
    setDoctor(doctors[0]?.name || '');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          {t('addPatient')}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('addPatient')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">{t('age')}</Label>
              <Input id="age" type="number" min="0" max="150" value={age} onChange={e => setAge(e.target.value)} placeholder="45" required />
            </div>
            <div className="space-y-2">
              <Label>{t('gender')}</Label>
              <Select value={gender} onValueChange={(v: 'Male' | 'Female' | 'Other') => setGender(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('assignedDoctor')}</Label>
            <Select value={doctor} onValueChange={setDoctor}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {doctors.map(d => (
                  <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">{t('addPatient')}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
