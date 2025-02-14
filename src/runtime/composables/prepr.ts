export function usePrepr() {
  return {
    track: (eventName: string, properties?: Record<string, any>) => {
      if (window.prepr) {
        window.prepr('event', eventName, properties)
      }
    }
  }
}

// Add types for global augmentation
declare global {
  interface Window {
    prepr?: (action: string, ...args: any[]) => void
  }
}
