// Builds a ShareX .sxcu custom-uploader config for a given key.
// "Body": "Binary" makes ShareX send the raw file bytes as the request body,
// which is exactly what /api/upload reads with request.arrayBuffer().
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
    },
    null,
    2,
  );
}
