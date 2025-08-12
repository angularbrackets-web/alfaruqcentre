import { Program } from '@/app/types/program';
import programsData from '@/app/data/programs.json';

// Load programs from JSON file (temporary until API is ready)
export function getPrograms(): Program[] {
  return (programsData.programs as Program[]).filter(program => program.status === 'active')
    .sort((a, b) => a.order - b.order);
}

// Get single program by ID
export function getProgramById(id: string): Program | undefined {
  return (programsData.programs as Program[]).find(program => program.id === id);
}

// In the future, these functions will call API endpoints instead of reading JSON directly
export async function fetchPrograms(): Promise<Program[]> {
  try {
    const response = await fetch('/api/programs');
    const data = await response.json();
    if (data.success) {
      return data.data.filter((program: Program) => program.status === 'active')
        .sort((a: Program, b: Program) => a.order - b.order);
    }
    throw new Error(data.message || 'Failed to fetch programs');
  } catch (error) {
    console.error('Error fetching programs:', error);
    // Fallback to local data
    return getPrograms();
  }
}

export async function fetchProgramById(id: string): Promise<Program | null> {
  try {
    const response = await fetch(`/api/programs/${id}`);
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch program');
  } catch (error) {
    console.error('Error fetching program:', error);
    // Fallback to local data
    return getProgramById(id) || null;
  }
}