/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useCallback, useEffect, useState } from 'react';

import { useValues } from 'kea';

import { TextExpansionCallOutProps, TextExpansionCallOutState } from './text_expansion_callout';
import { TextExpansionCalloutLogic } from './text_expansion_callout_logic';

export const TEXT_EXPANSION_CALL_OUT_DISMISSED_KEY =
  'enterprise-search-text-expansion-callout-dismissed';

const isDismissed = () => localStorage.getItem(TEXT_EXPANSION_CALL_OUT_DISMISSED_KEY) === 'true';

export const useTextExpansionCallOutData = ({
  isDismissable = false,
}: TextExpansionCallOutProps): TextExpansionCallOutState => {
  const { isCreateButtonDisabled } = useValues(TextExpansionCalloutLogic);

  const [show, setShow] = useState<boolean>(() => {
    if (!isDismissable) return true;

    try {
      return !isDismissed();
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (!isDismissed()) {
        localStorage.setItem(TEXT_EXPANSION_CALL_OUT_DISMISSED_KEY, JSON.stringify(!show));
      }
    } catch {
      return;
    }
  }, [show]);

  const dismiss = useCallback(() => {
    setShow(false);
  }, []);

  return {
    dismiss,
    isCreateButtonDisabled,
    isDismissable,
    show,
  };
};
