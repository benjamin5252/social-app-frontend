import { useRef, useEffect } from 'react';

interface Props {
  url: string;
}

export const TimeoutImg = ({ url }: Props) => {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const element = ref.current;
    setTimeout(() => {
      if (element && !element.complete) {
        element.src = '';
      }
    }, 5000);
  }, []);

  return <>{<img ref={ref} src={url} />}</>;
};
export default TimeoutImg;
