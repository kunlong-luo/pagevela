import type { FormItem, FormSection } from './form-types';

/**
 * Preserve both section introductions and item details when changing editor
 * modes. The form UI may not be able to edit every arbitrary Markdown construct,
 * but switching modes must never discard its source text.
 */
export function convertFormSectionType(
  section: FormSection,
  nextType: 'text' | 'items',
  contentLang: string,
): FormSection {
  if (section.type === nextType) return section;

  if (nextType === 'items') {
    // Keep a free-form introduction as textValue rather than clearing it.
    // The item editor can add structured entries beside this introduction.
    if (section.items.length > 0 || section.textValue.trim()) {
      return { ...section, type: 'items' };
    }
    const item: FormItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      org: '',
      role: '',
      time: '',
      content: '',
    };
    return { ...section, type: 'items', items: [item] };
  }

  if (section.items.length === 0) return { ...section, type: 'text' };

  const isEn = contentLang === 'en';
  const labels = {
    gpa: isEn ? 'GPA / Performance' : '在校表现',
    courses: isEn ? 'Core Courses' : '主修课程',
    honors: isEn ? 'Honors & Awards' : '荣誉成就',
  };
  const itemMarkdown = section.items.map(item => {
    const heading = [item.org, item.degree, item.role, item.time]
      .filter(Boolean).join(' ｜ ');
    const lines: string[] = [];
    if (heading) lines.push(`### ${heading}`);
    if (item.gpa?.trim()) lines.push(`- **${labels.gpa}**：${item.gpa.trim()}`);
    if (item.courses?.trim()) lines.push(`- **${labels.courses}**：${item.courses.trim()}`);
    if (item.honors?.trim()) lines.push(`- **${labels.honors}**：${item.honors.trim()}`);
    if (item.content?.trim()) lines.push(item.content.trim());
    return lines.join('\n');
  }).filter(Boolean).join('\n\n');
  return {
    ...section,
    type: 'text',
    textValue: [section.textValue.trim(), itemMarkdown]
      .filter(Boolean).join('\n\n'),
    // Without clearing the hidden items the next switch would double the text.
    items: [],
  };
}
