import { StyleSheet, Text, View } from 'react-native';
import { RealmProvider } from '@realm/react';
import { Person } from './models/Person';
import Router from './router/Router';
import 'react-native-gesture-handler';
import 'react-native-get-random-values'
import FavoriteContacts from './screens/FavoriteContacts';
import { FavoriteContact } from './models/FavoriteContact';

export default function App() {

  return (
    <RealmProvider schema={[Person, FavoriteContact]} schemaVersion={4}>
      <Router />
    </RealmProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
