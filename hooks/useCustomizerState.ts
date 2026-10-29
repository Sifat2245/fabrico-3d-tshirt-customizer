'use client';

import { useState, useEffect, useCallback } from 'react';
import { STUDIO_TEMPLATES } from '@/data/studio';
import { createStudioPreset } from '@/lib/studio-presets';
import {
  CustomizerState,
  DEFAULT_STATE,
  FABRICO_STORAGE_KEY,
  TextLayer,
  LogoLayer,
} from '../app/customizer/components/types';

type PersistableState = Omit<CustomizerState, 'loadedLogoImages' | 'loadedPatterns'>;

function loadFromStorage(): PersistableState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  const query = new URLSearchParams(window.location.search);
  const template = STUDIO_TEMPLATES.find((item) => item.id === query.get('template'));
  if (template) return createStudioPreset(template.id, query.get('color') ?? undefined);
  try {
    const raw = localStorage.getItem(FABRICO_STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<PersistableState>;
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveToStorage(state: PersistableState) {
  if (typeof window === 'undefined') return;
  try {
    const { ...toSave } = state;
    localStorage.setItem(FABRICO_STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // quota exceeded — ignore
  }
}

export function useCustomizerState() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<CustomizerState>(() => ({
    ...DEFAULT_STATE,
    loadedLogoImages: {},
    loadedPatterns: {},
  }));

  useEffect(() => {
    const restored = loadFromStorage();
    setState({ ...restored, loadedLogoImages: {}, loadedPatterns: {} });
    saveToStorage(restored);
    setHydrated(true);
    const url = new URL(window.location.href);
    if (STUDIO_TEMPLATES.some((template) => template.id === url.searchParams.get('template'))) {
      url.searchParams.delete('template');
      url.searchParams.delete('color');
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    }

    let cancelled = false;
    const images = restored.logoLayers.map((layer) => ({ src: layer.src, kind: 'loadedLogoImages' as const }));
    const patterns = [restored.fabricPatternFront, restored.fabricPatternBack]
      .filter((src) => src && src !== 'None')
      .map((src) => ({ src, kind: 'loadedPatterns' as const }));
    [...images, ...patterns].forEach(({ src, kind }) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        if (!cancelled) setState((previous) => ({ ...previous, [kind]: { ...previous[kind], [src]: image } }));
      };
      image.src = src;
    });
    return () => { cancelled = true; };
  }, []);

  // Persist on every change (excluding runtime image caches)
  useEffect(() => {
    if (!hydrated) return;
    const { loadedLogoImages: _a, loadedPatterns: _b, ...rest } = state;
    saveToStorage(rest);
  }, [state, hydrated]);

  const update = useCallback(<K extends keyof CustomizerState>(key: K, value: CustomizerState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateMany = useCallback((patch: Partial<CustomizerState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  // Image preloading — loads a src into loadedLogoImages cache
  const preloadImage = useCallback((src: string) => {
    setState((prev) => {
      if (prev.loadedLogoImages[src]) return prev; // already loaded
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = () => {
        setState((p) => ({
          ...p,
          loadedLogoImages: { ...p.loadedLogoImages, [src]: img },
        }));
      };
      return prev; // return unchanged while loading
    });
  }, []);

  // Fabric pattern preloading
  const preloadPattern = useCallback((src: string) => {
    setState((prev) => {
      if (prev.loadedPatterns[src]) return prev;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = () => {
        setState((p) => ({
          ...p,
          loadedPatterns: { ...p.loadedPatterns, [src]: img },
        }));
      };
      return prev;
    });
  }, []);

  // ── Text layer operations ────────────────────────────────────────────────────
  const addTextLayer = useCallback((layer: TextLayer) => {
    setState((prev) => ({
      ...prev,
      textLayers: [...prev.textLayers, layer],
      layersOrder: [...prev.layersOrder, layer.id],
    }));
  }, []);

  const updateTextLayer = useCallback((id: string, patch: Partial<TextLayer>) => {
    setState((prev) => ({
      ...prev,
      textLayers: prev.textLayers.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
  }, []);

  const deleteTextLayer = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      textLayers: prev.textLayers.filter((l) => l.id !== id),
      layersOrder: prev.layersOrder.filter((x) => x !== id),
    }));
  }, []);

  // ── Logo layer operations ────────────────────────────────────────────────────
  const addLogoLayer = useCallback((layer: LogoLayer) => {
    setState((prev) => ({
      ...prev,
      logoLayers: [...prev.logoLayers, layer],
      layersOrder: [...prev.layersOrder, layer.id],
    }));
  }, []);

  const updateLogoLayer = useCallback((id: string, patch: Partial<LogoLayer>) => {
    setState((prev) => ({
      ...prev,
      logoLayers: prev.logoLayers.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
  }, []);

  const deleteLogoLayer = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      logoLayers: prev.logoLayers.filter((l) => l.id !== id),
      layersOrder: prev.layersOrder.filter((x) => x !== id),
    }));
  }, []);

  const moveLayer = useCallback((id: string, direction: 'up' | 'down') => {
    setState((prev) => {
      const order = [...prev.layersOrder];
      const idx = order.indexOf(id);
      if (idx === -1) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= order.length) return prev;
      [order[idx], order[newIdx]] = [order[newIdx], order[idx]];
      return { ...prev, layersOrder: order };
    });
  }, []);

  const clearAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      textLayers: [],
      logoLayers: [],
      layersOrder: [],
      designPattern: 'plain',
      fabricPatternFront: 'None',
      fabricPatternBack: 'None',
    }));
  }, []);

  const resetAll = useCallback(() => {
    setState({
      ...DEFAULT_STATE,
      loadedLogoImages: {},
      loadedPatterns: {},
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(FABRICO_STORAGE_KEY);
    }
  }, []);

  return {
    state,
    update,
    updateMany,
    preloadImage,
    preloadPattern,
    addTextLayer,
    updateTextLayer,
    deleteTextLayer,
    addLogoLayer,
    updateLogoLayer,
    deleteLogoLayer,
    moveLayer,
    clearAll,
    resetAll,
  };
}
