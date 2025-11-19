import { useLocalSearchParams } from 'expo-router';
import NameView from '../components/NameView';

export default function DynamicCategoryPage() {
  const { name } = useLocalSearchParams<{ name: string }>();
  return <NameView categoryName={name} />;
}
