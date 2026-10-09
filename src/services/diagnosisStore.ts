import { CropDiagnosisResponse } from '../types';

// In-memory fallback session store for diagnoses when running locally or without active Supabase credentials
const memoryStore: Map<string, CropDiagnosisResponse> = new Map();

export function getAllFromMemory(): CropDiagnosisResponse[] {
  return Array.from(memoryStore.values());
}

export function saveToMemory(diagnosis: CropDiagnosisResponse): void {
  memoryStore.set(diagnosis.id, diagnosis);
}

export function getFromMemory(id: string): CropDiagnosisResponse | undefined {
  return memoryStore.get(id);
}

export function deleteFromMemory(id: string): boolean {
  return memoryStore.delete(id);
}
