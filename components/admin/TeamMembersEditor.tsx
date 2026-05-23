'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Users } from 'lucide-react';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { normalizeTeamMembers, type TeamMemberRecord } from '@/lib/team';
import { cn } from '@/lib/utils';
import { resolveMediaUrl } from '@/lib/media-url';

type Props = {
  members: TeamMemberRecord[];
  onChange: (members: TeamMemberRecord[]) => void;
  activeLang: 'en' | 'ar';
  isRtl?: boolean;
};

export function TeamMembersEditor({
  members,
  onChange,
  activeLang,
  isRtl = false,
}: Props) {
  const list = normalizeTeamMembers(members);

  const updateMember = (
    id: string,
    field: keyof TeamMemberRecord,
    value: string,
    lang?: 'en' | 'ar'
  ) => {
    onChange(
      list.map((m) => {
        if (m.id !== id) return m;
        if (lang && (field === 'name' || field === 'jobTitle' || field === 'bio')) {
          return {
            ...m,
            [field]: { ...m[field], [lang]: value },
          };
        }
        return { ...m, [field]: value };
      })
    );
  };

  const addMember = () => {
    onChange([
      ...list,
      {
        id: `team-${Date.now()}`,
        name: { en: '', ar: '' },
        jobTitle: { en: '', ar: '' },
        bio: { en: '', ar: '' },
        image: '',
        phone: '',
        email: '',
        linkedin: '',
      },
    ]);
  };

  const removeMember = (id: string) => {
    onChange(list.filter((m) => m.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          {isRtl ? 'أعضاء الفريق' : 'Team members'}
        </CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={addMember}>
          <Plus className={cn('w-4 h-4', isRtl ? 'ml-2' : 'mr-2')} />
          {isRtl ? 'إضافة عضو' : 'Add member'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {list.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
            {isRtl ? 'لا يوجد أعضاء بعد.' : 'No team members yet.'}
          </p>
        ) : (
          list.map((member, index) => (
            <div
              key={member.id}
              className="p-4 border rounded-lg bg-card space-y-4 relative group"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 end-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeMember(member.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <p className="font-semibold text-sm border-b pb-2">
                {isRtl ? `عضو #${index + 1}` : `Member #${index + 1}`}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">
                    {isRtl ? 'الاسم' : 'Name'} ({activeLang.toUpperCase()})
                  </Label>
                  <Input
                    value={member.name[activeLang]}
                    onChange={(e) =>
                      updateMember(member.id, 'name', e.target.value, activeLang)
                    }
                    dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    {isRtl ? 'المسمى الوظيفي' : 'Job title'} ({activeLang.toUpperCase()})
                  </Label>
                  <Input
                    value={member.jobTitle[activeLang]}
                    onChange={(e) =>
                      updateMember(member.id, 'jobTitle', e.target.value, activeLang)
                    }
                    dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">
                  {isRtl ? 'نبذة' : 'Bio'} ({activeLang.toUpperCase()})
                </Label>
                <Textarea
                  className="min-h-[80px] text-sm"
                  value={member.bio[activeLang]}
                  onChange={(e) =>
                    updateMember(member.id, 'bio', e.target.value, activeLang)
                  }
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">{isRtl ? 'الهاتف' : 'Phone'}</Label>
                  <Input
                    value={member.phone}
                    onChange={(e) => updateMember(member.id, 'phone', e.target.value)}
                    placeholder="+20..."
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{isRtl ? 'البريد' : 'Email'}</Label>
                  <Input
                    type="email"
                    value={member.email}
                    onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">LinkedIn</Label>
                  <Input
                    value={member.linkedin}
                    onChange={(e) =>
                      updateMember(member.id, 'linkedin', e.target.value)
                    }
                    placeholder="linkedin.com/in/..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">{isRtl ? 'الصورة' : 'Photo'}</Label>
                <div className="flex gap-2 items-center">
                  {member.image && (
                    <img
                      src={resolveMediaUrl(member.image)}
                      alt=""
                      className="h-14 w-14 object-cover rounded border"
                    />
                  )}
                  <MediaSelector
                    onSelect={(url) => updateMember(member.id, 'image', url)}
                    triggerText={
                      member.image
                        ? isRtl
                          ? 'تغيير'
                          : 'Change'
                        : isRtl
                          ? 'اختيار صورة'
                          : 'Pick photo'
                    }
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
