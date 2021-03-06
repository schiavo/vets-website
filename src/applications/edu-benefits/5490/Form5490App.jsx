import React from 'react';

import RoutedSavableApp from '../../../platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from './config/form';

export default function Form5490Entry({ location, children }) {
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}
