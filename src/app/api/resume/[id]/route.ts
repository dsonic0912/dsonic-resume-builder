import { NextRequest, NextResponse } from 'next/server';
import { resumeService } from '@/lib/db/resume-service';

/**
 * GET /api/resume/[id]
 * Get a resume by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resume = await resumeService.getResumeById(params.id);
    
    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/resume/[id]
 * Update a resume field
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { path, value } = await request.json();
    
    if (!path || !Array.isArray(path) || path.length === 0) {
      return NextResponse.json(
        { error: 'Invalid path' },
        { status: 400 }
      );
    }
    
    await resumeService.updateResumeField(params.id, path, value);
    
    // Return the updated resume
    const updatedResume = await resumeService.getResumeById(params.id);
    
    return NextResponse.json({ data: updatedResume });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
