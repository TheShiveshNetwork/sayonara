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
          <Icon name="smart-toy" size={20} color="#e91e63" style={styles.botIcon} />
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about secure data wiping..."
          placeholderTextColor="#888"
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
    backgroundColor: '#e91e63',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#1e1e1e',
    borderBottomLeftRadius: 4,
  },
  botIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  messageText: {
    fontSize: 16,
    flex: 1,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    marginHorizontal: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1a1a1a',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    color: '#fff',
    backgroundColor: '#2a2a2a',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#e91e63',
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;