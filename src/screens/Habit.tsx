import { useRoute } from "@react-navigation/native";
import { Alert, ScrollView, Text, View } from "react-native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";

interface Params {
  date: string;
}

interface DayInfoProps {
  possibleHabits: {
    id: string,
    title: string
  }[],
  completedHabits: string[]
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([])

  const route = useRoute()
  const { date } = route.params as Params;

  const parsedDate = dayjs(date)
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date())
  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM');

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length)
    : 0

  async function fetchHabits() {
    try {
      setLoading(true)

      const response = await api.get('/day', { params: { date }})
      setDayInfo(response.data)
      setCompletedHabits(response.data.completedHabits)

    } catch (error) {
      console.error(error)
      Alert.alert('Ops', 'Did not possible loaded the habit information')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      api.patch(`/habits/${habitId}/toggle`)
      
      if (completedHabits.includes(habitId)) {
        setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
      } else {
        setCompletedHabits(prevState => [...prevState, habitId])
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Ops', 'Unable to update habit status.')
    }
  }

  useEffect(() => {
    fetchHabits();
  }, [])

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className={clsx("mt-6", {
          ["opacity-70"]: isDateInPast
        })}>
          {dayInfo?.possibleHabits.length ?
          dayInfo?.possibleHabits.map(habit => (
            <Checkbox
              key={habit.id}
              title={habit.title}
              checked={completedHabits.includes(habit.id)}
              disabled={isDateInPast}
              onPress={() => handleToggleHabit(habit.id)}
            />
            )
          )
          :
          <HabitsEmpty />
        }
        </View>

        {
          isDateInPast && (
            <Text className="text-white mt-10 text-center">
              You cannot edit habits from past date.
            </Text>
          )
        }

      </ScrollView>
    </View>
  )
}