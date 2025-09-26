import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(10,10,10,0.8)', 'rgba(26,47,26,0.6)', 'rgba(42,74,42,0.4)', 'rgba(26,58,26,0.6)', 'rgba(10,10,10,0.8)']}
        locations={[0, 0.2, 0.4, 0.7, 1]}
        style={styles.gradientBackground}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Icon name="security" size={60} color="#4ade80" />
            <Text style={styles.title}>SecureWipe</Text>
            <Text style={styles.subtitle}>Professional Data Erasure Tool</Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleCustomWipe}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.9)', 'rgba(37, 99, 235, 0.9)']}
                style={styles.customWipeButton}
              >
                <View style={styles.buttonContent}>
                  <Icon name="cleaning-services" size={40} color="#fff" />
                  <Text style={styles.buttonTitle}>Custom Wipe</Text>
                  <Text style={styles.buttonDescription}>
                    Selectively erase specific files and directories
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCompleteWipe}>
              <LinearGradient
                colors={['rgba(239, 68, 68, 0.9)', 'rgba(220, 38, 38, 0.9)']}
                style={styles.completeWipeButton}
              >
                <View style={styles.buttonContent}>
                  <Icon name="delete-forever" size={40} color="#fff" />
                  <Text style={styles.buttonTitle}>Complete Wipe</Text>
                  <Text style={styles.buttonDescription}>
                    Permanently erase all data on device
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Security Features</Text>
            <View style={styles.featureItem}>
              <Icon name="verified" size={24} color="#4ade80" />
              <Text style={styles.featureText}>DoD 5220.22-M Standard</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="lock" size={24} color="#4ade80" />
              <Text style={styles.featureText}>Multiple Pass Overwriting</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="shield" size={24} color="#4ade80" />
              <Text style={styles.featureText}>Forensic-Proof Deletion</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  customWipeButton: {
    borderRadius: 16,
    padding: 24,
    elevation: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  completeWipeButton: {
    borderRadius: 16,
    padding: 24,
    elevation: 8,
    shadowColor: '#ef4444',
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
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
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