export type LessonProgress = { lessonId: string; completedSentenceIds: string[]; bestScores: Record<string, number>; updatedAt: string; schemaVersion: number };

export interface ProgressStore { load(lessonId: string): LessonProgress | null; save(progress: LessonProgress): void; reset(lessonId?: string): void; }

const key = (lessonId: string) => `sentence-lab:progress:${lessonId}`;

export class LocalProgressStore implements ProgressStore {
  load(lessonId: string) { try { const raw = window.localStorage.getItem(key(lessonId)); return raw ? JSON.parse(raw) as LessonProgress : null; } catch { return null; } }
  save(progress: LessonProgress) { try { window.localStorage.setItem(key(progress.lessonId), JSON.stringify(progress)); } catch { /* storage is optional in MVP */ } }
  reset(lessonId?: string) { try { if (lessonId) window.localStorage.removeItem(key(lessonId)); else Object.keys(window.localStorage).filter((item) => item.startsWith("sentence-lab:progress:")).forEach((item) => window.localStorage.removeItem(item)); } catch { /* storage is optional in MVP */ } }
}
