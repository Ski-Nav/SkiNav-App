import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapView from 'react-native-maps';

const NavigationScreen = () => {
  const [currentMap, setCurrentMap] = useState<ResortMap>()
  return (
    <View>
      <Text>NavigationScreen</Text>
    </View>
  )
}

export default NavigationScreen

const styles = StyleSheet.create({
  container: {
    flex
  }
})