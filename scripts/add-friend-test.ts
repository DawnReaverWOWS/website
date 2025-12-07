import { db } from '../src/db';
import { friendsOfClan } from '../src/db/schema';

async function addTestFriend() {
  try {
    // Add TheAncients as a test former member
    await db.insert(friendsOfClan).values({
      accountId: 1000000001, // Placeholder account ID
      nickname: 'TheAncients',
      role: 'officer', // Adjust role as needed
      joinedAt: new Date('2025-01-30'), // Joined Jan 30, 2025
      leftAt: new Date('2025-05-30'), // Left May 30, 2025
      reason: 'retired', // Optional reason
      notes: 'Former officer who served with distinction', // Optional notes
    });

    console.log('✅ Successfully added TheAncients to Friends of the Clan');
  } catch (error) {
    console.error('❌ Failed to add friend:', error);
  }

  process.exit(0);
}

addTestFriend();
