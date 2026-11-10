import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Hackathon Rewards | Rewardlab',
  description: 'An interactive organiser, winner and sponsor rewards prototype. All fulfilment is simulated.',
  robots: { index: false, follow: false },
};
export default function RewardsLayout({children}:{children:React.ReactNode}) { return children; }
