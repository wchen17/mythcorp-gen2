// Builds a ShareX .sxcu custom-uploader config for a given key.
// "Body": "Binary" makes ShareX send the raw file bytes as the request body,
// which is exactly what /api/upload reads with request.arrayBuffer().
// DeletionURL and ThumbnailURL are standard .sxcu fields every long-standing
// host fills in: ShareX shows a delete button per upload in its history, and
// uses the thumbnail in that list.
export function shareXConfig(origin: string, rawKey: string): string {
  return JSON.stringify(
    {
      Version: '14.1.0',
      Name: 'MYTHCORP Upload',
      DestinationType: 'ImageUploader',
      RequestMethod: 'POST',
      RequestURL: `${origin}/api/upload`,
      Headers: { Authorization: `Bearer ${rawKey}` },
      Body: 'Binary',
      URL: '{json:url}',
      ThumbnailURL: '{json:url}',
      DeletionURL: '{json:deleteUrl}',
    },
    null,
    2,
  );
}
