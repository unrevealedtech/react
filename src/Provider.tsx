import React, { useState } from 'react';
import { UnrevealedContext } from './context';
import { User } from './types';
import { useFetchFeatureFlags } from './useFetchFeatureFlags';
import { useTrackUser } from './useTrackUser';

export interface UnrevealedProviderProps {
  clientKey: string;
  children: React.ReactNode;
  user?: User | undefined | null;
  wait?: boolean;
}

interface AdditionalProps {
  trackingUrl?: string | undefined;
}

export function UnrevealedProvider({
  clientKey,
  user,
  children,
  wait,
  ...props
}: UnrevealedProviderProps) {
  const { trackingUrl } = props as AdditionalProps;
  const [features, setFeatures] = useState<string[]>([]);
  const [filteredFeatures, setFilteredFeatures] = useState<string[]>([]);

  const { loading, error } = useFetchFeatureFlags(
    clientKey,
    user,
    setFeatures,
    {
      wait: !!wait,
    },
  );
  useTrackUser(clientKey, user, { wait: !!wait, trackingUrl });

  const activeFeatures =
    filteredFeatures.length > 0
      ? features.filter((feature) => !filteredFeatures.includes(feature))
      : features;

  return (
    <UnrevealedContext.Provider
      value={{
        allFeatures: features,
        activeFeatures,
        loading,
        error,
        filteredFeatures,
        setFilteredFeatures,
      }}
    >
      {children}
    </UnrevealedContext.Provider>
  );
}
