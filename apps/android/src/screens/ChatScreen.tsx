import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant for secure data wiping. I can help you understand different wiping methods, security standards, and guide you through the process. How can I assist you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('wipe') || lowerInput.includes('delete')) {
      return 'For secure data wiping, I recommend using the DoD 5220.22-M standard which performs multiple overwrite passes. Custom wipe allows selective deletion, while complete wipe erases everything. Always backup important data first!';
    } else if (lowerInput.includes('standard') || lowerInput.includes('dod')) {
      return 'The DoD 5220.22-M standard is a US Department of Defense approved method that overwrites data 3 times with different patterns, making recovery virtually impossible. It\'s considered forensic-proof.';
    } else if (lowerInput.includes('backup') || lowerInput.includes('save')) {
      return 'Before any wiping operation, ensure you have backed up all important data to a secure location. Once data is wiped using our methods, it cannot be recovered.';
    } else if (lowerInput.includes('help') || lowerInput.includes('how')) {
      return 'I can help you with: understanding wiping standards, choosing between custom and complete wipe, explaining security features, and guiding you through the process. What specific aspect would you like to know about?';
    } else {
      return 'I understand you\'re asking about data security. Could you be more specific? I can help with wiping methods, security standards, or guide you through using the app features.';
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.botMessage]}>
      <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.botBubble]}>
        {!item.isUser && (
          <View style={styles.avatarContainer}>
            <Icon name="smart-toy" size={20} color="#4ade80" />
          </View>
        )}
        <Text style={[styles.messageText, item.isUser ? styles.userText : styles.botText]}>
          {item.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(10,10,10,0.8)', 'rgba(26,47,26,0.6)', 'rgba(42,74,42,0.4)', 'rgba(26,58,26,0.6)', 'rgba(10,10,10,0.8)']}
        locations={[0, 0.2, 0.4, 0.7, 1]}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask about secure data wiping..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                multiline
                maxLength={500}
              />
              <TouchableOpacity style={styles.sendButtonContainer} onPress={sendMessage}>
                <LinearGradient
                  colors={['#4ade80', '#22c55e']}
                  style={styles.sendButton}
                >
                  <Icon name="send" size={20} color="#000" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  keyboardContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userBubble: {
    backgroundColor: 'rgba(74, 222, 128, 0.9)',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  avatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.5)',
  },
  messageText: {
    fontSize: 16,
    flex: 1,
  },
  userText: {
    color: '#000',
    fontWeight: '500',
  },
  botText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    marginHorizontal: 8,
  },
  inputContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 85 : 65,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  textInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButtonContainer: {
    marginLeft: 12,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;