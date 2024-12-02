//import React from 'react';
import {  render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HowItWorksPage from '../../pages/tsx-files/HowItWorks';


module.exports = {
    // other configurations
    setupFilesAfterEnv: ['./src/setupTests.ts'],
};

jest.mock('react-router-dom', () => ({
    Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

test('renders How It Works page with steps and content', () => {


  const { container } = render(<HowItWorksPage />);
    console.log(container.innerHTML);

  // Check the main header
  expect(screen.getByText('How It Works')).toBeInTheDocument();
  expect(screen.getByText('Learn how to get started with Xplora in a few simple steps!')).toBeInTheDocument();

  // Check all steps
  expect(screen.getByText('Step 1: Sign Up')).toBeInTheDocument();
  expect(screen.getByText('Get started with XPLORA and take the stress out of travel—sign up now to effortlessly organize your trips.')).toBeInTheDocument();

  expect(screen.getByText('Step 2: Add Trips')).toBeInTheDocument();
  expect(screen.getByText('Add your upcoming flights, stays, and activities to your profile and save time for what truly matters—enjoying the journey.')).toBeInTheDocument();

  expect(screen.getByText('Step 3: Customize')).toBeInTheDocument();
  expect(screen.getByText('Tailor your trips your way—add photos, notes, and all the details that matter most.')).toBeInTheDocument();

  expect(screen.getByText('Step 4: Travel Away!')).toBeInTheDocument();
  expect(screen.getByText('We are now ready to XPLORA place together!')).toBeInTheDocument();

  // Check for the navigation buttons
  expect(screen.getByText('Sign In', { selector: '#r-login-btn div' })).toBeInTheDocument();
  expect(screen.getByText('Sign Up', { selector: '#r-register-btn div' })).toBeInTheDocument();
});

test('renders navigation buttons', () => {
    render(<HowItWorksPage />);
    
    // Assert buttons are present using roles and accessible names
    expect(screen.getByText('Sign In', { selector: '#r-login-btn div' })).toBeInTheDocument();
    expect(screen.getByText('Sign Up', { selector: '#r-register-btn div' })).toBeInTheDocument();
});


