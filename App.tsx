import './src/lib/dayjs';
import { StatusBar, Button } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter'

import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';
import { Logs } from 'expo'
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => (
    {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false
    }
  )
})

Logs.enableExpoCliLogging()

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  })

  async function scheduleNotification() {
    const trigger = new Date(Date.now())
    trigger.setMinutes(trigger.getMinutes() + 1)

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Olá, Tester 🥲',
        body: 'Did you practice your habits today?'
      },
      trigger
    })
  }

  async function getScheduledNotification() {
    const schedules = await Notifications.getAllScheduledNotificationsAsync();
    console.log(schedules)
  }


  if (!fontsLoaded) {
    return (
      <Loading />
    )
  }

  return (
    <>
      <Button title='Send Notifications' onPress={scheduleNotification} />
      <Button title='Schedule Notifications' onPress={getScheduledNotification} />
      <Routes />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent  />
    </>
  );
}