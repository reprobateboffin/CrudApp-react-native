import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useState, useContext, useEffect } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '@/context/ThemeContext';
import { StatusBar } from 'react-native';
import { Inter_500Medium ,useFonts} from '@expo-google-fonts/inter';
import Octicons from '@expo/vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";


export default function EditScreen(){

    const { id } = useLocalSearchParams()
    const [todo,setTodo] = useState({});
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);

    const router = useRouter()

    const [loaded, error] = useFonts({ Inter_500Medium });

    //when the id changes means new Todo is added to our dynamic route means will have to run the useEffect
    useEffect(()=>{
        const fetchData = async (id) => {
            try {
                const jsonValue = await AsyncStorage.getItem("TodoApp");
                const storageTodos = jsonValue!=null? JSON.parse(jsonValue):null;
                
                if(storageTodos&&storageTodos.length){
                    const myTodo  = storageTodos.find(todo=> todo.id.toString() === id)
                    setTodo(myTodo)
                }

            } catch (error) {
                console.log(error)
                
            
            }
        }
        fetchData(id);

    },[])


    

    if (!loaded && !error) {
        return null;
      }

const styles = createStyles(theme, colorScheme);
      const handleSave = async ()=> {
        try {
            const savedTodo = {...todo, title: todo.title};

            const jsonValue = await AsyncStorage.getItem("TodoApp");
            const storageTodos = jsonValue!=null? JSON.parse(jsonValue):null;

            if(storageTodos&& storageTodos.length){
                const otherTodos = storageTodos.filter(todo=> todo.id!=savedTodo.id)
                const allTodos = [...otherTodos, savedTodo];
                await AsyncStorage.setItem("TodoApp", JSON.stringify(allTodos))
            }
            else{
                await AsyncStorage.setItem("TodoApp",JSON.stringify([savedTodo]));
            }
            router.push('/')
        } catch (error) {
            
        }
      }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            placeholder='Edit Todo'
            placeholderTextColor="gray"
            value={todo.title|| ''}
            onChangeText={(text)=> setTodo({...todo,title:text})}
            />
                <Pressable onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} style={{ marginLeft: 10 }}>
          {colorScheme === 'dark' ? (
            <Octicons name="moon" size={24} color={theme.text} />
          ) : (
            <Octicons name="sun" size={24} color={theme.text} />
          )}
        </Pressable>
            </View>
            <View style={styles.inputContainer}>
                 <Pressable
                 onPress={handleSave}
                 style={styles.saveButton}

                 >
                        <Text style={styles.saveButtonText}>Save</Text>
                 </Pressable>
                 <Pressable
                 onPress={()=> router.push('/')}
                 style={[styles.saveButton, {backgroundColor: "red"}]}

                 >
                        <Text style={[styles.saveButtonText, {color: "black"}]}>Cancel</Text>
                 </Pressable>
            </View>
            <StatusBar style={colorScheme==='dark'? 'light':'dark'} />
        </SafeAreaView>
    )

}

function createStyles(theme, colorScheme){
    return StyleSheet.create({
        container:{
            flex:1,
            width: "100%",
            backgroundColor: theme.background,
        },
        inputContainer:{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            gap:6,
            width: '100%',
            maxWidth: 1024,
            marginHorizontal: 'auto',
            pointerEvents: 'auto',

        },
        input: {
            flex:1,
            borderTopColor: 'gray',
            borderWidth: 1,
            borderRadius:5,
            marginRight:10,
            fontSize: 18,
            fontFamily: 'Inner_500Medium',
            minWidth: 0,
            color: theme.text,

        },
        saveButton:{
            backgroundColor: theme.button,
            borderRadius:5,
            padding:10,
        },
        saveButtonText: {
            fontSize:18,
            color: colorScheme==='dark'? 'black': 'white',
        }
    })
}