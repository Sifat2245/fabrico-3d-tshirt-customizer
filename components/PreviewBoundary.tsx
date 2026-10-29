"use client";

import { Component, type ReactNode } from "react";
import { GarmentFallback } from "./GarmentFallback";

export class PreviewBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <GarmentFallback failed /> : this.props.children;
  }
}
