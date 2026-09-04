export interface Contest {
  id: number;
  title: string;
  description: string;
  registrationStart: string;
  registrationEnd: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: string;
  visibility: string;
  registrationRequired: boolean;
  ranked: boolean;
  createdBy: number;
}