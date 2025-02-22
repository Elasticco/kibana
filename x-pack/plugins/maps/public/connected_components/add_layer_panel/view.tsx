/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { Component } from 'react';
import {
  EuiTitle,
  EuiFlyoutHeader,
  EuiFlyoutFooter,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiButtonEmpty,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n-react';
import { FlyoutBody } from './flyout_body';
import { LayerDescriptor } from '../../../common/descriptor_types';
import { LayerWizard } from '../../classes/layers';
import {
  type LayerWizardStep,
  type RenderSecondaryActionButtonProps,
  getWizardById,
} from '../../classes/layers/wizards/layer_wizard_registry';

export const ADD_LAYER_STEP_ID = 'ADD_LAYER_STEP_ID';
const ADD_LAYER_STEP_LABEL = i18n.translate('xpack.maps.addLayerPanel.addLayer', {
  defaultMessage: 'Add layer',
});
const ADD_LAYER_STEP_NEXT_BUTTON_LABEL = i18n.translate(
  'xpack.maps.addLayerPanel.addLayerNextButtonLabel',
  {
    defaultMessage: 'Add and continue',
  }
);
const ADD_LAYER_STEP_SECONDARY_ACTION_BUTTON_LABEL = i18n.translate(
  'xpack.maps.addLayerPanel.addLayerSecondaryActionButtonLabel',
  {
    defaultMessage: 'Add and close',
  }
);

export interface Props {
  addPreviewLayers: (layerDescriptors: LayerDescriptor[]) => void;
  closeFlyout: () => void;
  hasPreviewLayers: boolean;
  isLoadingPreviewLayers: boolean;
  addLayersAndClose: () => void;
  addLayersAndContinue: () => void;
  enableEditMode: () => void;
  autoOpenLayerWizardId: string;
  clearAutoOpenLayerWizardId: () => void;
}

interface State {
  currentStepIndex: number;
  currentStep: LayerWizardStep | null;
  layerSteps: LayerWizardStep[] | null;
  layerWizard: LayerWizard | null;
  isNextStepBtnEnabled: boolean;
  isStepLoading: boolean;
}

const INITIAL_STATE: State = {
  currentStepIndex: 0,
  currentStep: null,
  layerSteps: null,
  layerWizard: null,
  isNextStepBtnEnabled: false,
  isStepLoading: false,
};

export class AddLayerPanel extends Component<Props, State> {
  state = {
    ...INITIAL_STATE,
  };

  componentDidMount() {
    if (this.props.autoOpenLayerWizardId) {
      this._openWizard();
    }
  }

  _openWizard() {
    const selectedWizard = getWizardById(this.props.autoOpenLayerWizardId);
    if (selectedWizard) {
      this._onWizardSelect(selectedWizard);
    }
    this.props.clearAutoOpenLayerWizardId();
  }

  _previewLayers = (layerDescriptors: LayerDescriptor[]) => {
    this.props.addPreviewLayers(layerDescriptors);
  };

  _clearLayerWizard = () => {
    this.setState(INITIAL_STATE);
    this.props.addPreviewLayers([]);
  };

  _onWizardSelect = (layerWizard: LayerWizard) => {
    const layerSteps = [
      ...(layerWizard.prerequisiteSteps ? layerWizard.prerequisiteSteps : []),
      {
        id: ADD_LAYER_STEP_ID,
        label: ADD_LAYER_STEP_LABEL,
        nextButtonLabel: ADD_LAYER_STEP_NEXT_BUTTON_LABEL,
        renderSecondaryActionButton: ({
          isDisabled,
          isLoading,
          addLayersAndClose,
        }: RenderSecondaryActionButtonProps) => {
          return (
            <EuiButton
              disabled={isDisabled || isLoading}
              isLoading={isLoading}
              onClick={addLayersAndClose}
            >
              {ADD_LAYER_STEP_SECONDARY_ACTION_BUTTON_LABEL}
            </EuiButton>
          );
        },
      },
    ];
    this.setState({
      ...INITIAL_STATE,
      layerWizard,
      layerSteps,
      currentStep: layerSteps[0],
    });
  };

  _onNext = () => {
    if (!this.state.layerSteps) {
      return;
    }

    if (this.state.layerSteps.length - 1 === this.state.currentStepIndex) {
      // last step
      this.props.addLayersAndContinue();
      if (this.state.layerWizard?.showFeatureEditTools) {
        this.props.enableEditMode();
      }
    } else {
      this.setState((prevState) => {
        const nextIndex = prevState.currentStepIndex + 1;
        return {
          currentStepIndex: nextIndex,
          currentStep: prevState.layerSteps![nextIndex],
          isNextStepBtnEnabled: false,
          isStepLoading: false,
        };
      });
    }
  };

  _enableNextBtn = () => {
    this.setState({ isNextStepBtnEnabled: true });
  };

  _disableNextBtn = () => {
    this.setState({ isNextStepBtnEnabled: false });
  };

  _startStepLoading = () => {
    this.setState({ isStepLoading: true });
  };

  _stopStepLoading = () => {
    this.setState({ isStepLoading: false });
  };

  _renderNextButton() {
    if (!this.state.currentStep) {
      return null;
    }

    let isDisabled = !this.state.isNextStepBtnEnabled;
    let isLoading = this.state.isStepLoading;
    if (this.state.currentStep.id === ADD_LAYER_STEP_ID) {
      isDisabled = !this.props.hasPreviewLayers;
      isLoading = this.props.isLoadingPreviewLayers;
    } else {
      isDisabled = !this.state.isNextStepBtnEnabled;
      isLoading = this.state.isStepLoading;
    }

    const nextButton = (
      <EuiFlexItem grow={false}>
        <EuiButton
          data-test-subj="importFileButton"
          disabled={isDisabled || isLoading}
          isLoading={isLoading}
          iconSide="right"
          iconType={'arrowRight'}
          onClick={this._onNext}
          fill
        >
          {this.state.currentStep.nextButtonLabel
            ? this.state.currentStep.nextButtonLabel
            : this.state.currentStep.label}
        </EuiButton>
      </EuiFlexItem>
    );

    return this.state.currentStep.renderSecondaryActionButton ? (
      <EuiFlexItem grow={false}>
        <EuiFlexGroup responsive={false} gutterSize="s">
          <EuiFlexItem grow={false}>
            {this.state.currentStep.renderSecondaryActionButton({
              isDisabled,
              isLoading,
              addLayersAndClose: this.props.addLayersAndClose,
            })}
          </EuiFlexItem>
          {nextButton}
        </EuiFlexGroup>
      </EuiFlexItem>
    ) : (
      nextButton
    );
  }

  render() {
    return (
      <>
        <EuiFlyoutHeader hasBorder className="mapLayerPanel__header">
          <EuiTitle size="s">
            <h2>{this.state.currentStep ? this.state.currentStep.label : ADD_LAYER_STEP_LABEL}</h2>
          </EuiTitle>
        </EuiFlyoutHeader>

        <FlyoutBody
          layerWizard={this.state.layerWizard}
          onClear={this._clearLayerWizard}
          onWizardSelect={this._onWizardSelect}
          previewLayers={this._previewLayers}
          showBackButton={!this.state.isStepLoading}
          currentStepId={this.state.currentStep ? this.state.currentStep.id : null}
          isOnFinalStep={
            this.state.currentStep ? this.state.currentStep.id === ADD_LAYER_STEP_ID : false
          }
          enableNextBtn={this._enableNextBtn}
          disableNextBtn={this._disableNextBtn}
          startStepLoading={this._startStepLoading}
          stopStepLoading={this._stopStepLoading}
          advanceToNextStep={this._onNext}
        />

        <EuiFlyoutFooter className="mapLayerPanel__footer">
          <EuiFlexGroup justifyContent="spaceBetween" responsive={false} gutterSize="none">
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                onClick={this.props.closeFlyout}
                flush="left"
                data-test-subj="layerAddCancelButton"
              >
                <FormattedMessage
                  id="xpack.maps.addLayerPanel.footer.cancelButtonLabel"
                  defaultMessage="Cancel"
                />
              </EuiButtonEmpty>
            </EuiFlexItem>
            {this._renderNextButton()}
          </EuiFlexGroup>
        </EuiFlyoutFooter>
      </>
    );
  }
}
