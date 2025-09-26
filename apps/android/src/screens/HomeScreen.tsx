import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = () => {
  const handleCustomWipe = () => {
    Alert.alert(
      'Custom Wipe',
      'Are you sure you want to perform a custom wipe? This will securely delete selected data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Proceed', onPress: () => console.log('Custom wipe initiated') },
      ]
    );
  };

  const handleCompleteWipe = () => {
    Alert.alert(
      'Complete Wipe',
      'WARNING: This will permanently erase ALL data on this device. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'WIPE EVERYTHING',
          style: 'destructive',
          onPress: () => console.log('Complete wipe initiated')
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="security" size={60} color="#e91e63" />
        <Text style={styles.title}>SecureWipe</Text>
        <Text style={styles.subtitle}>Professional Data Erasure Tool</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.customWipeButton} onPress={handleCustomWipe}>
          <View style={styles.buttonContent}>
            <Icon name="cleaning-services" size={40} color="#fff" />
            <Text style={styles.buttonTitle}>Custom Wipe</Text>
            <Text style={styles.buttonDescription}>
              Selectively erase specific files and directories
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.completeWipeButton} onPress={handleCompleteWipe}>
          <View style={styles.buttonContent}>
            <Icon name="delete-forever" size={40} color="#fff" />
            <Text style={styles.buttonTitle}>Complete Wipe</Text>
            <Text style={styles.buttonDescription}>
              Permanently erase all data on device
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Security Features</Text>
        <View style={styles.featureItem}>
          <Icon name="verified" size={24} color="#4caf50" />
          <Text style={styles.featureText}>DoD 5220.22-M Standard</Text>
        </View>
        <View style={styles.featureItem}>
          <Icon name="lock" size={24} color="#4caf50" />
          <Text style={styles.featureText}>Multiple Pass Overwriting</Text>
        </View>
        <View style={styles.featureItem}>
          <Icon name="shield" size={24} color="#4caf50" />
          <Text style={styles.featureText}>Forensic-Proof Deletion</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  customWipeButton: {
    backgroundColor: '#2196f3',
    borderRadius: 16,
    padding: 24,
    elevation: 8,
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  completeWipeButton: {
    backgroundColor: '#f44336',
    borderRadius: 16,
    padding: 24,
    elevation: 8,
    shadowColor: '#f44336',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonContent: {
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  buttonDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 8,
  },
  infoSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
});

export default HomeScreen;