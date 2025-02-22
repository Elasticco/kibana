/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { EuiAccordion, EuiFlexGroup, EuiFlexItem, EuiTitle } from '@elastic/eui';
import type { Filter } from '@kbn/es-query';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { firstNonNullValue } from '../../helpers';
import type { RawBucket } from '../types';
import { createGroupFilter } from './helpers';

interface GroupPanelProps<T> {
  customAccordionButtonClassName?: string;
  customAccordionClassName?: string;
  extraAction?: React.ReactNode;
  forceState?: 'open' | 'closed';
  groupBucket: RawBucket<T>;
  groupPanelRenderer?: JSX.Element;
  groupingLevel?: number;
  isLoading: boolean;
  onGroupClose: () => void;
  onToggleGroup?: (isOpen: boolean, groupBucket: RawBucket<T>) => void;
  renderChildComponent: (groupFilter: Filter[]) => React.ReactElement;
  selectedGroup: string;
}

const DefaultGroupPanelRenderer = ({ title }: { title: string }) => (
  <div>
    <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
      <EuiFlexItem>
        <EuiTitle size="xs" className="euiAccordionForm__title">
          <h4 className="eui-textTruncate">{title}</h4>
        </EuiTitle>
      </EuiFlexItem>
    </EuiFlexGroup>
  </div>
);

const GroupPanelComponent = <T,>({
  customAccordionButtonClassName,
  customAccordionClassName = 'groupingAccordionForm',
  extraAction,
  forceState,
  groupBucket,
  groupPanelRenderer,
  groupingLevel = 0,
  isLoading,
  onGroupClose,
  onToggleGroup,
  renderChildComponent,
  selectedGroup,
}: GroupPanelProps<T>) => {
  const lastForceState = useRef(forceState);
  useEffect(() => {
    if (lastForceState.current === 'open' && forceState === 'closed') {
      // when parent group closes, reset pagination of any child groups
      onGroupClose();
      lastForceState.current = 'closed';
    } else if (lastForceState.current === 'closed' && forceState === 'open') {
      lastForceState.current = 'open';
    }
  }, [onGroupClose, forceState, selectedGroup]);

  const groupFieldValue = useMemo(() => firstNonNullValue(groupBucket.key), [groupBucket.key]);

  const groupFilters = useMemo(
    () => createGroupFilter(selectedGroup, groupFieldValue),
    [groupFieldValue, selectedGroup]
  );

  const onToggle = useCallback(
    (isOpen) => {
      if (onToggleGroup) {
        onToggleGroup(isOpen, groupBucket);
      }
    },
    [groupBucket, onToggleGroup]
  );

  return !groupFieldValue ? null : (
    <EuiAccordion
      buttonClassName={customAccordionButtonClassName}
      buttonContent={
        <div data-test-subj="group-panel-toggle" className="groupingPanelRenderer">
          {groupPanelRenderer ?? <DefaultGroupPanelRenderer title={groupFieldValue} />}
        </div>
      }
      buttonElement="div"
      className={groupingLevel > 0 ? 'groupingAccordionFormLevel' : customAccordionClassName}
      data-test-subj="grouping-accordion"
      extraAction={extraAction}
      forceState={forceState}
      isLoading={isLoading}
      id={`group${groupingLevel}-${groupFieldValue}`}
      onToggle={onToggle}
      paddingSize="m"
    >
      <span data-test-subj="grouping-accordion-content">{renderChildComponent(groupFilters)}</span>
    </EuiAccordion>
  );
};

export const GroupPanel = React.memo(GroupPanelComponent);
