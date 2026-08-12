import { SPHttpClient, type SPHttpClientResponse } from '@microsoft/sp-http';

export function escapeODataString(value: string): string {
  return value.replace(/'/g, "''");
}

export async function getSpJson<T>(client: SPHttpClient, url: string): Promise<T> {
  const response: SPHttpClientResponse = await client.get(
    url,
    SPHttpClient.configurations.v1,
    {
      headers: {
        Accept: 'application/json;odata=nometadata'
      }
    }
  );

  if (!response.ok) {
    throw new Error('SharePoint request failed (' + response.status + ')');
  }

  return response.json() as Promise<T>;
}
