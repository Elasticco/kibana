/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { createJourneyScreenshotRoute } from './journey_screenshots';
import { UMServerLibs } from '../../uptime_server';

describe('journey screenshot route', () => {
  let handlerContext: any;
  beforeEach(() => {
    handlerContext = {
      uptimeEsClient: {
        search: jest.fn().mockResolvedValue({
          body: {
            hits: {
              hits: [],
            },
          },
        }),
      },
      request: {
        params: {
          checkGroup: 'check_group',
          stepIndex: 0,
        },
      },
      response: {
        ok: jest.fn((responseData) => ({ ...responseData, status: 200, message: 'Ok' })),
        notFound: jest.fn().mockReturnValue({ status: 404, message: 'Not found.' }),
      },
    };
  });

  it('will 404 for missing screenshot', async () => {
    const route = createJourneyScreenshotRoute({
      requests: {
        getJourneyScreenshot: jest.fn(),
      },
    } as unknown as UMServerLibs);

    expect(await route.handler(handlerContext as any)).toMatchInlineSnapshot(`
      Object {
        "message": "Not found.",
        "status": 404,
      }
    `);
  });

  it('returns screenshot ref', async () => {
    const mock = {
      '@timestamp': '123',
      monitor: {
        check_group: 'check_group',
      },
      screenshot_ref: {
        width: 100,
        height: 200,
        blocks: [{ hash: 'hash', top: 0, left: 0, height: 10, width: 10 }],
      },
      synthetics: {
        package_version: '1.0.0',
        step: {
          name: 'a step name',
          index: 0,
        },
        type: 'step/screenshot_ref',
      },
      totalSteps: 3,
    };

    handlerContext.uptimeEsClient.search = jest.fn().mockResolvedValue({
      body: {
        hits: {
          total: {
            value: 3,
          },
          hits: [],
        },
        aggregations: { step: { image: { hits: { hits: [{ _source: mock }] } } } },
      },
    });

    const route = createJourneyScreenshotRoute({
      requests: {
        getJourneyScreenshot: jest.fn().mockReturnValue(mock),
      },
    } as unknown as UMServerLibs);

    const response = await route.handler(handlerContext as any);
    expect(response.status).toBe(200);
    // @ts-expect-error incomplete implementation for testing
    expect(response.headers).toMatchInlineSnapshot(`
      Object {
        "cache-control": "max-age=600",
        "caption-name": "a step name",
        "max-steps": "3",
      }
    `);
    // @ts-expect-error incomplete implementation for testing
    expect(response.body.screenshotRef).toEqual(mock);
  });

  it('returns full screenshot blob', async () => {
    const mock = {
      synthetics: {
        blob: 'a blob',
        blob_mime: 'image/jpeg',
        step: {
          name: 'a step name',
        },
        type: 'step/screenshot',
      },
    };

    handlerContext.uptimeEsClient.search = jest.fn().mockResolvedValue({
      body: {
        hits: {
          total: {
            value: 3,
          },
          hits: [],
        },
        aggregations: { step: { image: { hits: { hits: [{ _source: mock }] } } } },
      },
    });

    const route = createJourneyScreenshotRoute({
      requests: {
        getJourneyScreenshot: jest.fn().mockReturnValue(mock),
      },
    } as unknown as UMServerLibs);

    expect(await route.handler(handlerContext as any)).toMatchInlineSnapshot(`
      Object {
        "body": Object {
          "data": Array [
            105,
            185,
            104,
          ],
          "type": "Buffer",
        },
        "headers": Object {
          "cache-control": "max-age=600",
          "caption-name": "a step name",
          "content-type": "image/jpeg",
          "max-steps": "3",
        },
        "message": "Ok",
        "status": 200,
      }
    `);
  });

  it('defaults to png when mime is undefined', async () => {
    const mock = {
      synthetics: {
        blob: 'a blob',
        step: {
          name: 'a step name',
        },
        type: 'step/screenshot',
      },
    };
    handlerContext.uptimeEsClient.search = jest.fn().mockResolvedValue({
      body: {
        hits: {
          total: {
            value: 3,
          },
          hits: [],
        },
        aggregations: { step: { image: { hits: { hits: [{ _source: mock }] } } } },
      },
    });
    const route = createJourneyScreenshotRoute({
      requests: {
        getJourneyScreenshot: jest.fn().mockReturnValue(mock),
      },
    } as unknown as UMServerLibs);

    const response = await route.handler(handlerContext as any);

    expect(response.status).toBe(200);
    // @ts-expect-error incomplete implementation for testing
    expect(response.headers['content-type']).toBe('image/png');
  });

  it('returns 404 for screenshot missing blob', async () => {
    const route = createJourneyScreenshotRoute({
      requests: {
        getJourneyScreenshot: jest.fn().mockReturnValue({
          synthetics: {
            step: {
              name: 'a step name',
            },
            type: 'step/screenshot',
          },
        }),
      },
    } as unknown as UMServerLibs);

    expect(await route.handler(handlerContext)).toMatchInlineSnapshot(`
      Object {
        "message": "Not found.",
        "status": 404,
      }
    `);
  });
});
