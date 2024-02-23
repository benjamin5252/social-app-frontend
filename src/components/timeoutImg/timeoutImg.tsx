import React, { useRef, useEffect, useState } from 'react';

interface Props {
  url: string;
}

export const TimeoutImg = ({ url }: Props) => {
  const ref = useRef<HTMLImageElement>(null);
  const [isShow, setIsShow] = useState<boolean>(true);
  useEffect(() => {
    const element = ref.current;
    setTimeout(() => {
      if (element && !element.complete) {
        element.setAttr('src', null);
      }
    }, 5000);
  }, []);

  return <>{isShow && <img ref={ref} src={url} />}</>;
};
export default TimeoutImg;
