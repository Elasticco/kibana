/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type * as estypes from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import type { KibanaRequest, SavedObjectsClientContract } from '@kbn/core/server';
import type {
  UpdateTrainedModelDeploymentRequest,
  UpdateTrainedModelDeploymentResponse,
} from '../../lib/ml_client/types';
import type { GetGuards } from '../shared_services';

export interface TrainedModelsProvider {
  trainedModelsProvider(
    request: KibanaRequest,
    savedObjectsClient: SavedObjectsClientContract
  ): {
    getTrainedModels(
      params: estypes.MlGetTrainedModelsRequest
    ): Promise<estypes.MlGetTrainedModelsResponse>;
    getTrainedModelsStats(
      params: estypes.MlGetTrainedModelsStatsRequest
    ): Promise<estypes.MlGetTrainedModelsStatsResponse>;
    startTrainedModelDeployment(
      params: estypes.MlStartTrainedModelDeploymentRequest
    ): Promise<estypes.MlStartTrainedModelDeploymentResponse>;
    stopTrainedModelDeployment(
      params: estypes.MlStopTrainedModelDeploymentRequest
    ): Promise<estypes.MlStopTrainedModelDeploymentResponse>;
    inferTrainedModel(
      params: estypes.MlInferTrainedModelRequest
    ): Promise<estypes.MlInferTrainedModelResponse>;
    deleteTrainedModel(
      params: estypes.MlDeleteTrainedModelRequest
    ): Promise<estypes.MlDeleteTrainedModelResponse>;
    updateTrainedModelDeployment(
      params: UpdateTrainedModelDeploymentRequest
    ): Promise<UpdateTrainedModelDeploymentResponse>;
    putTrainedModel(
      params: estypes.MlPutTrainedModelRequest
    ): Promise<estypes.MlPutTrainedModelResponse>;
  };
}

export function getTrainedModelsProvider(getGuards: GetGuards): TrainedModelsProvider {
  return {
    trainedModelsProvider(request: KibanaRequest, savedObjectsClient: SavedObjectsClientContract) {
      const guards = getGuards(request, savedObjectsClient);
      return {
        async getTrainedModels(params: estypes.MlGetTrainedModelsRequest) {
          return await guards
            .isFullLicense()
            .hasMlCapabilities(['canGetTrainedModels'])
            .ok(async ({ mlClient }) => {
              return mlClient.getTrainedModels(params);
            });
        },
        async getTrainedModelsStats(params: estypes.MlGetTrainedModelsStatsRequest) {
          return await guards
            .isFullLicense()
            .hasMlCapabilities(['canGetTrainedModels'])
            .ok(async ({ mlClient }) => {
              return mlClient.getTrainedModelsStats(params);
            });
        },
        async startTrainedModelDeployment(params: estypes.MlStartTrainedModelDeploymentRequest) {
          return await guards
            .isFullLicense()
            .hasMlCapabilities(['canStartStopTrainedModels'])
            .ok(async ({ mlClient }) => {
              return mlClient.startTrainedModelDeployment(params);
            });
        },
        async stopTrainedModelDeployment(params: estypes.MlStopTrainedModelDeploymentRequest) {
          return await guards
            .isFullLicense()
            .hasMlCapabilities(['canStartStopTrainedModels'])
            .ok(async ({ mlClient }) => {
              return mlClient.stopTrainedModelDeployment(params);
            });
        },
        async inferTrainedModel(params: estypes.MlInferTrainedModelRequest) {
          return await guards
            .isFullLicense()
            .hasMlCapabilities(['canGetTrainedModels'])
            .ok(async ({ mlClient }) => {
              return mlClient.inferTrainedModel(params);
            });
        },
        async deleteTrainedModel(params: estypes.MlDeleteTrainedModelRequest) {
          return await guards
            .isFullLicense()
            .hasMlCapabilities(['canDeleteTrainedModels'])
            .ok(async ({ mlClient }) => {
              return mlClient.deleteTrainedModel(params);
            });
        },
        async updateTrainedModelDeployment(params: UpdateTrainedModelDeploymentRequest) {
          return await guards
            .isFullLicense()
            .hasMlCapabilities(['canCreateTrainedModels'])
            .ok(async ({ mlClient }) => {
              return mlClient.updateTrainedModelDeployment(params);
            });
        },
        async putTrainedModel(params: estypes.MlPutTrainedModelRequest) {
          return await guards
            .isFullLicense()
            .hasMlCapabilities(['canCreateTrainedModels'])
            .ok(async ({ mlClient }) => {
              return mlClient.putTrainedModel(params);
            });
        },
      };
    },
  };
}
