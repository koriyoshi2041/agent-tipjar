/**
 * Agent Tip Jar - Embeddable Widget
 * 
 * Usage:
 *   <script src="https://your-domain.com/embed.js" 
 *           data-agent="my-agent" 
 *           data-address="0x..."></script>
 * 
 * Or create a button manually:
 *   AgentTipJar.createButton({ agent: 'my-agent', address: '0x...', container: document.body });
 */

(function() {
  'use strict';

  const BASE_URL = document.currentScript?.src.replace('/embed.js', '') || '';

  const AgentTipJar = {
    /**
     * Create a tip button
     * @param {Object} options
     * @param {string} options.agent - Agent name/slug
     * @param {string} options.address - Wallet address
     * @param {string} [options.text] - Button text
     * @param {HTMLElement} [options.container] - Container element
     * @param {string} [options.size] - 'small' | 'medium' | 'large'
     * @param {string} [options.theme] - 'light' | 'dark'
     */
    createButton: function(options) {
      const {
        agent,
        address,
        text = '💰 Tip this Agent',
        container,
        size = 'medium',
        theme = 'light'
      } = options;

      if (!agent || !address) {
        console.error('AgentTipJar: agent and address are required');
        return null;
      }

      const tipUrl = `${BASE_URL}/tip/${agent}?address=${address}`;

      // Create button element
      const button = document.createElement('a');
      button.href = tipUrl;
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
      button.textContent = text;
      button.className = 'agent-tipjar-button';

      // Size styles
      const sizes = {
        small: { padding: '8px 16px', fontSize: '12px' },
        medium: { padding: '12px 24px', fontSize: '14px' },
        large: { padding: '16px 32px', fontSize: '16px' }
      };

      // Theme styles
      const themes = {
        light: { bg: '#0052FF', hover: '#0043CC', text: '#FFFFFF' },
        dark: { bg: '#1a1a2e', hover: '#16213e', text: '#FFFFFF' }
      };

      const s = sizes[size] || sizes.medium;
      const t = themes[theme] || themes.light;

      // Apply styles
      Object.assign(button.style, {
        display: 'inline-block',
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: '600',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: t.bg,
        color: t.text,
        textDecoration: 'none',
        borderRadius: '8px',
        transition: 'background-color 0.2s ease',
        cursor: 'pointer'
      });

      // Hover effect
      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = t.hover;
      });
      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = t.bg;
      });

      // Append to container if provided
      if (container) {
        container.appendChild(button);
      }

      return button;
    },

    /**
     * Open tip modal (for future use)
     */
    openModal: function(options) {
      const { agent, address } = options;
      const tipUrl = `${BASE_URL}/tip/${agent}?address=${address}`;
      window.open(tipUrl, '_blank', 'width=400,height=600');
    }
  };

  // Auto-initialize from script data attributes
  const script = document.currentScript;
  if (script) {
    const agent = script.dataset.agent;
    const address = script.dataset.address;
    const text = script.dataset.text;
    const size = script.dataset.size;
    const theme = script.dataset.theme;
    const containerId = script.dataset.container;

    if (agent && address) {
      // Wait for DOM ready
      const init = () => {
        const container = containerId 
          ? document.getElementById(containerId) 
          : script.parentNode;
        
        AgentTipJar.createButton({
          agent,
          address,
          text,
          size,
          theme,
          container
        });
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    }
  }

  // Expose to global
  window.AgentTipJar = AgentTipJar;
})();
