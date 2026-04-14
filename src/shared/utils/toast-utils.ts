/**
 * Imperative toast utility to show notifications from anywhere in the app.
 */
export type ToastType = "success" | "error" | "info";

export interface ToastEventDetail {
  message: string;
  type: ToastType;
  duration?: number;
}

export const toast = {
  show(message: string, type: ToastType = "info", duration = 3000) {
    const event = new CustomEvent("show-toast", {
      detail: { message, type, duration } as ToastEventDetail,
    });
    window.dispatchEvent(event);
  },
  success(message: string, duration?: number) {
    this.show(message, "success", duration);
  },
  error(message: string, duration?: number) {
    this.show(message, "error", duration);
  },
  info(message: string, duration?: number) {
    this.show(message, "info", duration);
  },
};
