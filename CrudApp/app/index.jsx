import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext } from "react";
import { data } from '@/data/todos.js';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFonts, Inter_500Medium } from "@expo-google-fonts/inter";
import { ThemeContext } from "../context/ThemeContext";
import Octicons from '@expo/vector-icons/Octicons';

export default function Index() {
  const [todos, setTodos] = useState(data.sort((a, b) => b.id - a.id));
  const [text, setText] = useState('');
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  if (!loaded && !error) {
    return null;
  }

  const styles = createStyles(theme, colorScheme);

  const addTodo = () => {
    const newId = todos.length > 0 ? todos[0].id + 1 : 1;
    setTodos([{ id: newId, title: text, completed: true }, ...todos]);
    setText('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text style={[styles.todoText, item.completed && styles.completedText]}
        onPress={() => toggleTodo(item.id)}
      >
        {item.title}
      </Text>
      <Pressable onPress={() => removeTodo(item.id)}>
        <AntDesign name="delete" size={36} color="red" selectable={undefined} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new todo"
          placeholderTextColor="grey"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
        <Pressable onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} style={{ marginLeft: 10 }}>
          {colorScheme === 'dark' ? (
            <Octicons name="moon" size={36} color={theme.text} selectable={undefined} style={{ width: 36 }} />
          ) : (
            <Octicons name="sun" size={36} color={theme.text} selectable={undefined} style={{ width: 36 }} />
          )}
        </Pressable>
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      padding: 10,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    input: {
      flex: 1,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      fontFamily: 'Inter_500Medium',
      marginRight: 10,
      fontSize: 18,
      minWidth: 0,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === 'dark' ? 'black' : 'white',
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: 'gray',
    },
  });
}
