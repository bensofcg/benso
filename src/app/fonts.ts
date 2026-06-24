import localFont from 'next/font/local';

export const cocogoose = localFont({
  src: [
    {
      path: '../../public/Cocogoose_trial.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/Cocogoose_trial.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-cocogoose',
  display: 'swap',
  preload: true,
});

export const ttCommons = localFont({
  src: [
    {
      path: '../../public/fonnts.com-TT-Commons-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonnts.com-TT-Commons-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonnts.com-TT-Commons-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-tt-commons',
  display: 'swap',
  preload: true,
});
