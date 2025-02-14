/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';
import { SyntheticsRestApiRouteFactory } from '../../legacy_uptime/routes';
import { SYNTHETICS_API_URLS } from '../../../common/constants';
import { UMServerLibs } from '../../legacy_uptime/uptime_server';
import { journeyScreenshotHandler } from '../../legacy_uptime/routes/pings/journey_screenshots';

export const createJourneyScreenshotRoute: SyntheticsRestApiRouteFactory = (
  libs: UMServerLibs
) => ({
  method: 'GET',
  path: SYNTHETICS_API_URLS.JOURNEY_SCREENSHOT,
  validate: {
    params: schema.object({
      checkGroup: schema.string(),
      stepIndex: schema.number(),
    }),
  },
  handler: async (routeProps) => {
    return await journeyScreenshotHandler(routeProps);
  },
});
