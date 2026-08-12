import { DrillMeta } from './types';
import { voiceDrill } from './voice';
import { complementDrill } from './complement';
import { subjectObjectDrill } from './subjectObject';
import { posDrill } from './pos';

export * from './types';

export const DRILLS: DrillMeta[] = [voiceDrill, subjectObjectDrill, posDrill, complementDrill];

export const drillByKey = (key?: string): DrillMeta | undefined =>
  DRILLS.find((d) => d.key === key);
