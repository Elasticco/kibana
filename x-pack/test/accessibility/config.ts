/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { FtrConfigProviderContext } from '@kbn/test';
import { services } from './services';
import { pageObjects } from './page_objects';

export default async function ({ readConfigFile }: FtrConfigProviderContext) {
  const functionalConfig = await readConfigFile(require.resolve('../functional/config.base.js'));

  return {
    ...functionalConfig.getAll(),

    testFiles: [
      require.resolve('./apps/login_page'),
      require.resolve('./apps/kibana_overview'),
      require.resolve('./apps/home'),
      require.resolve('./apps/management'),
      require.resolve('./apps/grok_debugger'),
      require.resolve('./apps/search_profiler'),
      require.resolve('./apps/painless_lab'),
      // https://github.com/elastic/kibana/issues/153601
      // require.resolve('./apps/uptime'),
      require.resolve('./apps/spaces'),
      require.resolve('./apps/advanced_settings'),
      require.resolve('./apps/dashboard_panel_options'),
      require.resolve('./apps/dashboard_controls'),
      require.resolve('./apps/users'),
      require.resolve('./apps/roles'),
      require.resolve('./apps/ingest_node_pipelines'),
      require.resolve('./apps/index_lifecycle_management'),
      // https://github.com/elastic/kibana/issues/153596
      // https://github.com/elastic/kibana/issues/153592
      // require.resolve('./apps/ml'),
      // require.resolve('./apps/transform'),
      require.resolve('./apps/lens'),
      require.resolve('./apps/upgrade_assistant'),
      require.resolve('./apps/canvas'),
      require.resolve('./apps/maps'),
      require.resolve('./apps/graph'),
      require.resolve('./apps/security_solution'),
      require.resolve('./apps/ml_embeddables_in_dashboard'),
      require.resolve('./apps/rules_connectors'),
      // Please make sure that the remote clusters, snapshot and restore and
      // CCR tests stay in that order. Their execution fails if rearranged.
      require.resolve('./apps/remote_clusters'),
      // https://github.com/elastic/kibana/issues/153788
      // require.resolve('./apps/snapshot_and_restore'),
      // https://github.com/elastic/kibana/issues/153599
      // require.resolve('./apps/cross_cluster_replication'),
      require.resolve('./apps/reporting'),
      require.resolve('./apps/enterprise_search'),
      require.resolve('./apps/license_management'),
      require.resolve('./apps/tags'),
      require.resolve('./apps/search_sessions'),
      require.resolve('./apps/stack_monitoring'),
      require.resolve('./apps/watcher'),
      require.resolve('./apps/rollup_jobs'),
      require.resolve('./apps/observability'),
    ],

    pageObjects,
    services,

    junit: {
      reportName: 'X-Pack Accessibility Tests',
    },
  };
}
