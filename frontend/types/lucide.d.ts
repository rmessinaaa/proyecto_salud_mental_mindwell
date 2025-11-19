// frontend/types/lucide.d.ts

import 'lucide-react-native';
import { SvgProps } from 'react-native-svg';

declare module 'lucide-react-native' {
  export interface LucideProps extends SvgProps {
    size?: number | string;
    color?: string;
    fill?: string;  // <--- ¡ESTA ES LA LÍNEA NUEVA QUE FALTABA!
    style?: any;
  }
}