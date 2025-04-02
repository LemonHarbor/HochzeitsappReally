// tests/components/LoginPage.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginPage from '../../src/pages/auth/LoginPage.vue';

// Mock composables
vi.mock('../../src/composables/useAuth', () => ({
  useAuth: () => ({
    signIn: vi.fn(),
    signUp: vi.fn(),
    loading: false,
    error: null
  })
}));

vi.mock('../../src/composables/useLanguage', () => ({
  useLanguage: () => ({
    t: (key) => key // Return the key for simplicity
  })
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useRoute: () => ({
    query: {}
  })
}));

describe('LoginPage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    const wrapper = mount(LoginPage);
    
    // Check if important elements are rendered
    expect(wrapper.find('h2').text()).toContain('auth.login');
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('toggles between login and register modes', async () => {
    const wrapper = mount(LoginPage);
    
    // Initially in login mode
    expect(wrapper.find('h2').text()).toContain('auth.login');
    
    // Find and click the register toggle button
    const toggleButton = wrapper.find('button.font-medium.text-primary');
    await toggleButton.trigger('click');
    
    // Should now be in register mode
    expect(wrapper.find('h2').text()).toContain('auth.register');
  });

  it('fills demo login credentials when demo button is clicked', async () => {
    const wrapper = mount(LoginPage);
    
    // Find and click the demo login button
    const demoButton = wrapper.findAll('button.font-medium.text-primary')[1];
    await demoButton.trigger('click');
    
    // Check if email and password inputs are filled with demo values
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');
    
    expect(emailInput.element.value).toBe('demo@lemonvows.de');
    expect(passwordInput.element.value).toBe('demo123');
  });

  it('shows responsive design for mobile devices', () => {
    const wrapper = mount(LoginPage);
    
    // Check for mobile-specific classes
    const mobileStyles = wrapper.find('style');
    expect(mobileStyles.text()).toContain('@media (max-width: 640px)');
    
    // Check for responsive form elements
    const form = wrapper.find('form');
    expect(form.classes()).toContain('space-y-5');
    
    // Check for full-width buttons on mobile
    const buttons = wrapper.findAll('button');
    expect(buttons.some(btn => btn.classes().includes('w-full'))).toBe(true);
  });
});
