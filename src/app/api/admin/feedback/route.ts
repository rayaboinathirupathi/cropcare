import { NextRequest, NextResponse } from 'next/server';
import { FeedbackReport } from '@/types';

const feedbackStore: FeedbackReport[] = [
  {
    id: 'fb_demo_01',
    diagnosisId: 'diag_sample_01',
    farmerFeedback: 'accurate',
    userNotes: 'Recommended Tricyclazole dosage matched what my local KVK advisor instructed.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    reviewedByAdmin: true,
  }
];

export async function GET() {
  return NextResponse.json({
    totalFeedback: feedbackStore.length,
    reports: feedbackStore,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { diagnosisId, feedbackType, userNotes, actualProblemReported } = body;

    if (!diagnosisId || !feedbackType) {
      return NextResponse.json(
        { error: 'Diagnosis ID and feedback rating are required.' },
        { status: 400 }
      );
    }

    const newReport: FeedbackReport = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      diagnosisId,
      farmerFeedback: feedbackType,
      userNotes,
      actualProblemReported,
      createdAt: new Date().toISOString(),
      reviewedByAdmin: false,
    };

    feedbackStore.unshift(newReport);

    return NextResponse.json(
      { success: true, message: 'Thank you. Your feedback helps our agricultural team improve.' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to record feedback.' },
      { status: 500 }
    );
  }
}
