import React, { useEffect, ReactNode, useState } from 'react'

import i18n from '../../i18n'

// fires a GA pageview every time the route changes
type ContainerProps = {
  children: ReactNode
};

const Container = ({ children }: ContainerProps) => {
  const [i18nObj, seti18n] = useState({ isInitialized: false })

  useEffect(() => {
    const init = async () => {
      await i18n.init({
        backend: {
          loadPath: `./locales/{{lng}}.json`
        },
        react: {
          useSuspense: true,
        },
        fallbackLng: 'en',
        preload: ['en'],
        keySeparator: false,
        interpolation: { escapeValue: false },
        debug: true,
      })
      seti18n(i18n)

    }
    if (!i18nObj.isInitialized) {
      init()
    }
  }, [i18nObj, i18n])
  return (
    <>
      {i18nObj.isInitialized && children}
    </>
  );
};
export default Container