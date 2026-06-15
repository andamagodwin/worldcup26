import { Image } from 'react-native';

interface FlagProps {
  uri?: string;
  size?: number;
}

/** Rounded team flag. Falls back to a neutral placeholder when uri is missing. */
export function Flag({ uri, size = 28 }: FlagProps) {
  return (
    <Image
      source={
        uri
          ? { uri }
          : require('../assets/icon.png') /* generic fallback for TBD slots */
      }
      style={{ width: size, height: size * 0.7, borderRadius: 4 }}
      className="bg-surface2"
      resizeMode="cover"
    />
  );
}
