// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";
// import * as SplashScreen from "expo-splash-screen";
// import { useEffect, useState } from "react";
// import { Provider } from "react-redux";
// import { persistor, store } from "./redux/store";
// import { PersistGate } from "redux-persist/integration/react";

// SplashScreen.preventAutoHideAsync();

// export default function App() {
//   const [appIsReady, setAppIsReady] = useState(false);

//   useEffect(() => {
//     const prepare = async () => {
//       try {
//         await SplashScreen.hideAsync();
//         await Promise.all([]);
//       } catch (err) {
//         console.warn(err);
//       }
//     };
//     prepare();
//   }, [appIsReady]);

//   useEffect(() => {
//     setAppIsReady(true);
//   }, []);

//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <View style={styles.container}>
//           <Text>Open up App.js to start working on your app!</Text>
//           <StatusBar style="auto" />
//         </View>
//       </PersistGate>
//     </Provider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
