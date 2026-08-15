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

export async function postSpJson<T>(
  client: SPHttpClient,
  url: string,
  body: string,
  extraHeaders?: { [key: string]: string }
): Promise<T | undefined> {
  const headers: { [key: string]: string } = {
    Accept: 'application/json;odata=nometadata',
    'Content-Type': 'application/json;odata=nometadata'
  };
  if (extraHeaders) {
    const keys = Object.keys(extraHeaders);
    for (let i = 0; i < keys.length; i++) {
      headers[keys[i]] = extraHeaders[keys[i]];
    }
  }

  const response: SPHttpClientResponse = await client.post(url, SPHttpClient.configurations.v1, {
    headers,
    body
  });

  if (!response.ok) {
    throw new Error('SharePoint request failed (' + response.status + ')');
  }

  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();
  if (!text) {
    return undefined;
  }

  return JSON.parse(text) as T;
}
