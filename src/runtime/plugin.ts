import { defineNuxtPlugin, useRuntimeConfig } from "#app";

export function createPreprScript(accessToken: string) {
  console.log('createPreprScript', accessToken)
  
  return `
    window.prepr = function() {
      const queue = window.prepr.queue || [];
      if (window.prepr.process) {
        window.prepr.process.apply(window.prepr, arguments);
      } else {
        queue.push(arguments);
      }
      return queue;
    };

    window.prepr.queue = [];
    window.prepr.t = Date.now();

    // Load the Prepr script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://cdn.tracking.prepr.io/js/prepr_v2.min.js?t=' + 
      (864e5 * Math.ceil(Date.now() / 864e5));
    
    document.head.appendChild(script);

    // Initialize Prepr with the access token
    window.prepr('init', '${accessToken}');
    window.prepr('event', 'pageload');
  `;
}


export default defineNuxtPlugin(() => {
  if (import.meta.client) {
  const config = useRuntimeConfig()
  

  if (config.public.prepr.accessToken) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.innerHTML = createPreprScript(config.public.prepr.accessToken)
    document.head.appendChild(script)
  }
}
  
  return {
    provide: {
      prepr: {
        track: (eventName: string, properties?: Record<string, any>) => {
          if (window.prepr) {
            window.prepr('event', eventName, properties)
          }
        },
        identify: (userId: string, traits?: Record<string, any>) => {
          if (window.prepr) {
            window.prepr('identify', userId, traits)
          }
        }
      }
    }
  }
})

