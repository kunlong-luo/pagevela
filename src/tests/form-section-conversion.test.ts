import { describe, expect, it } from 'vitest';
import type { FormSection, ResumeFormModel } from '../lib/form-types';
import { convertFormSectionType } from '../lib/form-section-conversion';
import { parseFormToMarkdown, parseMarkdownToForm } from '../lib/markdown-parser';

const asMarkdown = (section: FormSection): string => parseFormToMarkdown({
  name: 'Tester',
  subtitle: '',
  phone: '',
  email: '',
  social: '',
  experience: '',
  sections: [section],
} satisfies ResumeFormModel);

describe('form section type conversion preserves user data', () => {
  it('keeps free-form content when switching a text section into items', () => {
    const source: FormSection = {
      id: 'experience', title: 'Work Experience', type: 'text',
      textValue: 'Led delivery with 30 engineers.\n\n- Scoped the roadmap.',
      items: [],
    };
    const converted = convertFormSectionType(source, 'items', 'en');
    expect(converted.textValue).toBe(source.textValue);
    const markdown = asMarkdown(converted);
    expect(markdown).toContain('Led delivery with 30 engineers.');
    expect(markdown).toContain('- Scoped the roadmap.');
  });

  it('retains the introduction, headings, details and education fields when changing to text', () => {
    const source: FormSection = {
      id: 'education', title: 'Education', type: 'items',
      textValue: 'Dean’s list and research award.',
      items: [{
        id: 'item1', org: 'Example University', degree: 'BSc',
        role: 'Computer Science', time: '2020–2024',
        gpa: '3.9/4', courses: 'Algorithms', honors: 'Dean’s list',
        content: '- Capstone: built a search engine.',
      }],
    };
    const converted = convertFormSectionType(source, 'text', 'en');
    expect(converted.items).toHaveLength(0);
    const markdown = asMarkdown(converted);
    for (const text of [
      'Dean’s list and research award.', 'Example University', 'BSc',
      'Computer Science', '2020–2024', '3.9/4',
      'Algorithms', 'Dean’s list', 'Capstone',
    ]) expect(markdown).toContain(text);

    // Switching back may change how the UI displays entries, but not source text.
    const switchedBack = convertFormSectionType(converted, 'items', 'en');
    expect(asMarkdown(switchedBack)).toContain('Dean’s list and research award.');
    expect(asMarkdown(switchedBack)).toContain('Example University');
  });

  it('roundtrips a mixed section introduction through Markdown and form parsing', () => {
    const source = [
      '# Tester', '',
      '## Work Experience', '',
      'Led the platform architecture for two years.', '',
      '### Example Corp ｜ Engineer ｜ *2021–2023*',
      '- Increased uptime to 99.9%.', '',
    ].join('\n');
    const model = parseMarkdownToForm(source);
    expect(model.sections[0].type).toBe('items');
    expect(model.sections[0].textValue).toContain('Led the platform');
    const serialized = parseFormToMarkdown(model);
    expect(serialized).toContain('Led the platform architecture for two years.');
    expect(serialized).toContain('Increased uptime to 99.9%.');
  });
});
