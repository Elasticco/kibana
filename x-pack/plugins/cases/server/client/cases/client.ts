/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type {
  CasePostRequest,
  CasesPatchRequest,
  CasesFindRequest,
  User,
  AllTagsFindRequest,
  AllReportersFindRequest,
  CasesByAlertId,
  CaseResponse,
  CasesBulkGetRequestCertainFields,
  CasesBulkGetResponseCertainFields,
} from '../../../common/api';
import type { CasesClient } from '../client';
import type { CasesClientInternal } from '../client_internal';
import type {
  ICasePostRequest,
  ICaseResolveResponse,
  ICaseResponse,
  ICasesFindRequest,
  ICasesFindResponse,
  ICasesPatchRequest,
  ICasesResponse,
} from '../typedoc_interfaces';
import type { CasesClientArgs } from '../types';
import { bulkGet } from './bulk_get';
import { create } from './create';
import { deleteCases } from './delete';
import { find } from './find';
import type { CasesByAlertIDParams, GetParams } from './get';
import { get, resolve, getCasesByAlertID, getReporters, getTags } from './get';
import type { PushParams } from './push';
import { push } from './push';
import { update } from './update';

/**
 * API for interacting with the cases entities.
 */
export interface CasesSubClient {
  /**
   * Creates a case.
   */
  create(data: ICasePostRequest): Promise<ICaseResponse>;
  /**
   * Returns cases that match the search criteria.
   *
   * If the `owner` field is left empty then all the cases that the user has access to will be returned.
   */
  find(params: ICasesFindRequest): Promise<ICasesFindResponse>;
  /**
   * Retrieves a single case with the specified ID.
   */
  get(params: GetParams): Promise<ICaseResponse>;
  /**
   * @experimental
   * Retrieves a single case resolving the specified ID.
   */
  resolve(params: GetParams): Promise<ICaseResolveResponse>;
  /**
   * Retrieves multiple cases with the specified IDs.
   */
  bulkGet<Field extends keyof CaseResponse = keyof CaseResponse>(
    params: CasesBulkGetRequestCertainFields<Field>
  ): Promise<CasesBulkGetResponseCertainFields<Field>>;
  /**
   * Pushes a specific case to an external system.
   */
  push(args: PushParams): Promise<ICaseResponse>;
  /**
   * Update the specified cases with the passed in values.
   */
  update(cases: ICasesPatchRequest): Promise<ICasesResponse>;
  /**
   * Delete a case and all its comments.
   *
   * @params ids an array of case IDs to delete
   */
  delete(ids: string[]): Promise<void>;
  /**
   * Retrieves all the tags across all cases the user making the request has access to.
   */
  getTags(params: AllTagsFindRequest): Promise<string[]>;
  /**
   * Retrieves all the reporters across all accessible cases.
   */
  getReporters(params: AllReportersFindRequest): Promise<User[]>;
  /**
   * Retrieves the cases ID and title that have the requested alert attached to them
   */
  getCasesByAlertID(params: CasesByAlertIDParams): Promise<CasesByAlertId>;
}

/**
 * Creates the interface for CRUD on cases objects.
 *
 * @ignore
 */
export const createCasesSubClient = (
  clientArgs: CasesClientArgs,
  casesClient: CasesClient,
  casesClientInternal: CasesClientInternal
): CasesSubClient => {
  const casesSubClient: CasesSubClient = {
    create: (data: CasePostRequest) => create(data, clientArgs),
    find: (params: CasesFindRequest) => find(params, clientArgs),
    get: (params: GetParams) => get(params, clientArgs),
    resolve: (params: GetParams) => resolve(params, clientArgs),
    bulkGet: (params) => bulkGet(params, clientArgs),
    push: (params: PushParams) => push(params, clientArgs, casesClient, casesClientInternal),
    update: (cases: CasesPatchRequest) => update(cases, clientArgs),
    delete: (ids: string[]) => deleteCases(ids, clientArgs),
    getTags: (params: AllTagsFindRequest) => getTags(params, clientArgs),
    getReporters: (params: AllReportersFindRequest) => getReporters(params, clientArgs),
    getCasesByAlertID: (params: CasesByAlertIDParams) => getCasesByAlertID(params, clientArgs),
  };

  return Object.freeze(casesSubClient);
};
