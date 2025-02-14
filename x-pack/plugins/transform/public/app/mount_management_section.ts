/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { CoreSetup } from '@kbn/core/public';
import { ManagementAppMountParams } from '@kbn/management-plugin/public';
import { Storage } from '@kbn/kibana-utils-plugin/public';

import { PluginsDependencies } from '../plugin';
import { getMlSharedImports } from '../shared_imports';

import { AppDependencies } from './app_dependencies';
import { breadcrumbService } from './services/navigation';
import { docTitleService } from './services/navigation';
import { textService } from './services/text';
import { renderApp } from './app';

const localStorage = new Storage(window.localStorage);

export async function mountManagementSection(
  coreSetup: CoreSetup<PluginsDependencies>,
  params: ManagementAppMountParams
) {
  const { element, setBreadcrumbs, history } = params;
  const { http, getStartServices } = coreSetup;
  const startServices = await getStartServices();
  const [core, plugins] = startServices;
  const {
    application,
    chrome,
    docLinks,
    i18n,
    overlays,
    theme,
    savedObjects,
    uiSettings,
    notifications,
  } = core;
  const {
    data,
    dataViews,
    share,
    spaces,
    triggersActionsUi,
    unifiedSearch,
    charts,
    fieldFormats,
    savedObjectsManagement,
  } = plugins;
  const { docTitle } = chrome;

  // Initialize services
  textService.init();
  docTitleService.init(docTitle.change);
  breadcrumbService.setup(setBreadcrumbs);

  // AppCore/AppPlugins to be passed on as React context
  const appDependencies: AppDependencies = {
    application,
    chrome,
    data,
    dataViews,
    docLinks,
    http,
    i18n,
    notifications,
    overlays,
    theme,
    savedObjects,
    storage: localStorage,
    uiSettings,
    history,
    savedObjectsPlugin: plugins.savedObjects,
    share,
    spaces,
    ml: await getMlSharedImports(),
    triggersActionsUi,
    unifiedSearch,
    charts,
    fieldFormats,
    savedObjectsManagement,
  };

  const unmountAppCallback = renderApp(element, appDependencies);

  return () => {
    docTitle.reset();
    unmountAppCallback();
  };
}
