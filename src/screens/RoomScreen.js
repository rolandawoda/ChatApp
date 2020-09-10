import React, { useState, useContext, useEffect} from 'react';
import { GiftedChat, Bubble, Send, SystemMessage } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { AuthContext } from '../navigation/AuthProvider';

const RoomScreen = ({route}) => {
    const { thread } = route.params;
    const { user } = useContext(AuthContext);
    const currentUser = user.toJSON();

    useEffect(() => {
        console.log({ user });
      }, []);

    const [messages, setMessages] = useState([
        /**
         * Mock message data
         */
        // example of system message
        {
            _id: 0,
            text: 'New room created.',
            createdAt: new Date().getTime(),
            system: true
        },
        // example of chat message
        {
            _id: 1,
            text: 'Henlo!',
            createdAt: new Date().getTime(),
            user: {
                _id: 1,
                name: 'Test User'
            }
        },
        {
            _id: 2,
            text: 'hello house!',
            createdAt: new Date().getTime(),
            user: {
                _id: 2,
                name: 'Test User'
            }
        }
    ]);

    useEffect(() => {
        const messagesListener = firestore()
          .collection('THREADS')
          .doc(thread._id)
          .collection('MESSAGES')
          .orderBy('createdAt', 'desc')
          .onSnapshot(querySnapshot => {
            const messages = querySnapshot.docs.map(doc => {
              const firebaseData = doc.data();
    
              const data = {
                _id: doc.id,
                text: '',
                createdAt: new Date().getTime(),
                ...firebaseData
              };
    
              if (!firebaseData.system) {
                data.user = {
                  ...firebaseData.user,
                  name: firebaseData.user.email
                };
              }
    
              return data;
            });
    
            setMessages(messages);
          });
    
        return () => messagesListener();
      }, []);

    // helper method that sends a message
    const handleSend = async (messages) => {
        const text = messages[0].text;
        firestore()
          .collection('THREADS')
          .doc(thread._id)
          .collection('MESSAGES')
          .add({
            text,
            createdAt: new Date().getTime(),
            user: {
              _id: currentUser.uid,
              email: currentUser.email
            }
          });

          await firestore()
          .collection('THREADS')
          .doc(thread._id)
          .set(
            {
              latestMessage: {
                text,
                createdAt: new Date().getTime()
              }
            },
            { merge: true }
          );
    }

    const renderBubble = (props) => {
        return (
            // Step 3: return the component
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        // Here is the color change
                        backgroundColor: '#6646ee'
                    }
                }}
                textStyle={{
                    right: {
                        color: '#fff'
                    }
                }}
            />
        );
    }

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <IconButton icon='send-circle' size={32} color='#6646ee' />
                </View>
            </Send>
        );
    }

    const scrollToBottomComponent = () => {
        return (
            <View style={styles.bottomComponentContainer}>
                <IconButton icon='chevron-double-down' size={36} color='#6646ee' />
            </View>
        );
    }

    const renderLoading = () => {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#6646ee' />
            </View>
        );
    }

    const renderSystemMessage = (props) => {
        return (
          <SystemMessage
            {...props}
            wrapperStyle={styles.systemMessageWrapper}
            textStyle={styles.systemMessageText}
          />
        );
      }

    return (
        <GiftedChat
            messages={messages}
            onSend={handleSend}
            user={{ _id: currentUser.uid }}
            renderBubble={renderBubble}
            renderSend={renderSend}
            renderSystemMessage={renderSystemMessage}
            renderLoading={renderLoading}
            showUserAvatar
            placeholder='Type your message here...'
            scrollToBottom
            alwaysShowSend
            scrollToBottomComponent={scrollToBottomComponent}
        />
    );
}

const styles = StyleSheet.create({
    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomComponentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    systemMessageWrapper: {
        backgroundColor: '#6646ee',
        borderRadius: 4,
        padding: 5
      },
    systemMessageText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
      }
});


export default RoomScreen;