import { NextResponse } from 'next/server';
import { getPublishedCategories } from '@/lib/api';
import { getLocalCollections } from '@/lib/collectionsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const collections = await getPublishedCategories();
    if (collections && collections.length > 0) {
      return NextResponse.json({ success: true, collections });
    }
    const local = getLocalCollections().filter(c => c.is_published !== false);
    return NextResponse.json({ success: true, collections: local });
  } catch (err) {
    console.error('Error fetching collections:', err);
    const local = getLocalCollections().filter(c => c.is_published !== false);
    return NextResponse.json({ success: true, collections: local }, { status: 200 });
  }
}
