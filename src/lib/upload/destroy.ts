import { releaseBytes } from "./caps";
import { deleteObjectRecord, forgetDeleteToken, type ObjectRecord } from "./objects";
import { deleteObject } from "./r2";

// The one teardown path. Both the admin dashboard and a delete token land here,
// so an object can never be half-removed: blob gone but quota still charged, or
// record gone but the delete token still resolving to a dead key.
export async function destroyObject(record: ObjectRecord): Promise<void> {
  await deleteObject(record.key); // R2 blob
  await deleteObjectRecord(record.key); // KV metadata
  await forgetDeleteToken(record.deleteHash); // token pointer
  await releaseBytes(record.size); // usage counter
}
