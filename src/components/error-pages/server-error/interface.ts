export interface IServerErrorViewProps {
  /** Next.js error boundary `reset()` callback for retrying without a full reload. */
  onReset?: () => void;
  homeHref?: string;
}
