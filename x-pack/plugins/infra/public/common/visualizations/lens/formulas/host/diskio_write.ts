/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { LensChartConfig } from '../../../types';
import { getFilters } from './utils';

export const diskIOWrite: LensChartConfig = {
  title: 'Disk Write IOPS',
  formula: {
    formula: "counter_rate(max(system.diskio.write.bytes), kql='system.diskio.write.bytes: *')",
    format: {
      id: 'bytes',
      params: {
        decimals: 1,
      },
    },
  },
  getFilters,
};
