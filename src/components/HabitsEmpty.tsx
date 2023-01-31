import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native";

export function HabitsEmpty() {
  const { navigate } = useNavigation()

  return (
    <Text
      className="text-zinc-400 text-base"
    >
      You are not traking any habits in this day yet. {' '}

      <Text className="text-violet-400 text-base underline"
        onPress={() => navigate('newHabit')}
      >
        Start by registering a new habit!
      </Text>
    </Text>
  )
}