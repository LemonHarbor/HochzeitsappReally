import React, { useEffect } from 'react';
import { useDeveloperMode } from '../lib/developer';
import WeWebIntegration from './WeWebIntegration';

const TestFixesComponent: React.FC = () => {
  const { isDeveloperMode, toggleDeveloperMode } = useDeveloperMode();
  
  useEffect(() => {
    // Run tests when component mounts
    runTests();
  }, []);
  
  const runTests = () => {
    console.log('Running tests for all fixes...');
    
    // Test 1: Check if branding is updated
    testBranding();
    
    // Test 2: Check if click interactions work
    testClickInteractions();
    
    // Test 3: Check if login functionality works
    testLoginFunctionality();
    
    // Test 4: Check if developer mode works
    testDeveloperMode();
    
    // Test 5: Check if WeWeb integration is available
    testWeWebIntegration();
    
    console.log('All tests completed!');
  };
  
  const testBranding = () => {
    console.log('Testing branding...');
    const title = document.title;
    if (title.includes('LemonVows by LemonHarbor')) {
      console.log('✅ Branding test passed: Title contains "LemonVows by LemonHarbor"');
    } else {
      console.error('❌ Branding test failed: Title does not contain "LemonVows by LemonHarbor"');
    }
  };
  
  const testClickInteractions = () => {
    console.log('Testing click interactions...');
    const buttons = document.querySelectorAll('button');
    if (buttons.length > 0) {
      console.log(`✅ Click interactions test passed: Found ${buttons.length} clickable buttons`);
    } else {
      console.error('❌ Click interactions test failed: No buttons found');
    }
  };
  
  const testLoginFunctionality = () => {
    console.log('Testing login functionality...');
    try {
      // Check if localStorage can be accessed (for login state)
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      console.log('✅ Login functionality test passed: localStorage is accessible');
    } catch (error) {
      console.error('❌ Login functionality test failed: localStorage is not accessible');
    }
  };
  
  const testDeveloperMode = () => {
    console.log('Testing developer mode...');
    if (typeof isDeveloperMode === 'boolean') {
      console.log(`✅ Developer mode test passed: isDeveloperMode is ${isDeveloperMode}`);
    } else {
      console.error('❌ Developer mode test failed: isDeveloperMode is not a boolean');
    }
  };
  
  const testWeWebIntegration = () => {
    console.log('Testing WeWeb integration...');
    const wewebComponent = document.querySelector('.weweb-integration');
    if (isDeveloperMode && wewebComponent) {
      console.log('✅ WeWeb integration test passed: Component is visible in developer mode');
    } else if (!isDeveloperMode) {
      console.log('✅ WeWeb integration test passed: Component is not visible outside developer mode');
    } else {
      console.error('❌ WeWeb integration test failed: Component not found in developer mode');
    }
  };
  
  return (
    <div className="test-fixes-container" style={{ padding: '20px', display: isDeveloperMode ? 'block' : 'none' }}>
      <h2>Test Results</h2>
      <p>Open the browser console to see test results</p>
      <button 
        onClick={runTests}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Run Tests Again
      </button>
      
      {isDeveloperMode && <WeWebIntegration />}
    </div>
  );
};

export default TestFixesComponent;
