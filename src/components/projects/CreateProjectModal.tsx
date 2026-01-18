import { useState } from 'react';
import { Grid3X3, Plus, X, Settings, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (project: ProjectFormData) => void;
}

interface ProjectRole {
  id: string;
  title: string;
  accessType: 'open' | 'invite';
  assignToMe: boolean;
  skills: string[];
}

interface ProjectFormData {
  title: string;
  description: string;
  categories: string[];
  projectUrl: string;
  teamSize: number;
  duration: string;
  roles: ProjectRole[];
  imageColor: string;
}

const AVAILABLE_CATEGORIES = [
  'AI/ML', 'Web 3', 'FinTech', 'SaaS', 'E-commerce', 'Mobile', 'Marketing', 'UX', 'EdTech', 'HealthTech'
];

const AVAILABLE_ROLES = [
  'Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'UI/UX Designer', 
  'Product Manager', 'Data Scientist', 'DevOps Engineer', 'QA Engineer', 'Marketing Lead'
];

const AVAILABLE_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Django', 'REST API', 
  'GraphQL', 'AWS', 'Docker', 'Figma', 'SEO', 'Analytics'
];

const COLOR_OPTIONS = [
  { value: 'hsl(210 80% 85%)', label: 'Blue' },
  { value: 'hsl(340 70% 85%)', label: 'Pink' },
  { value: 'hsl(260 70% 85%)', label: 'Purple' },
];

const TEAM_SIZES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
const DURATIONS = ['2 Weeks', '1 Month', '2 Months', '3 Months', '4 Months', '6 Months', '1 Year'];

