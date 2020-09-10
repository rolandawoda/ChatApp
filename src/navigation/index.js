import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { AuthProvider } from './AuthProvider';
import DefaultTheme from '../constants/DefaultTheme';
import Routes from './Routes';

/**
 * Wrap all providers here
 */

 const Providers = () => {
  return (
    <PaperProvider 
    settings={{
        icon: props => <MaterialIcons {...props} />,
      }}
        theme={DefaultTheme}
    >
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </PaperProvider>
  );
}

export default Providers;