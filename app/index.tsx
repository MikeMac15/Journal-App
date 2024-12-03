import { Button, Text, View } from "react-native";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import GoogleSignInButton, { getUserIdNameFromAsyncStorage, signUserOut, } from "@/components/GoogleSignIn";
import { useEffect, useState } from "react";


import { UserProvider } from "@/components/Context/UserContext";
import Home from "@/Home/Home";
import { useFonts } from "expo-font";
import MainHeader from "@/Home/HomeUI/MainHeader";

// Configure Google Sign-In with your webClientId for iOS
GoogleSignin.configure({
  webClientId: '291215475883-qauh32tjga2qlive148kt17nrrq8efmc.apps.googleusercontent.com',
});

export default function Index() {
  const [fontsLoaded] = useFonts({
    'Handlee-Regular': require('../assets/fonts/Handlee-Regular.ttf'),
  });


  return (
      <View style={{marginTop:20}}>
          
          <Home />
          {/* <Button title="sign out" onPress={()=>signUserOut()} /> */}
      </View>
  )
}