export function CreateProjectModal({ open, onOpenChange, onCreateProject }: CreateProjectModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    categories: [],
    projectUrl: '',
    teamSize: 2,
    duration: '2 Months',
    roles: [],
    imageColor: COLOR_OPTIONS[0].value,
  });

  const [currentRole, setCurrentRole] = useState<ProjectRole>({
    id: crypto.randomUUID(),
    title: 'Backend Developer',
    accessType: 'open',
    assignToMe: true,
    skills: [],
  });

  const handleAddCategory = (category: string) => {
    if (formData.categories.length < 3 && !formData.categories.includes(category)) {
      setFormData(prev => ({ ...prev, categories: [...prev.categories, category] }));
    }
  };

  const handleRemoveCategory = (category: string) => {
    setFormData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }));
  };

  const handleAddSkill = (skill: string) => {
    if (!currentRole.skills.includes(skill)) {
      setCurrentRole(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setCurrentRole(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleAddRole = () => {
    if (formData.roles.length < 6) {
      setFormData(prev => ({ ...prev, roles: [...prev.roles, currentRole] }));
      setCurrentRole({
        id: crypto.randomUUID(),
        title: 'Backend Developer',
        accessType: 'open',
        assignToMe: false,
        skills: [],
      });
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      // Add current role if it has skills
      const finalRoles = currentRole.skills.length > 0 
        ? [...formData.roles, currentRole]
        : formData.roles;
      
      onCreateProject?.({ ...formData, roles: finalRoles });
      onOpenChange(false);
      // Reset form
      setStep(1);
      setFormData({
        title: '',
        description: '',
        categories: [],
        projectUrl: '',
        teamSize: 2,
        duration: '2 Months',
        roles: [],
        imageColor: COLOR_OPTIONS[0].value,
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header Background */}
        <div className="relative">
          <div 
            className="h-20 w-full"
            style={{ 
              background: `linear-gradient(135deg, ${formData.imageColor} 0%, hsl(220 20% 60%) 100%)`
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-foreground/70 hover:text-foreground"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Left Column - Image & Colors */}
          <div className="space-y-6">
            {/* Image Upload Area */}
            <div 
              className="aspect-square max-w-[280px] mx-auto rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-border cursor-pointer hover:border-primary/50 transition-colors"
              style={{ backgroundColor: formData.imageColor }}
            >
              <div className="w-20 h-20 rounded-xl bg-card/30 backdrop-blur-sm flex items-center justify-center border border-card/20 mb-4">
                <Grid3X3 className="h-10 w-10 text-card/80" />
              </div>
              <span className="text-primary font-medium">Upload Image</span>
            </div>

            {/* Color Selection */}
            <div className="flex justify-center gap-3">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  className={cn(
                    "w-10 h-10 rounded-full transition-all",
                    formData.imageColor === color.value 
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                      : "hover:scale-110"
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setFormData(prev => ({ ...prev, imageColor: color.value }))}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="space-y-5">
            {step === 1 ? (
              <>
                {/* Categories */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Category(ies)</Label>
                    <span className="text-xs text-muted-foreground">Upto 3</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.categories.map((cat) => (
                      <Badge key={cat} variant="secondary" className="gap-1 pr-1">
                        {cat}
                        <button onClick={() => handleRemoveCategory(cat)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={handleAddCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_CATEGORIES.filter(c => !formData.categories.includes(c)).map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Project URL */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Project URL</Label>
                    <span className="text-xs text-muted-foreground">Optional</span>
                  </div>
                  <Input
                    value={formData.projectUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectUrl: e.target.value }))}
                    placeholder="yourproject.com"
                  />
                </div>

                {/* Project Title */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Project Title</Label>
                    <span className="text-xs text-muted-foreground">{formData.title.length}/50</span>
                  </div>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value.slice(0, 50) }))}
                    placeholder="Project Title"
                    className="text-lg font-medium"
                  />
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>what's this project all about?</Label>
                    <span className="text-xs text-muted-foreground">{formData.description.length}/3500</span>
                  </div>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value.slice(0, 3500) }))}
                    placeholder="Describe your project..."
                    rows={5}
                  />
                </div>
              </>
            ) : (
              <>
                {/* Team Size & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Team Size</Label>
                    <Select 
                      value={formData.teamSize.toString()} 
                      onValueChange={(v) => setFormData(prev => ({ ...prev, teamSize: parseInt(v) || 2 }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TEAM_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Duration</Label>
                    <Select 
                      value={formData.duration} 
                      onValueChange={(v) => setFormData(prev => ({ ...prev, duration: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATIONS.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Project Roles Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Project Roles</h3>
                    <span className="text-sm text-muted-foreground">Max 6 roles</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Current Role Form */}
                    <div className="p-4 border border-border rounded-xl space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                          <Settings className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <Select 
                          value={currentRole.title} 
                          onValueChange={(v) => setCurrentRole(prev => ({ ...prev, title: v }))}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {AVAILABLE_ROLES.map((role) => (
                              <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Your role on this project (you will be auto-assigned).
                      </p>

                      {/* Access Type */}
                      <RadioGroup 
                        value={currentRole.accessType} 
                        onValueChange={(v: 'open' | 'invite') => setCurrentRole(prev => ({ ...prev, accessType: v }))}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="open" id="open" />
                          <Label htmlFor="open" className="cursor-pointer">Open</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="invite" id="invite" />
                          <Label htmlFor="invite" className="cursor-pointer">Invite Only</Label>
                        </div>
                      </RadioGroup>

                      {/* Assign to me */}
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="assignToMe" 
                          checked={currentRole.assignToMe}
                          onCheckedChange={(checked) => setCurrentRole(prev => ({ ...prev, assignToMe: !!checked }))}
                        />
                        <Label htmlFor="assignToMe" className="cursor-pointer text-sm">
                          Assign this role to me (admin)
                        </Label>
                      </div>

                      {/* Skills */}
                      <div>
                        <Label className="mb-2 block">Skills</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {currentRole.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                              {skill}
                              <button onClick={() => handleRemoveSkill(skill)} className="ml-1 hover:text-destructive">
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <Select onValueChange={handleAddSkill}>
                          <SelectTrigger>
                            <SelectValue placeholder="Type or select skill..." />
                          </SelectTrigger>
                          <SelectContent>
                            {AVAILABLE_SKILLS.filter(s => !currentRole.skills.includes(s)).map((skill) => (
                              <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Add Role Card */}
                    <button
                      onClick={handleAddRole}
                      disabled={formData.roles.length >= 6}
                      className="p-4 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center min-h-[200px] hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-8 w-8 text-primary mb-2" />
                      <span className="text-primary font-medium">Add role</span>
                      <span className="text-xs text-muted-foreground mt-1">({formData.roles.length}/6)</span>
                    </button>
                  </div>

                  {/* Added Roles */}
                  {formData.roles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label>Added Roles:</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.roles.map((role) => (
                          <Badge key={role.id} variant="outline" className="gap-2">
                            {role.title}
                            <button 
                              onClick={() => setFormData(prev => ({ 
                                ...prev, 
                                roles: prev.roles.filter(r => r.id !== role.id) 
                              }))}
                              className="hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border">
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          <Button onClick={handleNext} className="gap-2">
            {step === 1 ? 'Next' : 'Create Project'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
