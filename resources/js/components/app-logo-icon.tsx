import { SVGAttributes } from 'react';
import { Scale } from 'lucide-react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return <Scale {...(props as any)} />;
}
