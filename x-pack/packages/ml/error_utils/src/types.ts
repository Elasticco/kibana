/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type Boom from '@hapi/boom';

import * as estypes from '@elastic/elasticsearch/lib/api/typesWithBodyKey';

import type { IHttpFetchError } from '@kbn/core-http-browser';
import { isPopulatedObject } from '@kbn/ml-is-populated-object';

/**
 * Short hand type of estypes.ErrorCause.
 * @typedef {EsErrorRootCause}
 */
export type EsErrorRootCause = estypes.ErrorCause;

/**
 * Short hand type of estypes.ErrorResponseBase.
 * @typedef {EsErrorBody}
 */
export type EsErrorBody = estypes.ErrorResponseBase;

/**
 * ML Response error
 * @export
 * @interface MLResponseError
 * @typedef {MLResponseError}
 */
export interface MLResponseError {
  /**
   * statusCode
   * @type {number}
   */
  statusCode: number;
  /**
   * error
   * @type {string}
   */
  error: string;
  /**
   * message
   * @type {string}
   */
  message: string;
  /**
   * Optional attributes
   * @type {?{
      body: EsErrorBody;
    }}
   */
  attributes?: {
    body: EsErrorBody;
  };
}

/**
 * Interface holding error message
 * @export
 * @interface ErrorMessage
 * @typedef {ErrorMessage}
 */
export interface ErrorMessage {
  /**
   * message
   * @type {string}
   */
  message: string;
}

/**
 * To be used for client side errors related to search query bars.
 */
export interface QueryErrorMessage extends ErrorMessage {
  /**
   * query
   * @type {string}
   */
  query: string;
}

/**
 * ML Error Object
 * @export
 * @interface MLErrorObject
 * @typedef {MLErrorObject}
 */
export interface MLErrorObject {
  /**
   * Optional causedBy
   * @type {?string}
   */
  causedBy?: string;
  /**
   * message
   * @type {string}
   */
  message: string;
  /**
   * Optional statusCode
   * @type {?number}
   */
  statusCode?: number;
  /**
   * Optional fullError
   * @type {?EsErrorBody}
   */
  fullError?: EsErrorBody;
}

/**
 * MLHttpFetchErrorBase
 * @export
 * @interface MLHttpFetchErrorBase
 * @typedef {MLHttpFetchErrorBase}
 * @template T
 * @extends {IHttpFetchError<T>}
 */
export interface MLHttpFetchErrorBase<T> extends IHttpFetchError<T> {
  /**
   * body
   * @type {T}
   */
  body: T;
}

/**
 * MLHttpFetchError
 * @export
 * @typedef {MLHttpFetchError}
 */
export type MLHttpFetchError = MLHttpFetchErrorBase<MLResponseError>;

/**
 * Union type of error types
 * @export
 * @typedef {ErrorType}
 */
export type ErrorType = MLHttpFetchError | EsErrorBody | Boom.Boom | string | undefined;

/**
 * Type guard to check if error is of type EsErrorBody
 * @export
 * @param {unknown} error
 * @returns {error is EsErrorBody}
 */
export function isEsErrorBody(error: unknown): error is EsErrorBody {
  return isPopulatedObject(error, ['error']) && isPopulatedObject(error.error, ['reason']);
}

/**
 * Type guard to check if error is a string.
 * @export
 * @param {unknown} error
 * @returns {error is string}
 */
export function isErrorString(error: unknown): error is string {
  return typeof error === 'string';
}

/**
 * Type guard to check if error is of type ErrorMessage.
 * @export
 * @param {unknown} error
 * @returns {error is ErrorMessage}
 */
export function isErrorMessage(error: unknown): error is ErrorMessage {
  return isPopulatedObject(error, ['message']) && typeof error.message === 'string';
}

/**
 * Type guard to check if error is of type MLResponseError.
 * @export
 * @param {unknown} error
 * @returns {error is MLResponseError}
 */
export function isMLResponseError(error: unknown): error is MLResponseError {
  return (
    isPopulatedObject(error, ['body']) &&
    isPopulatedObject(error.body, ['message']) &&
    'message' in error.body
  );
}

/**
 * Type guard to check if error is of type Boom.
 * @export
 * @param {unknown} error
 * @returns {error is Boom.Boom}
 */
export function isBoomError(error: unknown): error is Boom.Boom {
  return isPopulatedObject(error, ['isBoom']) && error.isBoom === true;
}
