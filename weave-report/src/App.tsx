import { ActiveUsersCard } from './components/ActiveUsersCard'
import { BehaviorFlowCard, SignupFunnelCard } from './components/FlowCharts'
import { NewVsReturningCard, TopCountriesCard, TopPagesCard, UpgradeCard } from './components/LeftCards'
import { BounceRateCard, TrendsCard } from './components/LineCharts'
import { Navbar } from './components/Navbar'
import { PageHeader } from './components/PageHeader'

export default function App() {
  return (
    <div className="min-h-dvh bg-white">
      <Navbar />
      <main className="mx-auto max-w-[1440px] px-5 pt-8 pb-10 sm:px-10 lg:pt-8">
        <PageHeader />
        <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,445fr)_minmax(0,899fr)]">
          <div className="grid grid-cols-1 content-start gap-4 md:grid-cols-2 xl:grid-cols-1">
            <ActiveUsersCard />
            <TopCountriesCard />
            <NewVsReturningCard />
            <TopPagesCard />
            <div className="md:col-span-2 xl:col-span-1">
              <UpgradeCard />
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <BounceRateCard />
            <TrendsCard />
            <BehaviorFlowCard />
            <SignupFunnelCard />
          </div>
        </div>
      </main>
    </div>
  )
}
