import { View, Text, TouchableOpacity } from 'react-native';
import tailwind from 'tailwind-rn';
import { CONFIG } from './config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressableScale } from 'react-native-pressable-scale';
import VersionCheck from '../components/VersionCheck';

function TabBar({ state, descriptors, navigation }) {
  return (
    <View style={[
        tailwind("w-full bg-white flex flex-row justify-around items-start pt-1"),
        {
            height: 56 + useSafeAreaInsets().bottom,
        }
    ]}>
      {state.routes.map((route, index) => {
        if(route.name == "Redirect") return null;
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PressableScale
            activeScale={0.75}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
                tailwind("flex justify-center items-center rounded-full"),
                {
                    backgroundColor: isFocused ? CONFIG.green : CONFIG.bg,
                    height: 48,
                    width: 48,
                }
            ]}
            key={index}
          >
            {options.tabBarIcon({focused: isFocused})}
          </PressableScale>
        );
      })}
      <VersionCheck navigation={navigation} />
    </View>
  );
}

export default TabBar;